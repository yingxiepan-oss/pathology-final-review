(function () {
  "use strict";

  const review = window.pathologyReviewData || {};
  const bank = window.pathologyBankData || { items: [], rawFallback: [], coverage: {}, syllabus: {} };
  const topics = review.topics || {};
  const learningKey = "pathology-learning-state-v3";
  const choiceKey = "pathology-choice-progress-v1";
  const lastKey = "pathology-last-position-v1";
  const examKey = "pathology-exam-config-v1";
  const legacyKey = "pathology-theory-progress-v2";
  const pageSize = 80;

  const tierLabels = { core: "核心高频", high: "高频", past: "历年出现过", supplement: "大纲 / PPT补漏", archive: "全量归档" };
  const kindLabels = { choice: "选择题", judgment: "判断题", term: "名词解释", long: "简答 / 论述", case: "病例分析", raw: "原文待核对" };
  const typeLabels = { choice: "选择题", term: "名词解释", short: "简答 / 论述", case: "病例分析", raw: "原文待核对" };
  const matchLabels = { exact: "题库原题 / 高度同源", same: "题库同考点", none: "题库未命中", unavailable: "不可比较" };
  const viewInfo = {
    route: ["24H ROUTE", "复习路线", "先按历年复现频次学习，再用全量题库补漏。"],
    termRecognition: ["TERM RECOGNITION", "英文名解速认", "题干只显示英文；点击对应中文后立即判定。"],
    selectedShort: ["STRUCTURED ANSWERS", "精选大题", "简答与论述单独计频；核心高频和高频默认展开。"],
    selectedTerms: ["ACTIVE RECALL", "精选名词解释", "先默写，再按“定义＋形态/机制＋意义”核对。"],
    selectedChoices: ["CHOICE PRACTICE", "精选选择题", "选择题只按选择题频次排序，跨题型频次不能虚增。"],
    selectedCases: ["DIAGNOSIS CHAIN", "精选病例分析", "先诊断，再写证据、病理变化与症状机制。"],
    chapters: ["CHAPTERS", "按章节复习", "正式大纲理论章节优先；范围外章节只在全量题库保留。"],
    past: ["PAST PAPERS", "历年同源题", "按年份、专业与题型查看原始回忆及对应母题。"],
    all: ["FULL BANK", "全量题库", "保留学习指导全部解析题、历年题和范围外补充题。"],
    raw: ["AUDIT", "原文待核对", "OCR缺答案、缺选项或边界不稳定的内容不会被静默删除。"],
    wrong: ["REVIEW LOOP", "错题 / 需回看", "做过、答对与已掌握分开记录。"],
    last30: ["LAST 30 MINUTES", "最后30分钟", "只汇总未掌握的核心高频、高频及主动标记题。"],
    random: ["RANDOM", "随机抽题", "从当前筛选后的题目中随机抽取。"],
  };

  const state = {
    view: "route", query: "", chapter: "all", type: "all", source: "all", stage: "all",
    hideMastered: false, onlyUndone: false, showAllAnswers: false, limit: pageSize, randomItem: null,
  };

  const els = {
    summary: document.querySelector("#summary-strip"), content: document.querySelector("#content"),
    kicker: document.querySelector("#view-kicker"), title: document.querySelector("#view-title"),
    description: document.querySelector("#view-description"), meta: document.querySelector("#result-meta"),
    search: document.querySelector("#search-input"), chapter: document.querySelector("#chapter-filter"),
    type: document.querySelector("#type-filter"), source: document.querySelector("#source-filter"),
    stage: document.querySelector("#stage-filter"), hideMastered: document.querySelector("#hide-mastered"),
    onlyUndone: document.querySelector("#only-undone"), reset: document.querySelector("#reset-button"),
    random: document.querySelector("#random-button"), continue: document.querySelector("#continue-button"),
    answerToggle: document.querySelector("#answer-toggle"), mobileMenu: document.querySelector("#mobile-menu"),
    sidebar: document.querySelector("#sidebar"), toast: document.querySelector("#toast"),
    nav: [...document.querySelectorAll("[data-view]")],
  };

  let learning = loadJson(learningKey, {});
  let choiceProgress = loadJson(choiceKey, {});
  let lastPosition = loadJson(lastKey, null);
  let examConfig = loadJson(examKey, { examAt: review.examAt || bank.syllabus?.examTime || "2026-06-29T13:00:00+08:00" });
  migrateLegacy();

  const conceptById = new Map((review.concepts || []).map((item) => [item.conceptId, item]));
  const paperById = new Map((review.papers || []).map((item) => [item.id, item]));
  const bankItems = (bank.items || []).map(normalizeBankItem);
  const historicalItems = buildHistoricalItems();
  const rawItems = (bank.rawFallback || []).map((item) => ({
    ...item, typeKey: "raw", displayType: "原文待核对", sourceType: "raw", sourceLabel: item.sourceFile,
    title: item.issue, prompt: item.rawText, stage: item.inCurrentSyllabus ? "raw" : "out-of-scope",
  }));
  const bankById = new Map(bankItems.map((item) => [item.id, item]));
  const historicalByConcept = groupBy(historicalItems, (item) => item.conceptId);
  const evidenceCache = new Map();
  const selectedPools = Object.fromEntries(Object.entries(review.pools || {}).map(([key, values]) => [key, values.map((item) => normalizeConcept(item, key))]));
  const selectedMain = Object.fromEntries(Object.entries(selectedPools).map(([key, values]) => [key, values.filter((item) => ["core", "high"].includes(item.tier))]));
  const termRecognitionItems = buildTermRecognitionItems(selectedMain.term || []);
  const recognitionById = new Map(termRecognitionItems.map((item) => [item.id, item]));
  const fullItems = [...bankItems, ...historicalItems, ...rawItems];
  const uniquePaperCount = new Set((review.papers || []).map((item) => item.groupId)).size;

  init();

  function init() {
    initFilters();
    bindEvents();
    document.querySelectorAll("[data-count]").forEach((node) => {
      node.textContent = node.dataset.count === "recognition" ? termRecognitionItems.length : selectedMain[node.dataset.count]?.length || 0;
    });
    render();
    window.setInterval(renderSummary, 30000);
  }

  function loadJson(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; } catch (_) { return fallback; }
  }

  function saveJson(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

  function migrateLegacy() {
    if (Object.keys(learning).length) return;
    const legacy = loadJson(legacyKey, {});
    Object.entries(legacy).forEach(([id, value]) => {
      learning[id] = { wrong: Boolean(value?.wrong), review: false, mastered: Boolean(value?.mastered) };
    });
    if (Object.keys(learning).length) saveJson(learningKey, learning);
  }

  function normalizeBankItem(item) {
    const typeKey = item.kind === "term" ? "term" : item.kind === "long" ? "short" : "choice";
    return {
      ...item,
      typeKey,
      displayType: kindLabels[item.kind] || item.kind,
      sourceType: "guide",
      sourceLabel: item.sourceFile,
      chineseTitle: item.kind === "term" ? item.title : "",
      englishTitle: item.kind === "term" ? item.english : "",
      stage: item.inCurrentSyllabus ? "full-bank" : "out-of-scope",
      tier: "archive",
      answer: item.reciteAnswer,
      originalAnswer: item.originalExplanation,
      sourceRef: `${item.sourceFile} · PDF p${item.sourcePage} · 原题${item.originalNo}`,
    };
  }

  function buildHistoricalItems() {
    const result = [];
    (review.papers || []).forEach((paper) => (paper.sections || []).forEach((section, sectionIndex) => (section.items || []).forEach((raw, itemIndex) => {
      const concept = conceptById.get(raw.conceptId) || {};
      const typeKey = raw.typeKey === "note" ? "raw" : raw.typeKey;
      const profile = answerProfileFor(concept, typeKey);
      const id = raw.id || `past-${paper.id}-${sectionIndex}-${itemIndex}`;
      result.push({
        ...raw, id, typeKey, displayType: section.type, title: raw.prompt, prompt: raw.prompt,
        chapter: topics[raw.topic]?.chapter || concept.chapter || "待确认", paperId: paper.id,
        paperLabel: paper.label, groupId: paper.groupId, sourceType: "historical", sourceLabel: paper.source,
        sourceRef: `${paper.label} · ${paper.source}`, stage: typeKey === "raw" ? "raw" : "historical",
        tier: concept.tiers?.[typeKey] || "past", answer: profile?.examPoints || raw.answer || concept.answer || "",
        correctAnswer: raw.correctAnswer || answerToOption(raw.options || [], raw.answer || ""),
        originalAnswer: raw.answer || "", keywords: profile?.logicPoints || concept.keywords || [],
        textbookBasis: profile?.textbookBasis || "", auditedSources: profile?.sources || [],
        auditStatus: profile?.auditStatus || "", auditNote: profile?.auditNote || "",
        englishTitle: typeKey === "term" ? concept.englishTitle || (/^[A-Za-z]/.test(raw.prompt || "") ? raw.prompt : "") : "",
        chineseTitle: typeKey === "term" ? concept.chineseTitle || (/^[A-Za-z]/.test(raw.prompt || "") ? "中文名待核对" : raw.prompt) : "",
        frequency: concept[`${typeKey}Frequency`] || 1, totalFrequency: concept.totalFrequency || 1,
        paperLabels: concept.paperLabels || [paper.label], variants: concept.variants || [],
      });
    })));
    return result;
  }

  function normalizeConcept(concept, typeKey) {
    const evidence = findBankEvidence(concept, typeKey);
    const historical = historicalByConcept.get(concept.conceptId) || [];
    const trainingVariant = historical.find((item) => item.typeKey === typeKey && item.options?.length >= 2 && item.answer)
      || (evidence && evidence.typeKey === typeKey ? evidence : null);
    const frequency = concept[`${typeKey}Frequency`] || 0;
    const typeName = typeLabels[typeKey];
    const profile = answerProfileFor(concept, typeKey);
    const answer = profile?.examPoints || concept.answer || trainingVariant?.answer || trainingVariant?.originalAnswer || "";
    const profileRefs = (profile?.sources || []).map((source) => source.ref).filter(Boolean);
    return {
      ...concept,
      id: concept.conceptId,
      typeKey,
      displayType: typeName,
      prompt: concept.title,
      tier: concept.tiers?.[typeKey] || "archive",
      stage: concept.tiers?.[typeKey] || "archive",
      sourceType: profile?.sourceMode || (concept.answerSource?.type === "ppt" ? "ppt" : concept.answerSource?.type === "studyGuide" ? "guide" : "synthesis"),
      sourceLabel: profile?.sourceLabel || concept.answerSource?.label || "综合整理",
      sourceRef: profileRefs.join("；") || concept.answerSource?.refs?.join("；") || concept.bankRef,
      frequency,
      recentFrequency: concept[`recent${capitalize(typeKey)}Frequency`] || 0,
      answer,
      originalAnswer: evidence?.originalAnswer || evidence?.originalExplanation || "",
      keywords: profile?.logicPoints || (evidence?.keywords?.length ? evidence.keywords : defaultKeywords(concept.title, typeKey)),
      keywordMode: profile ? "教材化考场答案审校" : evidence?.keywordMode || "人工答题框架",
      textbookBasis: profile?.textbookBasis || "",
      auditedSources: profile?.sources || [],
      auditStatus: profile?.auditStatus || "",
      auditNote: profile?.auditNote || "",
      options: trainingVariant?.options || [],
      correctAnswer: trainingVariant?.correctAnswer || answerToOption(trainingVariant?.options || [], trainingVariant?.answer || ""),
      multiple: Boolean(trainingVariant?.multiple),
      questionSubtype: trainingVariant?.questionSubtype || "A1",
      trainingPrompt: trainingVariant?.prompt && normalize(trainingVariant.prompt) !== normalize(concept.title) ? trainingVariant.prompt : "",
      evidenceId: evidence?.id || "",
    };
  }

  function answerProfileFor(concept, typeKey) {
    return concept?.answerProfiles?.[typeKey] || null;
  }

  function findBankEvidence(concept, typeKey) {
    const key = `${concept.conceptId}:${typeKey}`;
    if (evidenceCache.has(key)) return evidenceCache.get(key);
    const expectedKind = typeKey === "term" ? ["term"] : typeKey === "short" || typeKey === "case" ? ["long"] : ["choice", "judgment"];
    const variants = [concept.title, concept.chineseTitle, concept.englishTitle, ...(concept.variants || []).map((item) => item.prompt)].filter(Boolean);
    const candidates = bankItems.filter((item) => expectedKind.includes(item.kind) && chapterCompatible(concept.chapter, item.chapter));
    let best = null;
    let bestScore = 0;
    candidates.forEach((candidate) => {
      const score = Math.max(...variants.map((text) => similarity(text, `${candidate.title || ""} ${candidate.english || ""} ${candidate.prompt || ""}`)));
      if (score > bestScore) { best = candidate; bestScore = score; }
    });
    const threshold = typeKey === "term" ? 0.42 : 0.28;
    const value = bestScore >= threshold ? best : null;
    evidenceCache.set(key, value);
    return value;
  }

  function chapterCompatible(conceptChapter, bankChapter) {
    const a = normalize(conceptChapter).replace(/系统|疾病|和|与/g, "");
    const b = normalize(bankChapter).replace(/系统|疾病|和|与/g, "");
    return !a || !b || a.includes(b) || b.includes(a) || ({ 适应与损伤: "细胞组织适应损伤", 局部血液循环: "局部血液循环障碍", 生殖与乳腺: "生殖乳腺" }[conceptChapter] || "").split(" ").some((part) => part && b.includes(normalize(part)));
  }

  function similarity(a, b) {
    const aa = normalize(a), bb = normalize(b);
    if (!aa || !bb) return 0;
    if (aa === bb) return 1;
    if ((aa.includes(bb) || bb.includes(aa)) && Math.min(aa.length, bb.length) >= 4) return .88;
    const grams = (value) => new Set([...Array(Math.max(0, value.length - 1))].map((_, i) => value.slice(i, i + 2)));
    const ga = grams(aa), gb = grams(bb);
    let common = 0; ga.forEach((gram) => { if (gb.has(gram)) common += 1; });
    return (2 * common) / Math.max(1, ga.size + gb.size);
  }

  function answerToOption(options, answer) {
    if (!answer || !options.length) return "";
    if (/^[A-H]+$/.test(String(answer).trim())) return String(answer).trim();
    const normalizedOptions = options.map((option, index) => typeof option === "string" ? { key: String.fromCharCode(65 + index), text: option } : option);
    const normalizedAnswer = normalize(answer);
    const found = normalizedOptions.find((option) => normalizedAnswer === normalize(option.text) || normalizedAnswer.startsWith(normalize(option.text)));
    return found?.key || "";
  }

  function defaultKeywords(title, typeKey) {
    if (typeKey === "case") return ["诊断", "题干证据", "肉眼/镜下", "症状机制", "并发症/鉴别"];
    if (/比较|区别|鉴别|异同/.test(title || "")) return ["共同点", "核心差异", "肉眼差异", "镜下差异", "临床意义"];
    if (typeKey === "short") return ["病因/诱因", "发病机制", "肉眼", "镜下", "结局/并发症", "临床联系"];
    return [];
  }

  function buildTermRecognitionItems(terms) {
    const candidates = terms.map((term) => ({ ...term, recognitionEnglish: reliableTermEnglish(term) }))
      .filter((term) => term.recognitionEnglish && term.chineseTitle && term.chineseTitle !== "中文名待核对");
    return candidates.map((term) => {
      const sameChapter = candidates.filter((candidate) => candidate.id !== term.id && candidate.chapter === term.chapter);
      const otherChapters = candidates.filter((candidate) => candidate.id !== term.id && candidate.chapter !== term.chapter);
      const distractors = uniqueBy([
        ...seededShuffle(sameChapter, `${term.id}:same`),
        ...seededShuffle(otherChapters, `${term.id}:other`),
      ], (candidate) => candidate.chineseTitle).slice(0, 3);
      const optionTerms = seededShuffle([term, ...distractors], `${term.id}:options`);
      const options = optionTerms.map((candidate, index) => ({ key: String.fromCharCode(65 + index), text: candidate.chineseTitle }));
      const correctAnswer = options.find((option) => option.text === term.chineseTitle)?.key || "A";
      return {
        ...term,
        id: `recognition-${term.id}`,
        conceptId: term.id,
        typeKey: "choice",
        displayType: "英文名解速认",
        title: term.recognitionEnglish,
        prompt: term.recognitionEnglish,
        englishTitle: term.recognitionEnglish,
        recognition: true,
        options,
        correctAnswer,
        multiple: false,
        answer: [`中文：${term.chineseTitle}`, ...asPoints(term.answer)],
        sourceLabel: term.sourceLabel || "历年名词解释",
      };
    });
  }

  function reliableTermEnglish(term) {
    if (term.englishTitle && /^[A-Za-z]/.test(term.englishTitle)) return term.englishTitle.trim();
    const variant = (term.variants || []).map((item) => String(item.prompt || "").trim()).find((prompt) => /^[A-Za-z][A-Za-z0-9\s().\-/]+$/.test(prompt));
    return variant || "";
  }

  function seededShuffle(values, seedText) {
    const result = [...values];
    let seed = 2166136261;
    for (const char of String(seedText)) { seed ^= char.charCodeAt(0); seed = Math.imul(seed, 16777619) >>> 0; }
    for (let index = result.length - 1; index > 0; index -= 1) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const target = seed % (index + 1);
      [result[index], result[target]] = [result[target], result[index]];
    }
    return result;
  }

  function initFilters() {
    const chapters = [...new Set(fullItems.map((item) => item.chapter).filter(Boolean))].sort((a, b) => a.localeCompare(b, "zh-CN"));
    fillSelect(els.chapter, [["all", "全部章节"], ...chapters.map((value) => [value, value])]);
    fillSelect(els.type, [["all", "全部题型"], ["choice", "选择 / 判断"], ["term", "名词解释"], ["short", "简答 / 论述"], ["case", "病例分析"], ["raw", "原文待核对"]]);
    fillSelect(els.source, [["all", "全部来源"], ["historical", "历年题"], ["guide", "学习指导 / 题库"], ["ppt", "课程PPT"], ["textbook", "教材补充"], ["combined", "PPT＋教材综合"], ["synthesis", "综合整理"], ["raw", "待核对原文"]]);
    fillSelect(els.stage, [["all", "全部阶段"], ["core", "核心高频（≥3套）"], ["high", "高频（2套）"], ["past", "历年出现过（1套）"], ["supplement", "大纲 / PPT补漏"], ["full-bank", "全量题库"], ["historical", "历年原题"], ["out-of-scope", "大纲外补充"], ["raw", "原文待核对"]]);
  }

  function fillSelect(element, options) {
    element.innerHTML = options.map(([value, label]) => `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`).join("");
  }

  function bindEvents() {
    els.nav.forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));
    els.search.addEventListener("input", () => updateFilter("query", els.search.value.trim()));
    [[els.chapter, "chapter"], [els.type, "type"], [els.source, "source"], [els.stage, "stage"]]
      .forEach(([element, key]) => element.addEventListener("change", () => updateFilter(key, element.value)));
    els.hideMastered.addEventListener("change", () => updateFilter("hideMastered", els.hideMastered.checked));
    els.onlyUndone.addEventListener("change", () => updateFilter("onlyUndone", els.onlyUndone.checked));
    els.reset.addEventListener("click", resetFilters);
    els.random.addEventListener("click", randomQuestion);
    els.continue.addEventListener("click", continueLast);
    els.answerToggle.addEventListener("click", toggleAllAnswers);
    els.mobileMenu.addEventListener("click", () => els.sidebar.classList.toggle("open"));
    els.content.addEventListener("click", handleContentClick);
    els.content.addEventListener("change", handleContentChange);
  }

  function updateFilter(key, value) { state[key] = value; state.limit = pageSize; render(); }

  function resetFilters() {
    Object.assign(state, { query: "", chapter: "all", type: "all", source: "all", stage: "all", hideMastered: false, onlyUndone: false, limit: pageSize });
    els.search.value = ""; els.chapter.value = "all"; els.type.value = "all"; els.source.value = "all"; els.stage.value = "all";
    els.hideMastered.checked = false; els.onlyUndone.checked = false; render();
  }

  function setView(view, options = {}) {
    state.view = view; state.randomItem = null; state.limit = pageSize;
    els.nav.forEach((button) => button.classList.toggle("active", button.dataset.view === view));
    els.sidebar.classList.remove("open");
    render();
    if (!options.noScroll) window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function render() {
    const info = viewInfo[state.view] || viewInfo.route;
    els.kicker.textContent = info[0]; els.title.textContent = info[1]; els.description.textContent = info[2];
    renderSummary();
    if (state.view === "route") return renderRoute();
    if (state.view === "termRecognition") return renderTermRecognition();
    if (state.view === "selectedShort") return renderSelected("short");
    if (state.view === "selectedTerms") return renderSelected("term");
    if (state.view === "selectedChoices") return renderSelected("choice");
    if (state.view === "selectedCases") return renderSelected("case");
    if (state.view === "chapters") return renderChapters();
    if (state.view === "past") return renderPastPapers();
    if (state.view === "all") return renderFullBank();
    if (state.view === "raw") return renderRaw();
    if (state.view === "wrong") return renderReviewLoop();
    if (state.view === "last30") return renderLast30();
    if (state.view === "random") return renderRandom();
  }

  function renderSummary() {
    const remaining = new Date(examConfig.examAt).getTime() - Date.now();
    const mastered = Object.values(learning).filter((item) => item?.mastered).length;
    const returnCount = Object.values(learning).filter((item) => item?.wrong || item?.review).length;
    const stats = [
      ["距考试", remaining <= 0 ? "考试已开始" : formatDuration(remaining), "countdown"],
      ["精选选择", `${selectedMain.choice?.length || 0}题`, ""], ["精选名解", `${selectedMain.term?.length || 0}题`, ""],
      ["精选大题", `${selectedMain.short?.length || 0}题`, ""], ["精选病例", `${selectedMain.case?.length || 0}题`, ""],
      ["已掌握 / 待回炉", `${mastered} / ${returnCount}`, ""],
    ];
    els.summary.innerHTML = stats.map(([label, value, className]) => `<div class="stat ${className}"><b>${escapeHtml(value)}</b><span>${escapeHtml(label)}</span></div>`).join("");
  }

  function renderRoute() {
    const counts = Object.fromEntries(Object.entries(selectedMain).map(([key, values]) => [key, values.length]));
    const coverage = bank.coverage || {};
    els.meta.textContent = `${uniquePaperCount}套独立试卷 · ${review.concepts?.length || 0}个母题 · 全量${fullItems.length}条`;
    els.content.innerHTML = `
      <section class="route-hero">
        <p class="eyebrow">今天只按这个顺序</p>
        <h3>高频先吃透，一次题与补漏内容不删除但先折叠。</h3>
        <p>出现10套的题始终高于出现1套的题。PPT、大纲、题库证据只能在相同频次内改变先后。</p>
      </section>
      <div class="route-grid">
        ${routeStep(1, "英文名解速认", `${termRecognitionItems.length}题`, "先建立英文→中文映射，答错自动进回炉。", "termRecognition")}
        ${routeStep(2, "高频名解默写", `${counts.term}题`, "识别术语后，再核对定义、形态与意义。", "selectedTerms")}
        ${routeStep(3, "简答与病例链", `${counts.short + counts.case}题`, "按得分点背大题，再练诊断证据链。", "selectedShort")}
        ${routeStep(4, "高频选择题", `${counts.choice}题`, "刷可判定题；答对一次不等于掌握。", "selectedChoices")}
        ${routeStep(5, "错题回炉", "考前收口", "最后30分钟只看未掌握高频与主动标记题。", "wrong")}
      </div>
      <section class="rule-note"><h3>频次口径</h3><p>23临五与23口腔为同卷，只计1套；题库1和大礼包仅作历年来源核对，不另算试卷。各题型独立计数，跨题型总频次仅是第二排序键。</p></section>
      <section class="coverage-note"><h3>答案已按教材审校</h3><p>136个自编母题已建立145份分题型答案档案；课程PPT优先，PPT缺失处使用《病理学》（步宏、李一雷）教材补充。跨题型母题分别显示选择题、名解或简答答案。</p></section>
      <section class="coverage-note"><h3>资料覆盖</h3><p>历年题415条、母题${review.concepts?.length || 0}个；299页学习指导解析${coverage.parsedItems || 0}题（选择${coverage.counts?.choice || 0}、判断${coverage.counts?.judgment || 0}、名解${coverage.counts?.term || 0}、问答${coverage.counts?.long || 0}）。${coverage.rawFallback || 0}条解析问题进入“原文待核对”，未删除。</p></section>
      <section class="coverage-note"><h3>考试时间</h3><p>当前：${escapeHtml(formatDateTime(examConfig.examAt))}</p><form id="exam-form" class="card-actions"><input id="exam-input" type="datetime-local" value="${escapeHtml(toLocalInput(examConfig.examAt))}" aria-label="考试时间"><button type="submit">保存考试时间</button></form></section>`;
  }

  function routeStep(no, title, count, text, view) {
    return `<article class="route-step"><span class="step-no">STEP ${no}</span><h4>${escapeHtml(title)}</h4><p><b>${escapeHtml(count)}</b><br>${escapeHtml(text)}</p><button class="text-button" data-jump="${view}" type="button">进入 →</button></article>`;
  }

  function renderTermRecognition() {
    const result = applyFilters(termRecognitionItems);
    const groups = groupBy(result, (item) => item.tier);
    const done = result.filter((item) => choiceProgress[item.id]?.submitted).length;
    const correct = result.filter((item) => choiceProgress[item.id]?.submitted && choiceProgress[item.id]?.correct).length;
    const wrong = result.filter((item) => choiceProgress[item.id]?.submitted && choiceProgress[item.id]?.correct === false).length;
    els.meta.textContent = `${result.length}题 · 已做${done} · 正确${correct} · 错误${wrong}`;
    els.content.innerHTML = `<section class="recognition-intro"><div><p class="eyebrow">ENGLISH → CHINESE</p><h3>只看英文，选出对应中文</h3><p>收录名解题型核心高频与高频术语；每题选项固定可追溯，点击即判定。</p></div><button data-action="reset-recognition" type="button">清空速认作答</button></section>
      ${tierBlock("core", groups.get("core") || [], "choice", false)}
      ${tierBlock("high", groups.get("high") || [], "choice", false)}`;
  }

  function renderSelected(typeKey) {
    const pool = applyFilters(selectedPools[typeKey] || []);
    const groups = groupBy(pool, (item) => item.tier);
    const coreHigh = [...(groups.get("core") || []), ...(groups.get("high") || [])];
    const past = groups.get("past") || [];
    const supplement = groups.get("supplement") || [];
    els.meta.textContent = `主线${coreHigh.length}题 · 一次题${past.length}题 · 补漏${supplement.length}题${choiceStatsText(coreHigh)}`;
    const primary = [
      tierBlock("core", groups.get("core") || [], typeKey, false),
      tierBlock("high", groups.get("high") || [], typeKey, false),
    ].join("");
    const later = [
      tierBlock("past", past, typeKey, true),
      tierBlock("supplement", supplement, typeKey, true),
    ].join("");
    els.content.innerHTML = primary || later ? primary + later : emptyState();
  }

  function tierBlock(tier, items, typeKey, collapsed) {
    if (!items.length) return "";
    const note = tier === "core" ? "该题型至少3套独立试卷出现" : tier === "high" ? "该题型出现2套" : tier === "past" ? "该题型只出现1套，按近年性排序" : "历年未出现，仅作正式大纲/PPT补漏";
    const body = `<div class="card-list">${items.map((item, index) => renderCard(item, index)).join("")}</div>`;
    if (collapsed) return `<details class="tier-details"><summary>${tierLabels[tier]} · ${items.length}题（默认折叠）</summary><div class="tier-block"><div class="tier-head"><p>${escapeHtml(note)}</p></div>${body}</div></details>`;
    return `<section class="tier-block"><div class="tier-head"><h3>${tierLabels[tier]} · ${items.length}题</h3><p>${escapeHtml(note)}</p></div>${body}</section>`;
  }

  function renderChapters() {
    const chapters = bank.syllabus?.chapters || [];
    els.meta.textContent = `${chapters.filter((item) => item.inScope).length}个正式理论章节`;
    els.content.innerHTML = `<div class="chapter-grid">${chapters.filter((item) => item.inScope).map((chapter) => {
      const count = bankItems.filter((item) => item.chapterId === chapter.id).length;
      return `<button class="chapter-button" data-chapter="${escapeHtml(chapter.name)}" type="button"><b>${escapeHtml(chapter.name)}</b><span>${chapter.theoryHours}学时 · 全量${count}题</span></button>`;
    }).join("")}</div><section class="coverage-note"><h3>范围控制</h3><p>环境和营养性疾病、遗传性和儿童疾病、病理诊断研究方法不在本课程正式理论章节中，仅保留在全量题库并标记“大纲外补充”。实验课、切片和标本识别未导入。</p></section>`;
  }

  function renderPastPapers() {
    const items = applyFilters(historicalItems);
    const byPaper = groupBy(items, (item) => item.paperId);
    els.meta.textContent = `${byPaper.size}个年份/专业记录 · ${items.length}条`;
    els.content.innerHTML = byPaper.size ? (review.papers || []).filter((paper) => byPaper.has(paper.id)).map((paper) => {
      const list = byPaper.get(paper.id);
      const sections = groupBy(list, (item) => item.displayType);
      return `<details class="paper-group" ${paper.id === "p23-clinical" ? "open" : ""}><summary>${escapeHtml(paper.label)} · ${list.length}条</summary><div class="paper-body"><p class="source-ref">来源：${escapeHtml(paper.source)}${paper.note ? ` · ${escapeHtml(paper.note)}` : ""}</p>${[...sections.entries()].map(([type, sectionItems]) => `<h3>${escapeHtml(type)}</h3><div class="card-list">${sectionItems.map((item, index) => renderCard(item, index)).join("")}</div>`).join("")}</div></details>`;
    }).join("") : emptyState();
  }

  function renderFullBank() {
    const result = applyFilters(fullItems);
    const shown = result.slice(0, state.limit);
    els.meta.textContent = `显示${shown.length} / ${result.length}条 · 总数据${fullItems.length}条${choiceStatsText(shown)}`;
    els.content.innerHTML = shown.length ? `<div class="card-list">${shown.map((item, index) => item.typeKey === "raw" ? renderRawCard(item) : renderCard(item, index)).join("")}</div>${shown.length < result.length ? `<div class="card-actions"><button data-action="load-more" type="button">继续加载${Math.min(pageSize, result.length - shown.length)}条</button></div>` : ""}` : emptyState();
  }

  function renderRaw() {
    const result = applyFilters(rawItems);
    const shown = result.slice(0, state.limit);
    els.meta.textContent = `显示${shown.length} / ${result.length}条`;
    els.content.innerHTML = shown.length ? `<div class="card-list">${shown.map(renderRawCard).join("")}</div>${shown.length < result.length ? `<div class="card-actions"><button data-action="load-more" type="button">继续加载</button></div>` : ""}` : emptyState();
  }

  function renderRawCard(item) {
    return `<article class="raw-card"><h3>${escapeHtml(item.issue || "待核对")}</h3><p class="source-ref">${escapeHtml(item.sourceFile)} · PDF p${escapeHtml(item.sourcePage)} · ${escapeHtml(item.chapter)}</p><pre>${escapeHtml(item.rawText || "该区段未能定位，需回看原PDF页。")}</pre></article>`;
  }

  function renderReviewLoop() {
    const reviewable = uniqueBy([...termRecognitionItems, ...Object.values(selectedPools).flat(), ...bankItems, ...historicalItems], (item) => item.id)
      .filter((item) => learning[item.id]?.wrong || learning[item.id]?.review);
    const result = applyFilters(reviewable);
    els.meta.textContent = `${result.length}题待回炉`;
    els.content.innerHTML = result.length ? `<div class="card-list">${result.map((item, index) => renderCard(item, index)).join("")}</div>` : `<div class="empty">当前没有错题或需回看题。答错的选择题会自动进入这里。</div>`;
  }

  function renderLast30() {
    const selected = uniqueBy(Object.values(selectedMain).flat(), (item) => item.id);
    const urgent = selected.filter((item) => !learning[item.id]?.mastered || learning[item.id]?.wrong || learning[item.id]?.review);
    const extra = uniqueBy([...termRecognitionItems, ...bankItems, ...historicalItems].filter((item) => learning[item.id]?.wrong || learning[item.id]?.review), (item) => item.id);
    const result = applyFilters(uniqueBy([...urgent, ...extra], (item) => item.id));
    els.meta.textContent = `${result.length}题`;
    els.content.innerHTML = `<section class="rule-note"><h3>最后30分钟只做三件事</h3><p>${(review.last30 || []).map(escapeHtml).join("　·　")}</p></section>${result.length ? `<div class="card-list">${result.map((item, index) => renderCard(item, index)).join("")}</div>` : `<div class="empty">核心高频已全部标记掌握，最后快速扫一遍关键词即可。</div>`}`;
  }

  function renderRandom() {
    els.meta.textContent = "当前筛选池随机1题";
    els.content.innerHTML = state.randomItem ? `<div class="card-list">${renderCard(state.randomItem, 0)}</div>` : emptyState();
  }

  function renderCard(item, index) {
    const status = learning[item.id] || {};
    const classes = [item.tier || "archive", item.recognition ? "recognition-card" : "", status.mastered ? "is-mastered" : "", status.wrong ? "is-wrong" : ""].filter(Boolean).join(" ");
    const isWritten = ["term", "short", "case"].includes(item.typeKey);
    const frequency = Number.isFinite(item.frequency) ? item.frequency : 0;
    const badges = [
      `<span class="tag">${escapeHtml(item.displayType || typeLabels[item.typeKey] || "题目")}</span>`,
      `<span class="tag">${escapeHtml(item.chapter || "章节待核")}</span>`,
      item.tier && item.tier !== "archive" ? `<span class="tag ${item.tier === "core" ? "danger" : item.tier === "supplement" ? "good" : ""}">${escapeHtml(tierLabels[item.tier])}</span>` : "",
      item.inCurrentSyllabus === false || item.stage === "out-of-scope" ? `<span class="tag danger">大纲外补充</span>` : "",
      item.bankMatch === "none" ? `<span class="tag">题库未命中</span>` : "",
      item.sourceType === "textbook" ? `<span class="tag good">教材补充</span>` : "",
      item.sourceType === "combined" ? `<span class="tag good">PPT＋教材</span>` : "",
      item.auditStatus === "revised" ? `<span class="tag danger">答案已修订</span>` : "",
    ].join("");
    const heading = item.typeKey === "term" ? termHeading(item) : `<h3>${escapeHtml(item.prompt || item.title)}</h3>`;
    const trainingPrompt = item.trainingPrompt ? `<p class="prompt"><b>可练同源题：</b>${escapeHtml(item.trainingPrompt)}</p>` : "";
    return `<article class="question-card ${classes}" data-id="${escapeHtml(item.id)}" data-type="${escapeHtml(item.typeKey)}">
      <div class="card-top"><div><span class="card-index">${escapeHtml(cardNumber(item, index))}</span><div class="tag-row">${badges}</div>${heading}</div>${frequency ? `<span class="frequency-badge">${frequency}套</span>` : ""}</div>
      ${item.typeKey !== "term" && item.title && item.title !== item.prompt ? `<p class="prompt">${escapeHtml(item.title)}</p>` : ""}${trainingPrompt}
      <div class="meta-line">${renderEvidenceMeta(item)}</div>
      ${item.note ? `<p class="rule-note">注意：${escapeHtml(item.note)}</p>` : ""}
      ${item.typeKey === "choice" ? renderChoice(item) : ""}
      ${isWritten ? renderWritingBox(item) : ""}
      <div class="card-actions">
        ${isWritten ? `<button data-action="keywords" type="button">记忆关键词</button>` : ""}
        <button data-action="answer" type="button">显示答案</button>
        ${item.sourceType === "historical" && item.conceptId ? `<button data-concept-jump="${escapeHtml(item.conceptId)}" data-concept-type="${escapeHtml(item.typeKey)}" type="button">查看对应母题</button>` : ""}
        ${isWritten ? `<button data-action="clear-writing" type="button">清空默写</button>` : ""}
        <button data-status="wrong" class="${status.wrong ? "active-wrong" : ""}" type="button">${status.wrong ? "已标错题" : "错题"}</button>
        <button data-status="review" class="${status.review ? "active-review" : ""}" type="button">${status.review ? "需回看" : "标记回看"}</button>
        <button data-status="mastered" class="${status.mastered ? "active-mastered" : ""}" type="button">${status.mastered ? "已掌握" : "标记掌握"}</button>
      </div>
      ${isWritten ? renderKeywordPanel(item) : ""}
      ${renderAnswerPanel(item)}
    </article>`;
  }

  function termHeading(item) {
    const chinese = item.chineseTitle || (/^[A-Za-z]/.test(item.prompt || "") ? "中文名待核对" : item.prompt);
    const english = item.englishTitle || (/^[A-Za-z]/.test(item.prompt || "") ? item.prompt : "");
    return `<h3>${escapeHtml(chinese)}</h3>${english ? `<p class="term-english">${escapeHtml(english)}</p>` : `<p class="term-english">英文原词未提供</p>`}`;
  }

  function cardNumber(item, index) {
    if (item.originalNo) return `${item.sourceType === "guide" ? "题库" : "原题"} ${item.originalNo}`;
    return item.tier && item.tier !== "archive" ? `${tierLabels[item.tier]} · ${index + 1}` : `题目 ${index + 1}`;
  }

  function renderEvidenceMeta(item) {
    const parts = [];
    if (item.frequency) parts.push(`该题型${item.frequency}套`);
    if (item.totalFrequency && item.totalFrequency !== item.frequency) parts.push(`跨题型共${item.totalFrequency}套`);
    if (item.paperLabels?.length) parts.push(`试卷：${item.paperLabels.join("、")}`);
    if (item.sourceLabel) parts.push(`答案来源：${item.sourceLabel}`);
    if (item.sourceRef) parts.push(item.sourceRef);
    return parts.map((part) => `<span>${escapeHtml(part)}</span>`).join("<span>·</span>");
  }

  function renderChoice(item) {
    const payload = choicePayload(item);
    const progress = choiceProgress[item.id] || { selected: [], submitted: false, correct: null };
    if (payload.options.length < 2 || !payload.correct.length) {
      return `<p class="choice-status pending">原回忆缺完整选项或可靠答案，保留为判断依据题，不补造选项。</p>`;
    }
    const selected = new Set(progress.selected || []);
    const optionHtml = payload.options.map((option) => {
      const classes = [selected.has(option.key) ? "selected" : ""];
      if (progress.submitted && payload.correct.includes(option.key)) classes.push("correct");
      if (progress.submitted && selected.has(option.key) && !payload.correct.includes(option.key)) classes.push("incorrect");
      return `<button class="option ${classes.join(" ")}" data-option="${escapeHtml(option.key)}" type="button"><span class="option-key">${escapeHtml(option.key)}</span><span>${escapeHtml(option.text)}</span></button>`;
    }).join("");
    const status = !progress.selected?.length ? ["未做", ""] : payload.multiple && !progress.submitted ? ["多选待判定", "pending"] : progress.correct ? ["已做正确", "correct"] : ["已做错误", "incorrect"];
    return `<div class="options" data-multiple="${payload.multiple ? "true" : "false"}">${optionHtml}</div>${payload.multiple ? `<button class="submit-multi" data-action="submit-multi" type="button">判定多选</button>` : ""}<p class="choice-status ${status[1]}">${status[0]}</p>`;
  }

  function choicePayload(item) {
    const options = (item.options || []).map((option, index) => typeof option === "string" ? { key: String.fromCharCode(65 + index), text: option } : option);
    let correct = String(item.correctAnswer || "").replace(/[^A-H√×]/g, "").split("").filter(Boolean);
    if (!correct.length && item.answer) {
      const mapped = answerToOption(options, Array.isArray(item.answer) ? item.answer[0] : item.answer);
      correct = mapped ? mapped.split("") : [];
    }
    return { options, correct, multiple: Boolean(item.multiple || correct.length > 1) };
  }

  function renderWritingBox(item) {
    return `<div class="writing-box"><label><span>主动默写（不保存）</span><span>刷新后自动清空</span></label><textarea data-writing="${escapeHtml(item.id)}" placeholder="先不看答案，按考场得分点默写……"></textarea></div>`;
  }

  function renderKeywordPanel(item) {
    const keywords = item.keywords?.length ? item.keywords : defaultKeywords(item.prompt, item.typeKey);
    return `<div class="keyword-panel"><h4>触发词链</h4><p>${escapeHtml(keywords.join(" → ") || "自动提取失败，需对照答案")}</p><h4>考场顺序</h4><ul>${keywords.map((word) => `<li>${escapeHtml(word)}</li>`).join("")}</ul><p class="source-ref">${escapeHtml(item.keywordMode || "自动提取，需核对")}</p></div>`;
  }

  function renderAnswerPanel(item) {
    const payload = item.typeKey === "choice" ? choicePayload(item) : null;
    const choiceAnswer = payload?.correct?.length ? `答案：${payload.correct.join("")} ${payload.options.filter((option) => payload.correct.includes(option.key)).map((option) => option.text).join("；")}` : "";
    let recite = asPoints(item.answer || item.reciteAnswer);
    if (!recite.length && choiceAnswer) recite = [choiceAnswer];
    const original = item.originalAnswer || item.originalExplanation || "";
    const logic = item.keywords?.length ? item.keywords : defaultKeywords(item.prompt, item.typeKey);
    const sources = item.auditedSources?.length ? item.auditedSources : [];
    const sourceList = sources.length ? `<ul class="source-list">${sources.map((source) => `<li><b>${escapeHtml(source.label || source.type)}</b>：${escapeHtml(source.ref)}</li>`).join("")}</ul>` : `<p class="source-ref">${escapeHtml(item.sourceRef || item.answerSource?.refs?.join("；") || item.sourceLabel || "来源待核")}</p>`;
    return `<div class="answer-panel ${state.showAllAnswers ? "open" : ""}">
      <div class="answer-layer"><h4>第一层｜考场背诵版</h4>${recite.length ? `<ul>${recite.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul>` : `<p>当前资料未提供可靠答案；已保留原题，不补造。</p>`}</div>
      <div class="answer-layer"><h4>第二层｜机制 / 形态 / 鉴别逻辑</h4>${logic.length ? `<p>${escapeHtml(logic.join(" → "))}</p>` : `<p>按题干先定位定义、特征性形态与临床意义。</p>`}</div>
      <div class="answer-layer"><h4>第三层｜教材 / 题库依据与来源</h4>${item.textbookBasis ? `<p><b>教材核对要点：</b>${escapeHtml(item.textbookBasis)}</p>` : ""}${original ? `<p><b>题库原文：</b>${escapeHtml(original)}</p>` : `<p>未定位到可直接配对的题库原文。</p>`}${item.auditNote ? `<p class="source-ref">审校说明：${escapeHtml(item.auditNote)}</p>` : ""}${sourceList}</div>
    </div>`;
  }

  function asPoints(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value.filter(Boolean).map(String);
    return String(value).split(/(?:\n+|(?=（\d+）))/).map((item) => item.trim()).filter(Boolean);
  }

  function applyFilters(items) {
    const tokens = state.query.toLowerCase().split(/\s+/).filter(Boolean);
    return items.filter((item) => {
      if (tokens.length && !tokens.every((token) => searchText(item).includes(token))) return false;
      if (state.chapter !== "all" && item.chapter !== state.chapter) return false;
      if (state.type !== "all" && item.typeKey !== state.type) return false;
      if (state.source !== "all" && item.sourceType !== state.source) return false;
      if (state.stage !== "all" && item.stage !== state.stage && item.tier !== state.stage) return false;
      if (state.hideMastered && learning[item.id]?.mastered) return false;
      if (state.onlyUndone && item.typeKey === "choice" && choiceProgress[item.id]?.submitted) return false;
      if (state.onlyUndone && item.typeKey !== "choice") return false;
      return true;
    });
  }

  function searchText(item) {
    const topic = topics[item.topic] || {};
    return [item.chineseTitle, item.englishTitle, item.title, item.prompt, item.trainingPrompt, item.options?.map((option) => option.text || option),
      item.answer, item.originalAnswer, item.originalExplanation, item.reciteAnswer, item.keywords, item.textbookBasis, item.auditNote,
      item.auditedSources?.map((source) => [source.label, source.ref]), item.sourceRef, item.sourceLabel,
      item.paperLabel, item.paperLabels, item.chapter, item.note, item.issue, item.rawText, topic.aliases, item.variants?.map((variant) => variant.prompt),
      item.historical ? "历年题" : ""].flat(5).filter(Boolean).join(" ").toLowerCase();
  }

  function handleContentClick(event) {
    const jump = event.target.closest("[data-jump]");
    if (jump) return setView(jump.dataset.jump);
    const conceptJump = event.target.closest("[data-concept-jump]");
    if (conceptJump) return jumpToConcept(conceptJump.dataset.conceptJump, conceptJump.dataset.conceptType);
    const chapterButton = event.target.closest("[data-chapter]");
    if (chapterButton) { state.chapter = chapterButton.dataset.chapter; els.chapter.value = state.chapter; return setView("all"); }
    const loadMore = event.target.closest("[data-action='load-more']");
    if (loadMore) { state.limit += pageSize; return render(); }
    const resetRecognition = event.target.closest("[data-action='reset-recognition']");
    if (resetRecognition) {
      termRecognitionItems.forEach((item) => { delete choiceProgress[item.id]; });
      saveJson(choiceKey, choiceProgress); render(); return showToast("英文速认作答已清空");
    }
    const card = event.target.closest(".question-card");
    if (!card) return;
    const id = card.dataset.id;
    const option = event.target.closest("[data-option]");
    if (option) return selectOption(card, id, option.dataset.option);
    const action = event.target.closest("[data-action]")?.dataset.action;
    if (action === "submit-multi") return submitMulti(card, id);
    if (action === "answer") return togglePanel(card, ".answer-panel", event.target, "显示答案", "收起答案");
    if (action === "keywords") return togglePanel(card, ".keyword-panel", event.target, "记忆关键词", "隐藏关键词");
    if (action === "clear-writing") { const area = card.querySelector("textarea"); if (area) area.value = ""; return; }
    const statusButton = event.target.closest("[data-status]");
    if (statusButton) return toggleStatus(card, id, statusButton.dataset.status, statusButton);
  }

  function jumpToConcept(conceptId, typeKey) {
    const targetView = { choice: "selectedChoices", term: "selectedTerms", short: "selectedShort", case: "selectedCases" }[typeKey] || "all";
    Object.assign(state, { source: "all", stage: "all", chapter: "all", type: "all", hideMastered: false, onlyUndone: false });
    els.source.value = "all"; els.stage.value = "all"; els.chapter.value = "all"; els.type.value = "all"; els.hideMastered.checked = false; els.onlyUndone.checked = false;
    setView(targetView, { noScroll: true });
    window.setTimeout(() => document.querySelector(`.question-card[data-id="${cssEscape(conceptId)}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 30);
  }

  function handleContentChange(event) {
    if (event.target.closest("#exam-form")) return;
  }

  document.addEventListener("submit", (event) => {
    if (event.target.id !== "exam-form") return;
    event.preventDefault();
    const value = document.querySelector("#exam-input")?.value;
    if (!value) return;
    examConfig = { examAt: new Date(value).toISOString() };
    saveJson(examKey, examConfig); renderSummary(); showToast("考试时间已保存");
  });

  function selectOption(card, id, key) {
    const item = findItem(id);
    if (!item) return;
    const payload = choicePayload(item);
    const current = choiceProgress[id] || { selected: [], submitted: false, correct: null };
    if (payload.multiple) {
      const selected = new Set(current.submitted ? [] : current.selected || []);
      selected.has(key) ? selected.delete(key) : selected.add(key);
      choiceProgress[id] = { selected: [...selected], submitted: false, correct: null, updatedAt: Date.now() };
    } else {
      const correct = payload.correct.includes(key);
      choiceProgress[id] = { selected: [key], submitted: true, correct, updatedAt: Date.now() };
      if (!correct) setWrongAutomatically(id);
    }
    rememberPosition(id); saveJson(choiceKey, choiceProgress); refreshChoiceCard(card, item);
  }

  function submitMulti(card, id) {
    const item = findItem(id); if (!item) return;
    const payload = choicePayload(item); const current = choiceProgress[id] || { selected: [] };
    if (!current.selected?.length) return showToast("请先勾选至少一个选项");
    const expected = [...payload.correct].sort().join(""); const actual = [...current.selected].sort().join("");
    const correct = expected === actual;
    choiceProgress[id] = { ...current, submitted: true, correct, updatedAt: Date.now() };
    if (!correct) setWrongAutomatically(id);
    rememberPosition(id); saveJson(choiceKey, choiceProgress); refreshChoiceCard(card, item);
  }

  function refreshChoiceCard(card, item) {
    const existingOptions = card.querySelector(".options");
    const existingSubmit = card.querySelector(".submit-multi");
    const existingStatus = card.querySelector(".choice-status");
    const wrapper = document.createElement("div"); wrapper.innerHTML = renderChoice(item);
    const newOptions = wrapper.querySelector(".options"); const newSubmit = wrapper.querySelector(".submit-multi"); const newStatus = wrapper.querySelector(".choice-status");
    if (existingOptions && newOptions) existingOptions.replaceWith(newOptions);
    if (existingSubmit && newSubmit) existingSubmit.replaceWith(newSubmit); else if (!existingSubmit && newSubmit && newOptions) newOptions.insertAdjacentElement("afterend", newSubmit);
    if (existingStatus && newStatus) existingStatus.replaceWith(newStatus);
    updateCardStatusClasses(card, item.id);
    renderSummary();
  }

  function setWrongAutomatically(id) {
    learning[id] = { ...(learning[id] || {}), wrong: true, mastered: false };
    saveJson(learningKey, learning);
  }

  function togglePanel(card, selector, button, closedText, openText) {
    const panel = card.querySelector(selector); if (!panel) return;
    const open = panel.classList.toggle("open"); button.textContent = open ? openText : closedText;
  }

  function toggleStatus(card, id, key, button) {
    const current = { wrong: false, review: false, mastered: false, ...(learning[id] || {}) };
    current[key] = !current[key];
    if (key === "mastered" && current.mastered) { current.wrong = false; current.review = false; }
    if ((key === "wrong" || key === "review") && current[key]) current.mastered = false;
    learning[id] = current; saveJson(learningKey, learning); rememberPosition(id);
    updateStatusButtons(card, current); updateCardStatusClasses(card, id); renderSummary();
    if (state.hideMastered && current.mastered) card.hidden = true;
  }

  function updateStatusButtons(card, status) {
    const config = {
      wrong: ["active-wrong", "已标错题", "错题"], review: ["active-review", "需回看", "标记回看"],
      mastered: ["active-mastered", "已掌握", "标记掌握"],
    };
    Object.entries(config).forEach(([key, [className, on, off]]) => {
      const button = card.querySelector(`[data-status='${key}']`); if (!button) return;
      button.classList.toggle(className, Boolean(status[key])); button.textContent = status[key] ? on : off;
    });
  }

  function updateCardStatusClasses(card, id) {
    const status = learning[id] || {};
    card.classList.toggle("is-mastered", Boolean(status.mastered)); card.classList.toggle("is-wrong", Boolean(status.wrong));
  }

  function rememberPosition(id) {
    lastPosition = { view: state.view === "random" ? "all" : state.view, id, filters: { chapter: state.chapter, type: state.type, source: state.source, stage: state.stage } };
    saveJson(lastKey, lastPosition);
  }

  function continueLast() {
    if (!lastPosition?.id) return showToast("还没有可继续的作答位置");
    Object.assign(state, lastPosition.filters || {});
    els.chapter.value = state.chapter || "all"; els.type.value = state.type || "all"; els.source.value = state.source || "all"; els.stage.value = state.stage || "all";
    setView(lastPosition.view || "all", { noScroll: true });
    window.setTimeout(() => {
      let card = document.querySelector(`.question-card[data-id="${cssEscape(lastPosition.id)}"]`);
      if (!card && ["all", "raw"].includes(state.view)) { state.limit = fullItems.length; render(); card = document.querySelector(`.question-card[data-id="${cssEscape(lastPosition.id)}"]`); }
      card?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 30);
  }

  function randomQuestion() {
    let pool = currentPool();
    pool = applyFilters(pool).filter((item) => item.typeKey !== "raw");
    if (!pool.length) return showToast("当前筛选没有可抽题目");
    state.randomItem = pool[Math.floor(Math.random() * pool.length)]; state.view = "random";
    els.nav.forEach((button) => button.classList.remove("active")); render(); window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function currentPool() {
    if (state.view === "termRecognition") return termRecognitionItems;
    if (state.view === "selectedShort") return selectedPools.short || [];
    if (state.view === "selectedTerms") return selectedPools.term || [];
    if (state.view === "selectedChoices") return selectedPools.choice || [];
    if (state.view === "selectedCases") return selectedPools.case || [];
    if (state.view === "past") return historicalItems;
    if (state.view === "raw") return rawItems;
    return fullItems;
  }

  function toggleAllAnswers() {
    state.showAllAnswers = !state.showAllAnswers;
    document.querySelectorAll(".answer-panel").forEach((panel) => panel.classList.toggle("open", state.showAllAnswers));
    document.querySelectorAll("[data-action='answer']").forEach((button) => { button.textContent = state.showAllAnswers ? "收起答案" : "显示答案"; });
    els.answerToggle.textContent = state.showAllAnswers ? "隐藏全部答案" : "显示全部答案";
  }

  function choiceStatsText(items) {
    const choices = items.filter((item) => item.typeKey === "choice");
    if (!choices.length) return "";
    const states = choices.map((item) => choiceProgress[item.id]).filter(Boolean);
    const done = states.filter((item) => item.submitted).length;
    const correct = states.filter((item) => item.submitted && item.correct).length;
    const wrong = states.filter((item) => item.submitted && item.correct === false).length;
    const pending = states.filter((item) => !item.submitted && item.selected?.length).length;
    return ` · 已做${done} 正确${correct} 错误${wrong} 待判${pending}`;
  }

  function findItem(id) {
    return recognitionById.get(id) || Object.values(selectedPools).flat().find((item) => item.id === id) || bankById.get(id) || historicalItems.find((item) => item.id === id) || state.randomItem?.id === id && state.randomItem;
  }

  function formatDuration(ms) {
    const minutes = Math.max(0, Math.floor(ms / 60000)); const hours = Math.floor(minutes / 60); const mins = minutes % 60;
    return hours >= 24 ? `${Math.floor(hours / 24)}天${hours % 24}时` : `${hours}时${mins}分`;
  }

  function formatDateTime(value) {
    const date = new Date(value); return Number.isNaN(date.getTime()) ? "时间无效" : new Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }).format(date);
  }

  function toLocalInput(value) {
    const date = new Date(value); if (Number.isNaN(date.getTime())) return "";
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000); return local.toISOString().slice(0, 16);
  }

  function groupBy(items, getter) {
    const map = new Map(); items.forEach((item) => { const key = getter(item); if (!map.has(key)) map.set(key, []); map.get(key).push(item); }); return map;
  }

  function uniqueBy(items, getter) { const seen = new Set(); return items.filter((item) => { const key = getter(item); if (seen.has(key)) return false; seen.add(key); return true; }); }
  function capitalize(value) { return value.charAt(0).toUpperCase() + value.slice(1); }
  function normalize(value) { return String(value || "").toLowerCase().replace(/[\s，。；：、？！“”‘’（）()\[\]｜|/\\·—_-]+/g, ""); }
  function cssEscape(value) { return window.CSS?.escape ? window.CSS.escape(value) : String(value).replace(/["\\]/g, "\\$&"); }
  function emptyState() { return `<div class="empty">没有符合当前条件的题目。可以清空筛选后再看。</div>`; }
  function showToast(message) { els.toast.textContent = message; els.toast.classList.add("show"); window.setTimeout(() => els.toast.classList.remove("show"), 1800); }
  function escapeHtml(value) { return String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]); }
})();
