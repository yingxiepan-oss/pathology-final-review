(function () {
  "use strict";

  const data = window.microbiologyData || { meta: {}, schedule: [], terms: [], shorts: [], cases: [], choices: [] };
  const pastData = window.microbiologyPastData || { meta: {}, items: [], rawItems: [] };
  const allStudyItems = [...data.terms, ...data.shorts, ...data.cases, ...data.choices];

  const storageKeys = {
    learning: "microbiology-learning-v1",
    choices: "microbiology-choice-progress-v1",
    recognition: "microbiology-recognition-progress-v1",
    last: "microbiology-last-position-v1",
    exam: "microbiology-exam-config-v1"
  };

  const learning = loadJson(storageKeys.learning, {});
  const choiceProgress = loadJson(storageKeys.choices, {});
  const recognitionProgress = loadJson(storageKeys.recognition, {});
  let lastPosition = loadJson(storageKeys.last, null);
  let examConfig = loadJson(storageKeys.exam, { examAt: data.meta.examAt || "2026-07-02T13:00:00+08:00" });

  const viewInfo = {
    route: ["SPRINT ROUTE", "复习路线", "先主观题拿稳，再用高频选择题补漏。"],
    recognition: ["FAST RECOGNITION", "英文术语速认", "一次一道，只看英文并快速匹配中文术语。"],
    terms: ["TERMS", "名词解释必背全量", "历年23个母题＋资料*号补充13个，共36个去重必背名词。"],
    shorts: ["SHORT ANSWERS", "高频简答", "先背8个重复母题，再看7个一次题补漏。"],
    cases: ["CASE WORK", "一本通病例", "11题全部收录；原资料有争议处已按教材和PPT校正。"],
    choices: ["TARGETED PRACTICE", "高频选择", "只纳入答案可可靠判定的历年题和同源训练。"],
    chapters: ["CHAPTER MAP", "按章节复习", "按当前资料中的真实题量进入对应章节。"],
    past: ["PAST PAPERS", "历年同源题", "8份回忆共184个可辨认项目，保留题号、考点和习题集覆盖。"],
    all: ["FULL SEARCH", "全量资料", "检索全部主线题、历年题摘要及来源信息。"],
    raw: ["AUDIT", "原文待核对", "题意不足、缺图或无法形成明确考点的内容不静默删除。"],
    return: ["RETURN QUEUE", "错题／需回看", "错题、需回看和未掌握项目彼此独立。"],
    last30: ["FINAL 30", "最后30分钟", "只显示未掌握的核心题，以及你主动标记的错题和需回看题。"]
  };

  const state = {
    view: "route",
    query: "",
    chapter: "all",
    type: "all",
    source: "all",
    hideMastered: false,
    onlyUndone: false,
    limit: 40,
    globalAnswers: false,
    chapterFocus: null
  };

  const recognitionState = { index: 0, order: data.terms.map((_, i) => i), mode: "all", autoNext: true };
  let recognitionTimer = null;

  const els = {
    sidebar: document.querySelector("#sidebar"),
    backdrop: document.querySelector("#sidebar-backdrop"),
    menu: document.querySelector("#menu-button"),
    nav: [...document.querySelectorAll("[data-view]")],
    kicker: document.querySelector("#view-kicker"),
    title: document.querySelector("#view-title"),
    description: document.querySelector("#view-description"),
    meta: document.querySelector("#view-meta"),
    summary: document.querySelector("#summary"),
    content: document.querySelector("#content"),
    countdown: document.querySelector("#countdown"),
    search: document.querySelector("#search-input"),
    chapter: document.querySelector("#chapter-filter"),
    type: document.querySelector("#type-filter"),
    source: document.querySelector("#source-filter"),
    hideMastered: document.querySelector("#hide-mastered"),
    onlyUndone: document.querySelector("#only-undone"),
    clearFilters: document.querySelector("#clear-filters"),
    globalAnswer: document.querySelector("#global-answer-button"),
    random: document.querySelector("#random-button"),
    continueButton: document.querySelector("#continue-button"),
    toast: document.querySelector("#toast")
  };

  init();

  function init() {
    populateChapterFilter();
    bindEvents();
    updateCountdown();
    window.setInterval(updateCountdown, 30000);
    render();
  }

  function bindEvents() {
    els.nav.forEach((button) => button.addEventListener("click", () => navigate(button.dataset.view)));
    els.menu.addEventListener("click", () => setSidebar(true));
    els.backdrop.addEventListener("click", () => setSidebar(false));
    els.search.addEventListener("input", () => { state.query = els.search.value.trim(); state.limit = 40; render(); });
    els.chapter.addEventListener("change", () => { state.chapter = els.chapter.value; state.chapterFocus = null; state.limit = 40; render(); });
    els.type.addEventListener("change", () => { state.type = els.type.value; state.limit = 40; render(); });
    els.source.addEventListener("change", () => { state.source = els.source.value; state.limit = 40; render(); });
    els.hideMastered.addEventListener("change", () => { state.hideMastered = els.hideMastered.checked; render(); });
    els.onlyUndone.addEventListener("change", () => { state.onlyUndone = els.onlyUndone.checked; render(); });
    els.clearFilters.addEventListener("click", clearFilters);
    els.globalAnswer.addEventListener("click", toggleGlobalAnswers);
    els.random.addEventListener("click", randomQuestion);
    els.continueButton.addEventListener("click", continueLast);
    els.content.addEventListener("click", handleContentClick);
    els.content.addEventListener("submit", handleContentSubmit);
  }

  function setSidebar(open) {
    els.sidebar.classList.toggle("open", open);
    els.backdrop.classList.toggle("visible", open);
  }

  function navigate(view, options = {}) {
    state.view = view;
    state.limit = 40;
    state.chapterFocus = null;
    els.nav.forEach((button) => button.classList.toggle("active", button.dataset.view === view));
    setSidebar(false);
    render();
    if (!options.noScroll) window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function render() {
    const info = viewInfo[state.view] || viewInfo.route;
    els.kicker.textContent = info[0];
    els.title.textContent = info[1];
    els.description.textContent = info[2];
    els.meta.textContent = viewMeta();
    renderSummary();
    if (state.view === "route") return renderRoute();
    if (state.view === "recognition") return renderRecognition();
    if (state.view === "terms") return renderTerms();
    if (state.view === "shorts") return renderTiered(data.shorts, "short");
    if (state.view === "cases") return renderCards(applyFilters(data.cases));
    if (state.view === "choices") return renderCards(applyFilters(data.choices));
    if (state.view === "chapters") return renderChapters();
    if (state.view === "past") return renderPast();
    if (state.view === "all") return renderAll();
    if (state.view === "raw") return renderRaw();
    if (state.view === "return") return renderReturn();
    if (state.view === "last30") return renderLast30();
  }

  function viewMeta() {
    if (state.view === "terms") return `必背36 · 历年母题23 · *号31（重叠18＋新增13）`;
    if (state.view === "shorts") return `高频8 · 补漏${Math.max(0, data.shorts.length - 8)}`;
    if (state.view === "cases") return `一本通病例${data.cases.length}题 · PDF p40-46`;
    if (state.view === "choices") return `${data.choices.length}道可靠判分题`;
    if (state.view === "past") return `${pastData.meta.identifiableItems || pastData.items.length}项 · ${pastData.meta.paperRecords || 8}份回忆`;
    if (state.view === "raw") return `${pastData.rawItems.length}项不计入覆盖率分母`;
    return `习题训练覆盖A+B ${data.meta.coverage?.exerciseAB || "91.3%"}`;
  }

  function renderSummary() {
    const mastered = allStudyItems.filter((item) => learning[item.id]?.mastered).length;
    const returnCount = allStudyItems.filter((item) => learning[item.id]?.wrong || learning[item.id]?.review).length;
    const choiceDone = data.choices.filter((item) => choiceProgress[item.id]?.submitted).length;
    const choiceCorrect = data.choices.filter((item) => choiceProgress[item.id]?.correct).length;
    els.summary.innerHTML = [
      summaryCard("主线题量", `${allStudyItems.length}`, "36名解必背＋15简答＋11病例＋选择"),
      summaryCard("已掌握", `${mastered}`, `共${allStudyItems.length}个可学习项目`),
      summaryCard("错题／回看", `${returnCount}`, "需要再次主动回忆"),
      summaryCard("选择题", `${choiceCorrect}/${choiceDone}`, `正确 / 已作答，共${data.choices.length}题`)
    ].join("");
  }

  function summaryCard(label, value, note) {
    return `<article class="summary-card"><span>${escapeHtml(label)}</span><b>${escapeHtml(value)}</b><small>${escapeHtml(note)}</small></article>`;
  }

  function renderRoute() {
    const examValue = toLocalInput(examConfig.examAt);
    els.content.innerHTML = `
      <section class="route-hero">
        <span class="eyebrow">35-HOUR SPRINT</span>
        <h2>主观题先拿稳，选择题只做高价值补漏</h2>
        <p>当前卷面中名词、简答和病例合计50分。名词必背池现为36个：23个历年母题，加上名词资料中带*且未被历年题覆盖的13个；再完成8个高频简答和11个一本通病例。</p>
      </section>
      <div class="section-note"><b>考前边界：</b>不从头通刷273页习题集；不背来源不明的长答案；7月2日上午不再开新章节。</div>
      <div class="route-grid">
        ${data.schedule.map((step, index) => `
          <article class="route-step">
            <div class="step-top"><span>STEP ${index + 1}</span><span>${escapeHtml(step.time)}</span></div>
            <h3>${escapeHtml(step.target)}</h3>
            <p>${escapeHtml(step.detail)}</p>
            <button data-action="go-view" data-view="${escapeHtml(step.view)}" type="button">进入训练</button>
          </article>`).join("")}
      </div>
      <div class="section-note">
        <form id="exam-form">
          <label for="exam-input"><b>考试时间</b></label>
          <input id="exam-input" type="datetime-local" value="${escapeHtml(examValue)}">
          <button type="submit">保存考试时间</button>
        </form>
      </div>`;
  }

  function renderTiered(items, type) {
    const filtered = applyFilters(items);
    const core = filtered.filter((item) => item.tier === "core");
    const past = filtered.filter((item) => item.tier !== "core");
    const coreLabel = type === "term" ? "跨年复现：今天必须背" : "跨年高频：先完成";
    const pastLabel = type === "term" ? "历年单次：第二轮补漏" : "一次题：有余力再看";
    els.content.innerHTML = `
      ${tierSection(coreLabel, core, false)}
      ${tierSection(pastLabel, past, true)}` || emptyState();
  }

  function renderTerms() {
    const filtered = applyFilters(data.terms);
    const core = filtered.filter((item) => item.frequency >= 2);
    const singles = filtered.filter((item) => item.frequency === 1);
    const starredSupplements = filtered.filter((item) => item.frequency === 0 && item.starred);
    const occurrences = pastData.items.filter((item) => item.type === "term");
    const paperGroups = groupBy(occurrences, (item) => item.paperLabel);
    const missingTerms = pastData.rawItems.filter((item) => /名词解释/.test(item.qno || ""));
    const repeatedThree = new Set(["2023 预防/法医", "2022 临八", "2022 口腔"]);
    const paperMatrix = [...paperGroups.entries()].map(([paper, items]) => `
      <article class="term-paper-card ${repeatedThree.has(paper) ? "same-set" : ""}">
        <div><b>${escapeHtml(paper)}</b><span>${items.length}个可辨认${repeatedThree.has(paper) ? " · 三卷同题组" : ""}</span></div>
        <ol>${items.map((item) => `<li><span>${escapeHtml(item.qno.replace("名词解释 ", ""))}</span>${escapeHtml(item.prompt)}</li>`).join("")}</ol>
      </article>`).join("");
    els.content.innerHTML = `
      <div class="term-audit">
        <div class="term-audit-stats">
          <article><b>${occurrences.length}</b><span>历年可辨认出现次数</span></article>
          <article><b>23</b><span>历年去重母题</span></article>
          <article><b>31</b><span>名词资料带*项目</span></article>
          <article><b>${data.terms.length}</b><span>两类证据并集必背</span></article>
        </div>
        <div class="section-note"><b>*号补充口径：</b>PDF中共有31个带*名词，其中18个已与历年23词重叠；新增13个后，必背池为23＋31－18＝36个。星号不会虚增历年频次，网页分别显示“历年复现”和“名词资料*”证据。</div>
        <div class="section-note"><b>三卷同题组，按3份独立试卷计频：</b>2023预防/法医、2022临八、2022口腔均为 pyrogenic exotoxin、coagulase、stormy fermentation、reverse transcription/reverse transcriptase、cccDNA、CPE。22口腔的原回忆写“reverse transcription”，网站保留该变体并归入同一逆转录母题。</div>
        <div class="section-note"><b>另一组重复：</b>2022预防与2021临八的 slow virus infection、transduction、virus life cycle、toxoid、reassortment、bacterial L-form 为同一六题组，按2份独立试卷计频。</div>
        <div class="tier-heading"><h2>逐卷名词解释原始统计</h2><span>共${occurrences.length}次；未回忆${missingTerms.length}题</span></div>
        <div class="term-paper-grid">${paperMatrix}</div>
        ${missingTerms.length ? `<div class="section-note"><b>缺失项：</b>${missingTerms.map((item) => `${item.paperLabel} ${item.qno}`).join("；")}原题未回忆，因此不推测、不计入23个历年母题。</div>` : ""}
      </div>
      <div class="tier-heading"><h2>跨年复现：今天必须背</h2><span>${core.length}个母题</span></div>
      <div class="card-list">${core.map(renderCard).join("")}</div>
      <div class="tier-heading"><h2>其他试卷历年名词：全部收录</h2><span>${singles.length}个母题</span></div>
      <div class="card-list">${singles.map(renderCard).join("")}</div>
      <div class="tier-heading"><h2>名词资料*号补充：新增必背</h2><span>${starredSupplements.length}个母题</span></div>
      <div class="card-list">${starredSupplements.map(renderCard).join("")}</div>`;
  }

  function tierSection(label, items, collapsed) {
    if (!items.length) return "";
    if (collapsed) {
      return `<details class="past-group"><summary>${escapeHtml(label)}（${items.length}题）</summary><div class="card-list">${items.map(renderCard).join("")}</div></details>`;
    }
    return `<div class="tier-heading"><h2>${escapeHtml(label)}</h2><span>${items.length}题</span></div><div class="card-list">${items.map(renderCard).join("")}</div>`;
  }

  function renderCards(items) {
    els.content.innerHTML = items.length ? `<div class="card-list">${items.map(renderCard).join("")}</div>` : emptyState();
  }

  function renderCard(item) {
    if (item.type === "choice") return renderChoiceCard(item);
    const status = { wrong: false, review: false, mastered: false, ...(learning[item.id] || {}) };
    const title = item.type === "term"
      ? `${escapeHtml(item.chineseTitle)}<span class="english">${escapeHtml(item.englishTitle)}</span>`
      : escapeHtml(item.title);
    const prompt = item.type === "term" ? `请解释：${item.englishTitle}` : item.prompt || item.title;
    const sources = (item.sources || []).map((entry) => `${entry.file}${entry.page ? ` · ${entry.page}` : ""}${entry.note ? ` · ${entry.note}` : ""}`).join("；");
    return `
      <article class="question-card ${escapeHtml(item.tier || "past")} ${status.wrong ? "is-wrong" : ""} ${status.mastered ? "is-mastered" : ""}" data-id="${escapeHtml(item.id)}" data-type="${escapeHtml(item.type)}">
        <div class="card-head">
          <div>
            <div class="card-kicker">
              <span class="badge">${escapeHtml(typeLabel(item.type))}</span>
              <span class="badge ${item.frequency >= 2 ? "" : "amber"}">${item.frequency >= 2 ? `独立试卷复现${item.frequency}次` : item.frequency === 1 ? "历年出现1次" : "资料*号补充"}</span>
              ${item.starred ? `<span class="badge amber">名词资料*</span>` : ""}
              <span class="badge gray">${escapeHtml(item.chapter)}</span>
            </div>
            <h3>${title}</h3>
            <p class="source-ref">${escapeHtml((item.papers || []).join("；") || item.sourcePage || "课程资料")}</p>
          </div>
        </div>
        <p class="prompt">${escapeHtml(prompt)}</p>
        <textarea class="write-box" placeholder="先闭卷写得分点；此处内容不会保存，刷新后清空。" aria-label="${escapeHtml(item.title || item.chineseTitle)}默写区"></textarea>
        <details class="keyword-details"><summary>查看关键词</summary><div class="keywords">${(item.keywords || []).map((keyword) => `<span>${escapeHtml(keyword)}</span>`).join("")}</div></details>
        <div class="answer-panel ${state.globalAnswers ? "visible" : ""}">
          <h4>${item.type === "term" ? "3分考场版" : item.type === "short" ? "4分考场版" : "考场可直接写"}</h4>
          <ol>${(item.examPoints || []).map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ol>
          ${(item.detailPoints || []).length ? `<details class="detail-answer"><summary>完整理解版（不必逐字背）</summary><ol>${item.detailPoints.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ol></details>` : ""}
          ${(item.logic || []).length ? `<div class="logic-panel"><h4>理解与鉴别</h4><ul>${item.logic.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul></div>` : ""}
          <div class="logic-panel"><h4>来源</h4><p>${escapeHtml(sources)}</p></div>
        </div>
        <div class="card-actions">
          <button data-action="toggle-answer" type="button">${state.globalAnswers ? "隐藏答案" : "显示答案"}</button>
          <button data-status="wrong" class="${status.wrong ? "active-wrong" : ""}" type="button">${status.wrong ? "已加入错题" : "标记错题"}</button>
          <button data-status="review" class="${status.review ? "active-review" : ""}" type="button">${status.review ? "需要回看" : "标记回看"}</button>
          <button data-status="mastered" class="${status.mastered ? "active-mastered" : ""}" type="button">${status.mastered ? "已掌握" : "标记掌握"}</button>
        </div>
      </article>`;
  }

  function renderChoiceCard(item) {
    const progress = choiceProgress[item.id] || { selected: [], submitted: false, correct: false };
    const status = { wrong: false, review: false, mastered: false, ...(learning[item.id] || {}) };
    const selected = new Set(progress.selected || []);
    const answer = new Set(item.answer || []);
    return `
      <article class="question-card ${escapeHtml(item.tier || "past")} ${status.wrong ? "is-wrong" : ""} ${status.mastered ? "is-mastered" : ""}" data-id="${escapeHtml(item.id)}" data-type="choice">
        <div class="card-kicker"><span class="badge">${item.mode === "multiple" ? "X型" : "A1/A2"}</span><span class="badge gray">${escapeHtml(item.chapter)}</span></div>
        <h3>${escapeHtml(item.prompt)}</h3>
        <p class="source-ref">${escapeHtml(item.sourceLabel || "历年同源训练")}</p>
        <div class="choice-options">
          ${(item.options || []).map((entry) => {
            const classes = ["choice-option"];
            if (selected.has(entry.key)) classes.push("selected");
            if (progress.submitted && answer.has(entry.key)) classes.push("correct");
            if (progress.submitted && selected.has(entry.key) && !answer.has(entry.key)) classes.push("incorrect");
            return `<button class="${classes.join(" ")}" data-action="choice-option" data-key="${escapeHtml(entry.key)}" type="button"><b>${escapeHtml(entry.key)}</b><span>${escapeHtml(entry.text)}</span></button>`;
          }).join("")}
        </div>
        ${item.mode === "multiple" && !progress.submitted ? `<div class="card-actions"><button data-action="submit-choice" type="button">提交答案</button></div>` : ""}
        ${progress.submitted ? `<p class="choice-result ${progress.correct ? "correct" : "incorrect"}">${progress.correct ? "回答正确" : `回答错误，正确答案：${escapeHtml(item.answer.join("、"))}`}</p>` : ""}
        <div class="answer-panel ${(state.globalAnswers || progress.submitted) ? "visible" : ""}">
          <h4>解析</h4><p>${escapeHtml(item.explanation || "")}</p>
        </div>
        <div class="card-actions">
          <button data-action="reset-choice" type="button">重做</button>
          <button data-action="toggle-answer" type="button">${state.globalAnswers || progress.submitted ? "隐藏解析" : "显示解析"}</button>
          <button data-status="wrong" class="${status.wrong ? "active-wrong" : ""}" type="button">${status.wrong ? "已加入错题" : "标记错题"}</button>
          <button data-status="review" class="${status.review ? "active-review" : ""}" type="button">${status.review ? "需要回看" : "标记回看"}</button>
          <button data-status="mastered" class="${status.mastered ? "active-mastered" : ""}" type="button">${status.mastered ? "已掌握" : "标记掌握"}</button>
        </div>
      </article>`;
  }

  function renderRecognition() {
    const pool = recognitionPool();
    if (!pool.length) { els.content.innerHTML = emptyState(); return; }
    recognitionState.index = Math.max(0, Math.min(recognitionState.index, pool.length - 1));
    const item = pool[recognitionState.index];
    const record = recognitionProgress[item.id];
    const options = recognitionOptions(item);
    const done = pool.filter((entry) => recognitionProgress[entry.id]).length;
    const correct = pool.filter((entry) => recognitionProgress[entry.id]?.correct).length;
    els.content.innerHTML = `
      <div class="runner">
        <div class="runner-toolbar">
          <div><b>${recognitionState.index + 1} / ${pool.length}</b><span>已做${done} · 正确${correct} · 错误${done - correct}</span></div>
          <button data-action="recognition-auto" class="${recognitionState.autoNext ? "active-mastered" : ""}" type="button">答对自动下一题：${recognitionState.autoNext ? "开" : "关"}</button>
        </div>
        <article class="question-card recognition-card ${record && !record.correct ? "is-wrong" : ""}" data-id="${escapeHtml(item.id)}">
          <div class="recognition-term"><span class="eyebrow">TERM RECOGNITION</span><h2>${escapeHtml(item.englishTitle)}</h2><p>${escapeHtml(item.chapter)}</p></div>
          <div class="recognition-options">
            ${options.map((entry) => {
              const wasSelected = record?.answer === entry.id;
              const classes = ["choice-option"];
              if (record && entry.id === item.id) classes.push("correct");
              if (record && wasSelected && entry.id !== item.id) classes.push("incorrect");
              return `<button class="${classes.join(" ")}" data-action="recognition-answer" data-answer-id="${escapeHtml(entry.id)}" type="button">${escapeHtml(entry.chineseTitle)}</button>`;
            }).join("")}
          </div>
          <div class="card-actions">
            <button data-action="recognition-prev" type="button">上一题</button>
            <button data-action="recognition-next" type="button">下一题</button>
            <button data-action="recognition-shuffle" type="button">打乱顺序</button>
            <button data-action="recognition-wrong-mode" type="button">${recognitionState.mode === "wrong" ? "返回全部" : "只刷错题"}</button>
            <button data-action="recognition-reset" type="button">重新一轮</button>
          </div>
        </article>
      </div>`;
  }

  function recognitionPool() {
    const ordered = recognitionState.order.map((index) => data.terms[index]).filter(Boolean);
    return recognitionState.mode === "wrong" ? ordered.filter((item) => recognitionProgress[item.id] && !recognitionProgress[item.id].correct) : ordered;
  }

  function recognitionOptions(item) {
    const others = data.terms.filter((entry) => entry.id !== item.id);
    const seed = hashString(item.id);
    const picks = [others[seed % others.length], others[(seed * 7 + 3) % others.length], others[(seed * 13 + 5) % others.length]];
    const unique = [item, ...picks].filter((entry, index, array) => array.findIndex((candidate) => candidate.id === entry.id) === index);
    for (const candidate of others) {
      if (unique.length >= 4) break;
      if (!unique.some((entry) => entry.id === candidate.id)) unique.push(candidate);
    }
    return seededShuffle(unique, seed);
  }

  function renderChapters() {
    const items = applyFilters(allStudyItems, { ignoreChapter: true });
    const groups = groupBy(items, (item) => item.chapter || "待确认");
    const cards = [...groups.entries()].sort((a, b) => b[1].length - a[1].length).map(([chapter, entries]) => `
      <button class="chapter-card" data-action="open-chapter" data-chapter="${escapeHtml(chapter)}" type="button"><b>${escapeHtml(chapter)}</b><span>${entries.length}题 · ${entries.filter((item) => item.tier === "core").length}个高频</span></button>`).join("");
    const focused = state.chapterFocus ? applyFilters(allStudyItems.filter((item) => item.chapter === state.chapterFocus), { ignoreChapter: true }) : [];
    els.content.innerHTML = `${state.chapterFocus ? `<div class="section-note"><b>${escapeHtml(state.chapterFocus)}</b> · ${focused.length}题</div><div class="card-list">${focused.map(renderCard).join("")}</div><div class="tier-heading"><h2>其他章节</h2></div>` : ""}<div class="chapter-grid">${cards}</div>`;
  }

  function renderPast() {
    const filtered = filterPast(pastData.items);
    const groups = groupBy(filtered, (item) => item.paperLabel);
    if (!filtered.length) { els.content.innerHTML = emptyState(); return; }
    els.content.innerHTML = [...groups.entries()].map(([label, items], index) => `
      <details class="past-group" ${index === 0 ? "open" : ""}>
        <summary>${escapeHtml(label)}（${items.length}项）</summary>
        ${pastTable(items)}
      </details>`).join("");
  }

  function pastTable(items) {
    return `<div class="past-table"><table><thead><tr><th>题型/题号</th><th>题目摘要</th><th>核心考点</th><th>覆盖</th><th>习题集页</th><th>章节</th></tr></thead><tbody>
      ${items.map((item) => `<tr><td>${escapeHtml(item.qno)}</td><td>${escapeHtml(item.prompt)}</td><td>${escapeHtml(item.corePoint)}</td><td class="coverage-${escapeHtml((item.coverage || "d").toLowerCase())}">${escapeHtml(item.coverage)}</td><td>${escapeHtml(item.exercisePages)}</td><td>${escapeHtml(item.chapter)}</td></tr>`).join("")}
      </tbody></table></div>`;
  }

  function renderAll() {
    const study = applyFilters(allStudyItems);
    const historical = filterPast(pastData.items);
    const combined = [
      ...study.map((item) => ({ kind: "study", item })),
      ...historical.map((item) => ({ kind: "past", item }))
    ];
    const shown = combined.slice(0, state.limit);
    if (!shown.length) { els.content.innerHTML = emptyState(); return; }
    els.content.innerHTML = `
      <div class="section-note">当前检索到${combined.length}项；前${Math.min(state.limit, combined.length)}项已显示。历年摘要用于追溯，主线题卡用于训练。</div>
      <div class="card-list">${shown.map((entry) => entry.kind === "study" ? renderCard(entry.item) : renderPastCompact(entry.item)).join("")}</div>
      ${shown.length < combined.length ? `<button class="load-more" data-action="load-more" type="button">继续加载${Math.min(40, combined.length - shown.length)}项</button>` : ""}`;
  }

  function renderPastCompact(item) {
    return `<article class="question-card past" data-id="${escapeHtml(item.id)}" data-type="past"><div class="card-kicker"><span class="badge amber">历年摘要</span><span class="badge gray">${escapeHtml(item.paperLabel)}</span><span class="badge gray">${escapeHtml(item.qno)}</span></div><h3>${escapeHtml(item.prompt)}</h3><p class="prompt">核心考点：${escapeHtml(item.corePoint)}</p><p class="source-ref">${escapeHtml(item.chapter)} · 习题集PDF p${escapeHtml(item.exercisePages)} · 覆盖${escapeHtml(item.coverage)}</p></article>`;
  }

  function renderRaw() {
    const query = queryTokens();
    const items = pastData.rawItems.filter((item) => {
      if (!query.length) return true;
      const haystack = normalize([item.paperLabel, item.qno, item.rawText, item.issue, item.source].join(" "));
      return query.every((token) => haystack.includes(token));
    });
    els.content.innerHTML = items.length ? `<div class="card-list">${items.map((item) => `<article class="raw-card"><h3>${escapeHtml(item.issue)}</h3><p class="source-ref">${escapeHtml(item.paperLabel)} · ${escapeHtml(item.qno)} · ${escapeHtml(item.source)}</p><pre>${escapeHtml(item.rawText)}</pre></article>`).join("")}</div>` : emptyState();
  }

  function renderReturn() {
    const items = applyFilters(allStudyItems.filter((item) => learning[item.id]?.wrong || learning[item.id]?.review));
    renderCards(items);
  }

  function renderLast30() {
    const selected = allStudyItems.filter((item) => (item.tier === "core" && !learning[item.id]?.mastered) || learning[item.id]?.wrong || learning[item.id]?.review);
    const filtered = applyFilters(selected);
    els.content.innerHTML = `<div class="section-note"><b>停止扩展：</b>只回忆答案骨架和关键词。不会的题标记回看，不再查新资料。</div>${filtered.length ? `<div class="card-list">${filtered.map(renderCard).join("")}</div>` : emptyState("核心题已经全部标记掌握，没有遗留错题或回看项。")}`;
  }

  function applyFilters(items, options = {}) {
    const tokens = queryTokens();
    return items.filter((item) => {
      if (!options.ignoreChapter && state.chapter !== "all" && item.chapter !== state.chapter) return false;
      if (state.type !== "all" && item.type !== state.type) return false;
      if (state.source !== "all" && !matchesSource(item, state.source)) return false;
      if (state.hideMastered && learning[item.id]?.mastered) return false;
      if (state.onlyUndone && item.type === "choice" && choiceProgress[item.id]?.submitted) return false;
      if (!tokens.length) return true;
      const haystack = normalize([
        item.title, item.chineseTitle, item.englishTitle, item.prompt, item.chapter,
        item.examPoints, item.logic, item.keywords, item.papers, item.aliases,
        item.explanation, item.sourceLabel,
        (item.sources || []).map((entry) => `${entry.file} ${entry.page} ${entry.note}`),
        (item.options || []).map((entry) => `${entry.key} ${entry.text}`)
      ].flat(Infinity).join(" "));
      return tokens.every((token) => haystack.includes(token));
    });
  }

  function filterPast(items) {
    const tokens = queryTokens();
    return items.filter((item) => {
      if (state.chapter !== "all" && item.chapter !== state.chapter) return false;
      if (state.type !== "all" && state.type !== "past" && item.type !== state.type) return false;
      if (state.source !== "all" && state.source !== "past" && state.source !== "exercise") return false;
      if (!tokens.length) return true;
      const haystack = normalize([item.paperLabel, item.qno, item.prompt, item.corePoint, item.chapter, item.coverage, item.exercisePages, item.judgment, item.source].join(" "));
      return tokens.every((token) => haystack.includes(token));
    });
  }

  function matchesSource(item, sourceKey) {
    const text = normalize([(item.sources || []).map((entry) => entry.file), item.sourceLabel].flat().join(" "));
    if (sourceKey === "past") return Boolean(item.papers?.length) || /20\d{2}/.test(item.sourceLabel || "");
    if (sourceKey === "yibentong") return text.includes("一本通");
    if (sourceKey === "ppt") return text.includes("2026") || text.includes(".pdf");
    if (sourceKey === "term-pdf") return text.includes("名词解释");
    if (sourceKey === "exercise") return /习题集|定向补漏/.test(text);
    return true;
  }

  function handleContentClick(event) {
    const button = event.target.closest("button");
    if (!button) return;
    const action = button.dataset.action;
    const card = button.closest(".question-card");
    if (card?.dataset.id) saveLast(card.dataset.id, state.view);

    if (action === "go-view") return navigate(button.dataset.view);
    if (action === "toggle-answer") return toggleCardAnswer(card, button);
    if (button.dataset.status) return toggleStatus(card, button.dataset.status, button);
    if (action === "choice-option") return chooseOption(card, button.dataset.key);
    if (action === "submit-choice") return submitChoice(card);
    if (action === "reset-choice") return resetChoice(card);
    if (action === "recognition-answer") return answerRecognition(button.dataset.answerId);
    if (action === "recognition-prev") return moveRecognition(-1);
    if (action === "recognition-next") return moveRecognition(1);
    if (action === "recognition-shuffle") return shuffleRecognition();
    if (action === "recognition-wrong-mode") return toggleRecognitionMode();
    if (action === "recognition-reset") return resetRecognition();
    if (action === "recognition-auto") { recognitionState.autoNext = !recognitionState.autoNext; renderRecognition(); return; }
    if (action === "open-chapter") { state.chapterFocus = button.dataset.chapter; renderChapters(); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    if (action === "load-more") { state.limit += 40; renderAll(); return; }
  }

  function handleContentSubmit(event) {
    if (event.target.id !== "exam-form") return;
    event.preventDefault();
    const input = event.target.querySelector("#exam-input");
    if (!input?.value) return;
    examConfig = { examAt: new Date(input.value).toISOString() };
    saveJson(storageKeys.exam, examConfig);
    updateCountdown();
    showToast("考试时间已保存");
  }

  function toggleCardAnswer(card, button) {
    if (!card) return;
    const panel = card.querySelector(".answer-panel");
    const visible = panel.classList.toggle("visible");
    button.textContent = visible ? (card.dataset.type === "choice" ? "隐藏解析" : "隐藏答案") : (card.dataset.type === "choice" ? "显示解析" : "显示答案");
  }

  function toggleGlobalAnswers() {
    state.globalAnswers = !state.globalAnswers;
    document.querySelectorAll(".answer-panel").forEach((panel) => panel.classList.toggle("visible", state.globalAnswers));
    document.querySelectorAll('[data-action="toggle-answer"]').forEach((button) => {
      const isChoice = button.closest(".question-card")?.dataset.type === "choice";
      button.textContent = state.globalAnswers ? (isChoice ? "隐藏解析" : "隐藏答案") : (isChoice ? "显示解析" : "显示答案");
    });
    els.globalAnswer.textContent = state.globalAnswers ? "隐藏全部答案" : "显示全部答案";
  }

  function toggleStatus(card, key, button) {
    if (!card) return;
    const id = card.dataset.id;
    const current = { wrong: false, review: false, mastered: false, ...(learning[id] || {}) };
    current[key] = !current[key];
    if (key === "mastered" && current.mastered) { current.wrong = false; current.review = false; }
    if ((key === "wrong" || key === "review") && current[key]) current.mastered = false;
    learning[id] = current;
    saveJson(storageKeys.learning, learning);
    syncCardStatus(card, current);
    if (state.hideMastered && current.mastered) card.hidden = true;
    renderSummary();
    showToast(current[key] ? statusText(key) : "已取消标记");
  }

  function syncCardStatus(card, status) {
    card.classList.toggle("is-wrong", status.wrong);
    card.classList.toggle("is-mastered", status.mastered);
    const labels = {
      wrong: ["active-wrong", "已加入错题", "标记错题"],
      review: ["active-review", "需要回看", "标记回看"],
      mastered: ["active-mastered", "已掌握", "标记掌握"]
    };
    Object.entries(labels).forEach(([key, values]) => {
      const button = card.querySelector(`[data-status="${key}"]`);
      if (!button) return;
      button.classList.toggle(values[0], Boolean(status[key]));
      button.textContent = status[key] ? values[1] : values[2];
    });
  }

  function chooseOption(card, key) {
    if (!card) return;
    const item = data.choices.find((entry) => entry.id === card.dataset.id);
    if (!item) return;
    const progress = { selected: [], submitted: false, correct: false, ...(choiceProgress[item.id] || {}) };
    if (progress.submitted) return;
    if (item.mode === "single") {
      progress.selected = [key];
      progress.submitted = true;
      progress.correct = sameAnswers(progress.selected, item.answer);
      choiceProgress[item.id] = progress;
      saveJson(storageKeys.choices, choiceProgress);
      autoMarkChoice(item.id, progress.correct);
      replaceCard(card, renderChoiceCard(item));
      renderSummary();
      return;
    }
    const selected = new Set(progress.selected || []);
    selected.has(key) ? selected.delete(key) : selected.add(key);
    progress.selected = [...selected];
    choiceProgress[item.id] = progress;
    saveJson(storageKeys.choices, choiceProgress);
    card.querySelector(`[data-key="${cssEscape(key)}"]`)?.classList.toggle("selected", selected.has(key));
  }

  function submitChoice(card) {
    if (!card) return;
    const item = data.choices.find((entry) => entry.id === card.dataset.id);
    const progress = { selected: [], submitted: false, correct: false, ...(choiceProgress[item.id] || {}) };
    if (!progress.selected.length) { showToast("请先选择答案"); return; }
    progress.submitted = true;
    progress.correct = sameAnswers(progress.selected, item.answer);
    choiceProgress[item.id] = progress;
    saveJson(storageKeys.choices, choiceProgress);
    autoMarkChoice(item.id, progress.correct);
    replaceCard(card, renderChoiceCard(item));
    renderSummary();
  }

  function resetChoice(card) {
    if (!card) return;
    const item = data.choices.find((entry) => entry.id === card.dataset.id);
    delete choiceProgress[item.id];
    saveJson(storageKeys.choices, choiceProgress);
    replaceCard(card, renderChoiceCard(item));
    renderSummary();
  }

  function autoMarkChoice(id, correct) {
    const current = { wrong: false, review: false, mastered: false, ...(learning[id] || {}) };
    if (!correct) { current.wrong = true; current.mastered = false; }
    learning[id] = current;
    saveJson(storageKeys.learning, learning);
  }

  function answerRecognition(answerId) {
    const pool = recognitionPool();
    const item = pool[recognitionState.index];
    if (!item) return;
    const correct = answerId === item.id;
    recognitionProgress[item.id] = { answer: answerId, correct };
    saveJson(storageKeys.recognition, recognitionProgress);
    if (!correct) {
      learning[item.id] = { wrong: true, review: Boolean(learning[item.id]?.review), mastered: false };
      saveJson(storageKeys.learning, learning);
    }
    renderRecognition();
    renderSummary();
    window.clearTimeout(recognitionTimer);
    if (correct && recognitionState.autoNext) recognitionTimer = window.setTimeout(() => moveRecognition(1), 650);
  }

  function moveRecognition(delta) {
    const pool = recognitionPool();
    if (!pool.length) return;
    recognitionState.index = (recognitionState.index + delta + pool.length) % pool.length;
    renderRecognition();
  }

  function shuffleRecognition() {
    recognitionState.order = seededShuffle(recognitionState.order, Date.now());
    recognitionState.index = 0;
    renderRecognition();
  }

  function toggleRecognitionMode() {
    const wrong = data.terms.filter((item) => recognitionProgress[item.id] && !recognitionProgress[item.id].correct);
    if (recognitionState.mode === "all" && !wrong.length) { showToast("当前没有速认错题"); return; }
    recognitionState.mode = recognitionState.mode === "all" ? "wrong" : "all";
    recognitionState.index = 0;
    renderRecognition();
  }

  function resetRecognition() {
    Object.keys(recognitionProgress).forEach((key) => delete recognitionProgress[key]);
    saveJson(storageKeys.recognition, recognitionProgress);
    recognitionState.mode = "all";
    recognitionState.index = 0;
    renderRecognition();
  }

  function randomQuestion() {
    const pool = applyFilters(allStudyItems).filter((item) => item.type !== "raw");
    if (!pool.length) { showToast("当前筛选下没有题目"); return; }
    const item = pool[Math.floor(Math.random() * pool.length)];
    const view = item.type === "term" ? "terms" : item.type === "short" ? "shorts" : item.type === "case" ? "cases" : "choices";
    navigate(view, { noScroll: true });
    window.setTimeout(() => scrollToCard(item.id), 30);
  }

  function continueLast() {
    if (!lastPosition?.id) { showToast("还没有上次位置"); return; }
    navigate(lastPosition.view || "all", { noScroll: true });
    window.setTimeout(() => {
      if (!scrollToCard(lastPosition.id) && state.view !== "all") {
        navigate("all", { noScroll: true });
        state.limit = allStudyItems.length + pastData.items.length;
        renderAll();
        window.setTimeout(() => scrollToCard(lastPosition.id), 30);
      }
    }, 30);
  }

  function saveLast(id, view) {
    lastPosition = { id, view, savedAt: new Date().toISOString() };
    saveJson(storageKeys.last, lastPosition);
  }

  function scrollToCard(id) {
    const card = document.querySelector(`[data-id="${cssEscape(id)}"]`);
    if (!card) return false;
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    card.animate([{ outline: "3px solid rgba(201,135,44,.7)" }, { outline: "3px solid transparent" }], { duration: 1400 });
    return true;
  }

  function clearFilters() {
    state.query = ""; state.chapter = "all"; state.type = "all"; state.source = "all"; state.hideMastered = false; state.onlyUndone = false; state.chapterFocus = null; state.limit = 40;
    els.search.value = ""; els.chapter.value = "all"; els.type.value = "all"; els.source.value = "all"; els.hideMastered.checked = false; els.onlyUndone.checked = false;
    render();
  }

  function populateChapterFilter() {
    const chapters = [...new Set([...allStudyItems.map((item) => item.chapter), ...pastData.items.map((item) => item.chapter)].filter(Boolean))].sort((a, b) => a.localeCompare(b, "zh-CN"));
    els.chapter.innerHTML = `<option value="all">全部章节</option>${chapters.map((chapter) => `<option value="${escapeHtml(chapter)}">${escapeHtml(chapter)}</option>`).join("")}`;
  }

  function updateCountdown() {
    const exam = new Date(examConfig.examAt);
    const delta = exam.getTime() - Date.now();
    if (!Number.isFinite(delta)) { els.countdown.innerHTML = "<b>考试时间待设置</b>"; return; }
    if (delta <= 0) { els.countdown.innerHTML = "<b>考试时间已到</b><span>按实际安排复习</span>"; return; }
    const totalMinutes = Math.floor(delta / 60000);
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;
    const label = days ? `${days}天 ${hours}时 ${minutes}分` : `${hours}时 ${minutes}分`;
    els.countdown.innerHTML = `<b>${escapeHtml(label)}</b><span>距7月2日 13:00</span>`;
  }

  function queryTokens() { return normalize(state.query).split(/\s+/).filter(Boolean); }
  function normalize(value) { return String(value || "").toLowerCase().replace(/[\s·—–_\-/（）()，,。：:；;]+/g, " ").trim(); }
  function typeLabel(type) { return ({ term: "名词解释", short: "简答题", case: "病例分析", choice: "选择题" })[type] || type; }
  function statusText(key) { return ({ wrong: "已加入错题", review: "已标记回看", mastered: "已标记掌握" })[key]; }
  function groupBy(items, fn) { const map = new Map(); items.forEach((item) => { const key = fn(item); if (!map.has(key)) map.set(key, []); map.get(key).push(item); }); return map; }
  function sameAnswers(a, b) { return [...a].sort().join("|") === [...b].sort().join("|"); }
  function replaceCard(card, html) { card.outerHTML = html; }
  function emptyState(message = "当前筛选下没有内容。") { return `<div class="empty-state"><b>${escapeHtml(message)}</b><p>可以清空筛选或切换其他入口。</p></div>`; }
  function toLocalInput(value) { const date = new Date(value); if (!Number.isFinite(date.getTime())) return ""; const offset = date.getTimezoneOffset(); return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16); }
  function hashString(value) { let hash = 0; for (let i = 0; i < value.length; i += 1) hash = ((hash << 5) - hash + value.charCodeAt(i)) | 0; return Math.abs(hash); }
  function seededShuffle(values, seed) { const array = [...values]; let x = Number(seed) || 1; for (let i = array.length - 1; i > 0; i -= 1) { x = (x * 1664525 + 1013904223) % 4294967296; const j = x % (i + 1); [array[i], array[j]] = [array[j], array[i]]; } return array; }
  function cssEscape(value) { return window.CSS?.escape ? window.CSS.escape(value) : String(value).replace(/["\\]/g, "\\$&"); }
  function escapeHtml(value) { return String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]); }
  function loadJson(key, fallback) { try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; } catch (_) { return fallback; } }
  function saveJson(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) { /* local file privacy restrictions */ } }
  function showToast(message) { els.toast.textContent = message; els.toast.classList.add("show"); window.setTimeout(() => els.toast.classList.remove("show"), 1800); }
}());
