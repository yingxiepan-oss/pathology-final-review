(function () {
  "use strict";

  const source = (file, page, note = "") => ({ file, page, note });
  const option = (key, text) => ({ key, text });

  const terms = [
    {
      id: "term-cccdna", type: "term", tier: "core", frequency: 3, chapter: "肝炎病毒",
      englishTitle: "covalently closed circular DNA (cccDNA)", chineseTitle: "共价闭合环状DNA",
      papers: ["2023 预防/法医", "2022 口腔", "2022 临八"], aliases: ["cccDNA", "HBV复制模板"],
      examPoints: ["HBV松弛环状DNA进入肝细胞核后，经宿主修复形成的共价闭合环状双链DNA。", "以微染色体形式长期稳定存在，是病毒转录模板，也是停药后复发和难以彻底清除的重要原因。"],
      logic: ["rcDNA入核 → 修复 → cccDNA → 转录各种病毒RNA → 前基因组RNA逆转录。"], keywords: ["HBV", "细胞核", "转录模板", "长期稳定", "复发"],
      sources: [source("微生物学大题一本通.pdf", "PDF p42-43"), source("肝炎病毒.pdf", "HBV复制")]
    },
    {
      id: "term-coagulase", type: "term", tier: "core", frequency: 3, chapter: "球菌",
      englishTitle: "coagulase", chineseTitle: "凝固酶", papers: ["2023 预防/法医", "2022 口腔", "2022 临八"],
      examPoints: ["金黄色葡萄球菌产生的、能使含抗凝剂的人或兔血浆发生凝固的酶类物质。", "分游离凝固酶和结合凝固酶；有助于抗吞噬并使感染局限化，是鉴别致病性葡萄球菌的重要指标。"],
      logic: ["游离凝固酶激活凝固酶反应因子；结合凝固酶直接使菌体凝集。"], keywords: ["金黄色葡萄球菌", "血浆凝固", "抗吞噬", "鉴别"], sources: [source("微生物学名词解释.pdf", "凝固酶"), source("7-球菌-2026 (1).pdf", "葡萄球菌")]
    },
    {
      id: "term-stormy-fermentation", type: "term", tier: "core", frequency: 3, chapter: "厌氧菌",
      englishTitle: "stormy fermentation", chineseTitle: "汹涌发酵", papers: ["2023 预防/法医", "2022 口腔", "2022 临八"],
      examPoints: ["产气荚膜梭菌在牛乳培养基中迅速分解乳糖，产生大量酸和气体。", "酸使酪蛋白凝固，气体将凝块冲散，形成汹涌状现象，具有鉴别意义。"],
      logic: ["乳糖发酵 → 酸凝固酪蛋白；大量产气 → 凝块碎裂上冲。"], keywords: ["产气荚膜梭菌", "牛乳培养基", "酸", "气", "鉴别"], sources: [source("微生物学名词解释.pdf", "汹涌发酵"), source("11-厌氧菌属-2026 (1).pdf", "产气荚膜梭菌")]
    },
    {
      id: "term-cpe", type: "term", tier: "core", frequency: 3, chapter: "病毒总论",
      englishTitle: "cytopathic effect (CPE)", chineseTitle: "细胞病变效应", papers: ["2023 预防/法医", "2022 口腔", "2022 临八"],
      examPoints: ["病毒在培养细胞内增殖引起的、可在显微镜下观察到的细胞形态和结构改变。", "常见表现为细胞圆缩、脱落、裂解、融合形成多核巨细胞或出现包涵体，可用于病毒分离鉴定。"],
      logic: ["病毒复制或病毒蛋白表达损伤宿主细胞，形成具有一定病毒特异性的形态变化。"], keywords: ["培养细胞", "形态改变", "融合", "包涵体", "鉴定"], sources: [source("微生物学名词解释.pdf", "CPE"), source("16-病毒的致病性和抗病毒免疫-2026.pdf", "病毒感染细胞结局")]
    },
    {
      id: "term-pyrogenic-exotoxin", type: "term", tier: "core", frequency: 3, chapter: "球菌",
      englishTitle: "pyrogenic exotoxin", chineseTitle: "致热外毒素（猩红热毒素）", papers: ["2023 预防/法医", "2022 口腔", "2022 临八"],
      examPoints: ["由携带毒素基因的温和噬菌体溶原化的A群链球菌产生的外毒素。", "具有超抗原活性，可引起发热、猩红热样皮疹及中毒性休克等全身反应。"],
      logic: ["噬菌体编码 → 超抗原非特异激活大量T细胞 → 细胞因子大量释放。"], keywords: ["A群链球菌", "溶原转换", "超抗原", "猩红热"], sources: [source("微生物学名词解释.pdf", "致热外毒素"), source("7-球菌-2026 (1).pdf", "链球菌")]
    },
    {
      id: "term-reverse-transcriptase", type: "term", tier: "core", frequency: 3, chapter: "逆转录病毒与HBV",
      englishTitle: "reverse transcription / reverse transcriptase", chineseTitle: "逆转录／逆转录酶", papers: ["2023 预防/法医", "2022 口腔（原回忆作reverse transcription）", "2022 临八"],
      aliases: ["reverse transcription", "reverse transcriptase", "逆转录", "逆转录酶"],
      examPoints: ["若题目问reverse transcription（逆转录）：指以RNA为模板合成DNA的过程。", "若题目问reverse transcriptase（逆转录酶）：指催化该过程的病毒酶，典型兼有RNA依赖的DNA聚合酶、RNase H和DNA依赖的DNA聚合酶活性；HIV和HBV复制均涉及逆转录。"],
      logic: ["RNA → RNA-DNA杂交体 → 降解RNA模板 → 双链DNA。"], keywords: ["RNA模板", "DNA", "RNase H", "HIV", "HBV"], sources: [source("微生物学名词解释.pdf", "逆转录酶"), source("逆转录病毒、朊粒.pdf", "逆转录")]
    },
    {
      id: "term-slow-virus-infection", type: "term", tier: "core", frequency: 2, chapter: "病毒感染类型",
      englishTitle: "slow virus infection", chineseTitle: "慢发病毒感染", papers: ["2022 预防", "2021 临八"],
      examPoints: ["病毒感染后潜伏期很长，发病呈慢性进行性发展，最终常导致严重甚至致死性结局的一类持续感染。", "可由常规病毒或朊粒引起，如麻疹病毒相关SSPE、HIV感染及朊粒病。"],
      logic: ["长期潜伏并不等于静止；病原持续存在，临床一旦出现常进行性加重。"], keywords: ["长潜伏期", "慢性进行性", "持续感染", "SSPE", "HIV"], sources: [source("微生物学名词解释.pdf", "慢发病毒感染"), source("16-病毒的致病性和抗病毒免疫-2026.pdf", "持续感染")]
    },
    {
      id: "term-virus-life-cycle", type: "term", tier: "core", frequency: 2, chapter: "病毒总论",
      englishTitle: "virus replication cycle", chineseTitle: "病毒复制周期", papers: ["2022 预防", "2021 临八"],
      examPoints: ["病毒在易感细胞内产生子代病毒的全过程。", "基本阶段包括吸附、穿入、脱壳、生物合成、装配成熟和释放；其增殖方式为复制而非二分裂。"],
      logic: ["进入细胞前强调受体特异性；生物合成期包括早期蛋白、核酸复制和晚期结构蛋白。"], keywords: ["吸附", "穿入", "脱壳", "生物合成", "装配释放"], sources: [source("微生物学名词解释.pdf", "病毒复制周期"), source("14-病毒结构和增殖-2026(1) (1).pdf", "病毒复制")]
    },
    {
      id: "term-toxoid", type: "term", tier: "core", frequency: 2, chapter: "细菌感染防治",
      englishTitle: "toxoid", chineseTitle: "类毒素", papers: ["2022 预防", "2021 临八"],
      examPoints: ["外毒素经甲醛等处理后失去毒性而保留抗原性的制剂。", "可刺激机体产生抗毒素，用于人工主动免疫，如白喉和破伤风类毒素。"],
      logic: ["去毒不去抗原性；类毒素用于预防，抗毒素或免疫球蛋白用于紧急被动免疫。"], keywords: ["外毒素", "甲醛", "失去毒性", "保留抗原性", "主动免疫"], sources: [source("微生物学名词解释.pdf", "类毒素；原资料英文拼写已校正"), source("6-细菌感染的检测与防治-2026.pdf", "疫苗")]
    },
    {
      id: "term-bacterial-l-form", type: "term", tier: "core", frequency: 2, chapter: "细菌形态结构",
      englishTitle: "bacterial L-form", chineseTitle: "细菌L型", papers: ["2022 预防", "2021 临八"],
      examPoints: ["细菌在某些条件下细胞壁肽聚糖结构受损或合成受抑制，形成的细胞壁缺陷型。", "形态多形、革兰染色不定，在高渗低琼脂含血清培养基中生长；部分可回复为原菌，可能与慢性和反复感染有关。"],
      logic: ["青霉素、溶菌酶或免疫压力 → 细胞壁缺陷；失去细胞壁后对渗透压敏感且对作用于细胞壁的药物不敏感。"], keywords: ["细胞壁缺陷", "高渗培养", "多形性", "回复", "慢性感染"], sources: [source("微生物学名词解释.pdf", "细菌L型"), source("2-细菌的形态结构与分类-2026 (1).pdf", "细胞壁")]
    },
    {
      id: "term-transduction", type: "term", tier: "core", frequency: 2, chapter: "细菌遗传变异",
      englishTitle: "transduction", chineseTitle: "转导", papers: ["2022 预防", "2021 临八"],
      examPoints: ["以噬菌体为媒介，将供体菌DNA片段转移到受体菌，使受体菌获得新性状的基因转移方式。", "分普遍性转导和局限性转导。"],
      logic: ["普遍性转导源于装配错误，可转移任意片段；局限性转导源于前噬菌体异常切离，只转移邻近基因。"], keywords: ["噬菌体", "供体DNA", "普遍性", "局限性"], sources: [source("微生物学名词解释.pdf", "转导"), source("4-细菌的遗传变异-2026 (1).pdf", "基因转移")]
    },
    {
      id: "term-reassortment", type: "term", tier: "core", frequency: 2, chapter: "病毒遗传变异",
      englishTitle: "reassortment", chineseTitle: "重配", papers: ["2022 预防", "2021 临八"],
      examPoints: ["两种亲缘关系相近、基因组分节段的病毒共同感染同一细胞时，子代病毒交换并重新组合完整基因节段的现象。", "可导致表型显著改变，如甲型流感病毒抗原性转变。"],
      logic: ["必须具备：分节段基因组＋共同感染同一细胞。"], keywords: ["分节段", "共同感染", "交换基因节段", "流感"], sources: [source("微生物学名词解释.pdf", "重配"), source("15-病毒的进化和变异-2026.pdf", "重配")]
    },
    {
      id: "term-prokaryotic-microorganism", type: "term", tier: "past", frequency: 1, chapter: "绪论",
      englishTitle: "prokaryotic microorganism", chineseTitle: "原核细胞型微生物", papers: ["2018 预防"],
      examPoints: ["细胞核分化程度低、无核膜和核仁，遗传物质位于核质中，细胞器仅有核糖体的一类细胞型微生物。", "包括细菌、放线菌、支原体、衣原体、立克次体和螺旋体等。"],
      logic: ["有细胞结构并可进行自身代谢；与无细胞结构、依赖活细胞复制的病毒不同。"], keywords: ["无核膜", "核质", "70S核糖体", "细菌"], sources: [source("医学微生物学（第10版）", "绪论；补齐名词资料缺项")]
    },
    {
      id: "term-lysogenic-bacterium", type: "term", tier: "past", frequency: 1, chapter: "噬菌体",
      englishTitle: "lysogenic bacterium", chineseTitle: "溶原性细菌", papers: ["2018 预防"],
      examPoints: ["染色体中整合有温和噬菌体基因组（前噬菌体）的细菌。", "可随细菌染色体复制并传给子代；在诱导条件下前噬菌体可进入裂解周期，部分菌可因溶原转换获得新性状。"],
      logic: ["温和噬菌体感染 → 前噬菌体整合 → 稳定遗传；诱导 → 裂解。"], keywords: ["温和噬菌体", "前噬菌体", "整合", "溶原转换"], sources: [source("微生物学名词解释.pdf", "溶原性细菌"), source("4-细菌的遗传变异-2026 (1).pdf", "噬菌体")]
    },
    {
      id: "term-infectious-rna", type: "term", tier: "past", frequency: 1, chapter: "病毒总论",
      englishTitle: "infectious RNA", chineseTitle: "感染性RNA", papers: ["2018 预防"],
      examPoints: ["某些正链RNA病毒的基因组RNA，单独导入易感细胞后即可作为mRNA翻译并启动完整复制周期，产生感染性子代病毒。", "负链RNA通常不具感染性，因为必须同时携带病毒RNA依赖的RNA聚合酶。"],
      logic: ["+ssRNA可直接翻译；-ssRNA先转录成mRNA，裸核酸缺少聚合酶时不能启动。"], keywords: ["正链RNA", "mRNA", "裸核酸", "感染性"], sources: [source("微生物学名词解释.pdf", "感染性核酸"), source("14-病毒结构和增殖-2026(1) (1).pdf", "RNA病毒复制")]
    },
    {
      id: "term-antigenic-shift", type: "term", tier: "past", frequency: 1, chapter: "呼吸道病毒",
      englishTitle: "antigenic shift", chineseTitle: "抗原性转变", papers: ["2018 预防"],
      examPoints: ["甲型流感病毒因基因节段重配，使HA和/或NA抗原发生幅度很大的突然改变。", "人群对新亚型缺乏免疫力，可能引起流感世界性大流行。"],
      logic: ["shift：大变异、重配、新亚型、大流行；drift：点突变、小变异、季节性流行。"], keywords: ["甲型流感", "重配", "HA", "NA", "大流行"], sources: [source("微生物学名词解释.pdf", "抗原性转变"), source("呼吸道感染的病毒(一) (1).pdf", "流感变异")]
    },
    {
      id: "term-crossing-reactivation", type: "term", tier: "past", frequency: 1, chapter: "病毒遗传变异",
      englishTitle: "crossing reactivation", chineseTitle: "交叉复活", papers: ["2018 预防"],
      examPoints: ["两株基因型不同且核酸均受损而失去感染性的病毒共同感染同一细胞时，通过遗传重组互相补偿，产生具有感染性子代病毒的现象。"],
      logic: ["关键是两个失活病毒共同感染和遗传信息重组；区别于仅由功能蛋白互补而不改变基因型的互补作用。"], keywords: ["失活病毒", "共同感染", "重组", "感染性子代"], sources: [source("微生物学名词解释.pdf", "交叉复活"), source("15-病毒的进化和变异-2026.pdf", "重组")]
    },
    {
      id: "term-daa", type: "term", tier: "past", frequency: 1, chapter: "病毒防治",
      englishTitle: "direct-acting antiviral (DAA)", chineseTitle: "直接作用抗病毒药物", papers: ["2023 临五"],
      examPoints: ["直接靶向病毒复制所必需的特异性病毒蛋白或酶，从而阻断病毒生命周期的抗病毒药物。", "例如抗HCV的NS3/4A蛋白酶、NS5A或NS5B聚合酶抑制剂；联合用药可提高疗效并降低耐药。"],
      logic: ["与主要调节宿主免疫的药物不同，DAA直接作用于病毒靶点。"], keywords: ["病毒蛋白", "HCV", "蛋白酶", "聚合酶", "联合用药"], sources: [source("17-病毒感染的检测和防治-2026.pdf", "抗病毒治疗；补齐名词资料缺项")]
    },
    {
      id: "term-mic", type: "term", tier: "past", frequency: 1, chapter: "抗菌药物",
      englishTitle: "minimum inhibitory concentration (MIC)", chineseTitle: "最低抑菌浓度", papers: ["2023 临五"],
      examPoints: ["在规定条件下培养一定时间后，能够抑制肉眼可见微生物生长的某抗菌药物最低浓度。", "用于定量评价细菌对药物的敏感性，不等同于最低杀菌浓度MBC。"],
      logic: ["MIC看不见生长；MBC要求杀死规定比例细菌并经转种不生长。"], keywords: ["最低浓度", "抑制生长", "药敏", "MBC"], sources: [source("微生物学名词解释.pdf", "MIC"), source("6-细菌感染的检测与防治-2026.pdf", "药敏试验")]
    },
    {
      id: "term-spa", type: "term", tier: "past", frequency: 1, chapter: "球菌",
      englishTitle: "staphylococcal protein A (SPA)", chineseTitle: "葡萄球菌A蛋白", papers: ["2023 临五"],
      examPoints: ["金黄色葡萄球菌细胞壁表面的蛋白质，可与人及多种哺乳动物IgG的Fc段非特异结合。", "可干扰调理吞噬，是致病因素；也可作为协同凝集试验的载体。"],
      logic: ["SPA抓住Fc端，使Fab端朝外；既妨碍正常调理，又能负载特异抗体用于检测抗原。"], keywords: ["金黄色葡萄球菌", "IgG Fc", "抗吞噬", "协同凝集"], sources: [source("微生物学名词解释.pdf", "SPA"), source("7-球菌-2026 (1).pdf", "葡萄球菌")]
    },
    {
      id: "term-latent-infection", type: "term", tier: "past", frequency: 1, chapter: "病毒感染类型",
      englishTitle: "latent infection", chineseTitle: "潜伏感染", papers: ["2023 临五"],
      examPoints: ["原发感染后病毒基因组长期存在于特定细胞或组织中，通常不产生完整感染性病毒，也无明显症状。", "在一定条件下病毒可被激活、增殖并引起复发性疾病，如HSV和VZV。"],
      logic: ["潜伏期无或少量病毒复制；再激活后沿神经或其他途径到达靶组织复发。"], keywords: ["病毒基因组", "长期存在", "再激活", "复发", "HSV"], sources: [source("微生物学名词解释.pdf", "潜伏感染"), source("16-病毒的致病性和抗病毒免疫-2026.pdf", "持续感染")]
    },
    {
      id: "term-viral-receptor", type: "term", tier: "past", frequency: 1, chapter: "病毒总论",
      englishTitle: "viral receptor", chineseTitle: "病毒受体", papers: ["2022 临五"],
      examPoints: ["易感细胞表面或细胞内能被病毒表面结构特异识别并结合、介导吸附或进入的宿主分子。", "受体分布是决定病毒宿主范围和组织嗜性的重要因素之一。"],
      logic: ["有受体是易感的重要条件，但病毒复制还取决于细胞内环境是否允许。"], keywords: ["特异结合", "吸附", "宿主范围", "组织嗜性"], sources: [source("微生物学名词解释.pdf", "病毒受体"), source("14-病毒结构和增殖-2026(1) (1).pdf", "吸附")]
    },
    {
      id: "term-hemagglutination", type: "term", tier: "past", frequency: 1, chapter: "病毒检测",
      englishTitle: "hemagglutination", chineseTitle: "血凝现象", papers: ["2022 临五"],
      examPoints: ["某些病毒表面的血凝素与红细胞表面受体结合，使红细胞发生肉眼可见凝集的现象。", "可用于病毒定量；特异性抗体阻止血凝称血凝抑制试验，可用于抗体测定或病毒鉴定。"],
      logic: ["血凝试验测病毒颗粒的凝集能力，不等同于感染性滴度。"], keywords: ["血凝素", "红细胞", "病毒定量", "血凝抑制"], sources: [source("微生物学名词解释.pdf", "血凝"), source("17-病毒感染的检测和防治-2026.pdf", "血清学诊断")]
    }
  ];

  const starredHistoricalTermIds = new Set([
    "term-bacterial-l-form", "term-transduction", "term-toxoid", "term-mic", "term-spa",
    "term-coagulase", "term-pyrogenic-exotoxin", "term-stormy-fermentation",
    "term-reverse-transcriptase", "term-virus-life-cycle", "term-infectious-rna",
    "term-crossing-reactivation", "term-viral-receptor", "term-latent-infection", "term-cpe",
    "term-antigenic-shift", "term-reassortment", "term-hemagglutination"
  ]);
  terms.forEach((item) => { if (starredHistoricalTermIds.has(item.id)) item.starred = true; });

  terms.push(
    {
      id: "term-growth-curve", type: "term", tier: "supplement", frequency: 0, starred: true, chapter: "细菌生理",
      englishTitle: "growth curve", chineseTitle: "细菌生长曲线", papers: [],
      examPoints: ["将一定量细菌接种于适宜液体培养基，定时测定活菌数，以培养时间为横坐标、活菌数对数为纵坐标绘制的曲线。", "分为迟缓期、对数期、稳定期和衰亡期，反映封闭培养条件下细菌群体生长规律。"],
      logic: ["对数期代谢和繁殖最旺盛、形态典型；稳定期次级代谢产物和芽胞等较多。"], keywords: ["迟缓期", "对数期", "稳定期", "衰亡期"],
      sources: [source("微生物学名词解释.pdf", "PDF p3", "原文带*")]
    },
    {
      id: "term-plasmid", type: "term", tier: "supplement", frequency: 0, starred: true, chapter: "细菌遗传变异",
      englishTitle: "plasmid", chineseTitle: "质粒", papers: [],
      examPoints: ["细菌染色体外、能自主复制的遗传物质，通常为共价闭合环状双链DNA复制子。", "一般不是细菌生命活动所必需，但可赋予耐药、毒力等性状；可游离或整合、转移、丢失，并具有相容性和不相容性。"],
      logic: ["关键词：染色体外＋自主复制＋非必需性状＋可转移。"], keywords: ["染色体外", "自主复制", "环状dsDNA", "可转移"],
      sources: [source("微生物学名词解释.pdf", "PDF p4", "原文带*")]
    },
    {
      id: "term-resistance-plasmid", type: "term", tier: "supplement", frequency: 0, starred: true, chapter: "细菌遗传变异",
      englishTitle: "resistance plasmid (R plasmid)", chineseTitle: "耐药质粒（R质粒）", papers: [],
      examPoints: ["携带耐药基因并可使细菌获得一种或多种抗菌药物耐药性的质粒。", "典型R质粒由耐药传递因子RTF和耐药决定子r-det组成：RTF负责复制、接合和转移，r-det决定具体耐药性。"],
      logic: ["RTF管‘传’，r-det管‘耐什么药’。"], keywords: ["RTF", "r-det", "接合转移", "耐药基因"],
      sources: [source("微生物学名词解释.pdf", "PDF p4", "原文带*")]
    },
    {
      id: "term-conjugation", type: "term", tier: "supplement", frequency: 0, starred: true, chapter: "细菌遗传变异",
      englishTitle: "conjugation", chineseTitle: "接合", papers: [],
      examPoints: ["供体菌与受体菌直接接触，通常通过性菌毛或接合装置，将质粒或染色体DNA转移给受体菌的基因转移方式。"],
      logic: ["需要细胞直接接触；区别于摄取游离DNA的转化和噬菌体介导的转导。"], keywords: ["直接接触", "性菌毛", "供体菌", "受体菌"],
      sources: [source("微生物学名词解释.pdf", "PDF p4", "原文带*")]
    },
    {
      id: "term-nosocomial-infection", type: "term", tier: "supplement", frequency: 0, starred: true, chapter: "细菌感染与免疫",
      englishTitle: "nosocomial infection", chineseTitle: "医院感染", papers: [],
      examPoints: ["患者、医务人员等在医院或其他医疗机构内获得的感染，又称医院获得性感染。", "可分内源性感染和外源性感染；机会致病菌、侵入性操作、抗菌药物选择压力及交叉传播是重要因素。"],
      logic: ["入院时已处于潜伏期的原有感染通常不属于医院感染。"], keywords: ["医院获得", "内源性", "外源性", "机会致病菌"],
      sources: [source("微生物学名词解释.pdf", "PDF p7", "原文带*")]
    },
    {
      id: "term-staphylococcal-enterotoxin", type: "term", tier: "supplement", frequency: 0, starred: true, chapter: "球菌",
      englishTitle: "staphylococcal enterotoxin (SE)", chineseTitle: "葡萄球菌肠毒素", papers: [],
      examPoints: ["金黄色葡萄球菌产生的一组外毒素，部分具有超抗原活性，耐热并抵抗胃肠道蛋白酶。", "摄入食物中预先形成的毒素后可在数小时内引起以恶心、呕吐、腹痛和腹泻为主的自限性食物中毒。"],
      logic: ["属于食物中预形成毒素型中毒，潜伏期短；加热杀菌不一定破坏已形成的耐热毒素。"], keywords: ["金黄色葡萄球菌", "耐热", "超抗原", "食物中毒", "呕吐"],
      sources: [source("微生物学名词解释.pdf", "PDF p8", "原文带*")]
    },
    {
      id: "term-widal-test", type: "term", tier: "supplement", frequency: 0, starred: true, chapter: "肠杆菌科",
      englishTitle: "Widal test", chineseTitle: "肥达试验", papers: [],
      examPoints: ["用已知伤寒沙门菌O、H抗原及副伤寒沙门菌H抗原，与患者系列稀释血清进行定量凝集，检测相应抗体及效价的试验。", "用于辅助诊断伤寒和副伤寒；应结合当地正常效价、病程及双份血清抗体效价四倍以上升高判断。"],
      logic: ["不能仅凭单次低效价确诊；既往感染、疫苗接种和交叉反应可影响结果。"], keywords: ["O抗原", "H抗原", "凝集", "双份血清", "四倍升高"],
      sources: [source("微生物学名词解释.pdf", "PDF p9", "原文带*")]
    },
    {
      id: "term-koch-phenomenon", type: "term", tier: "supplement", frequency: 0, starred: true, chapter: "分枝杆菌",
      englishTitle: "Koch phenomenon", chineseTitle: "科赫现象", papers: [],
      examPoints: ["结核分枝杆菌初次感染与再次感染表现不同的现象，反映抗结核特异性细胞免疫与迟发型超敏反应同时存在。", "已感染动物再次接种时局部反应出现快而强、病灶较表浅且细菌不易扩散；大剂量可因超敏反应造成严重损伤。"],
      logic: ["保护性细胞免疫限制细菌扩散，IV型超敏反应造成局部组织损伤。"], keywords: ["结核", "细胞免疫", "IV型超敏反应", "再次感染"],
      sources: [source("微生物学名词解释.pdf", "PDF p10", "原文带*")]
    },
    {
      id: "term-acid-fast-stain", type: "term", tier: "supplement", frequency: 0, starred: true, chapter: "分枝杆菌",
      englishTitle: "acid-fast stain (Ziehl-Neelsen stain)", chineseTitle: "抗酸染色", papers: [],
      examPoints: ["利用分枝杆菌细胞壁富含分枝菌酸、经石炭酸复红加热染色后不易被盐酸酒精脱色的特性进行的鉴别染色。", "齐-尼法中抗酸菌保留红色，非抗酸菌和背景经亚甲蓝复染呈蓝色。"],
      logic: ["初染石炭酸复红并加热—盐酸酒精脱色—亚甲蓝复染。"], keywords: ["分枝菌酸", "石炭酸复红", "盐酸酒精", "红色"],
      sources: [source("微生物学名词解释.pdf", "PDF p10", "原文带*")]
    },
    {
      id: "term-antigenic-drift", type: "term", tier: "supplement", frequency: 0, starred: true, chapter: "呼吸道病毒",
      englishTitle: "antigenic drift", chineseTitle: "抗原性漂移", papers: [],
      examPoints: ["流感病毒HA、NA编码基因不断发生点突变，使抗原决定簇出现小幅、连续改变的现象。", "通常不产生新亚型，可造成季节性流行和疫苗株需要更新；甲、乙型流感均可发生。"],
      logic: ["drift：点突变、小变异、季节性流行；shift：重配、大变异、新亚型、大流行。"], keywords: ["点突变", "HA", "NA", "小变异", "季节性流行"],
      sources: [source("微生物学名词解释.pdf", "PDF p16", "原文带*")]
    },
    {
      id: "term-arbovirus", type: "term", tier: "supplement", frequency: 0, starred: true, chapter: "虫媒病毒",
      englishTitle: "arbovirus", chineseTitle: "虫媒病毒", papers: [],
      examPoints: ["通过吸血节肢动物叮咬在易感脊椎动物间传播的一大类病毒的生态学统称。", "节肢动物常兼为传播媒介和储存宿主，所致疾病多具有自然疫源性、地方性、季节性和人兽共患特点。"],
      logic: ["虫媒病毒不是单一分类学科；蚊、蜱等媒介与脊椎动物宿主共同维持自然循环。"], keywords: ["吸血节肢动物", "媒介", "自然疫源性", "季节性", "人兽共患"],
      sources: [source("微生物学名词解释.pdf", "PDF p18", "原文带*")]
    },
    {
      id: "term-negri-body", type: "term", tier: "supplement", frequency: 0, starred: true, chapter: "狂犬病毒",
      englishTitle: "Negri body", chineseTitle: "内基小体", papers: [],
      examPoints: ["狂犬病毒感染动物或人的中枢神经细胞后，在胞质内形成的圆形或椭圆形嗜酸性包涵体。", "常见于海马锥体细胞和小脑浦肯野细胞，含病毒核衣壳成分，具有诊断意义。"],
      logic: ["关键词：狂犬病—神经细胞胞质—嗜酸性包涵体。"], keywords: ["狂犬病毒", "神经细胞", "胞质", "嗜酸性包涵体", "诊断"],
      sources: [source("微生物学名词解释.pdf", "PDF p19", "原文带*")]
    },
    {
      id: "term-prion", type: "term", tier: "supplement", frequency: 0, starred: true, chapter: "朊粒",
      englishTitle: "prion", chineseTitle: "朊粒", papers: [],
      examPoints: ["由宿主基因编码的异常构象蛋白性传染因子，不含可检测核酸。", "可诱导正常朊蛋白发生构象转换并积聚，具有传染性和较强抵抗力，可引起人和动物传染性海绵状脑病。"],
      logic: ["本质是异常蛋白构象模板化转换，不以核酸复制方式增殖。"], keywords: ["不含核酸", "异常构象蛋白", "模板化转换", "海绵状脑病"],
      sources: [source("微生物学名词解释.pdf", "PDF p19", "原文带*")]
    }
  );

  terms.forEach((item) => { item.mustMemorize = true; });

  const shorts = [
    {
      id: "short-live-vs-inactivated-vaccine", type: "short", tier: "core", frequency: 3, chapter: "感染防治",
      title: "比较减毒活疫苗与灭活疫苗", papers: ["2023 预防/法医", "2022 口腔", "2022 临八"],
      examPoints: ["减毒活疫苗：病原体仍可有限增殖，接近自然感染；通常剂量小、次数少，可诱导体液、细胞及黏膜免疫，免疫持久。", "缺点：稳定性较差，存在毒力回复或污染风险，免疫缺陷者和孕妇一般禁用。", "灭活疫苗：病原体已失去增殖能力，安全、稳定，无毒力回复。", "缺点：免疫原性相对弱，以体液免疫为主，常需较大剂量、多次接种和加强，并常需佐剂。"],
      logic: ["核心比较轴：能否增殖—免疫类型—接种次数—安全性—保存。"], keywords: ["有限增殖", "细胞免疫", "黏膜免疫", "毒力回复", "多次加强"], sources: [source("微生物学大题一本通.pdf", "疫苗比较"), source("6-细菌感染的检测与防治-2026.pdf", "人工主动免疫"), source("17-病毒感染的检测和防治-2026.pdf", "疫苗")]
    },
    {
      id: "short-tb-lab-diagnosis", type: "short", tier: "core", frequency: 3, chapter: "分枝杆菌",
      title: "以结核分枝杆菌为例说明实验室检查流程", papers: ["2023 预防/法医", "2022 口腔", "2022 临八"],
      examPoints: ["标本：按病变部位采集晨痰、支气管灌洗液、尿、脑脊液或组织，注意多次送检。", "直接检查：标本消化浓缩后抗酸染色镜检；荧光染色可提高筛查效率。", "分离培养：接种罗氏培养基或液体培养系统，培养时间长；依据菌落、抗酸性及生化或分子方法鉴定。", "快速检测：核酸扩增可同时辅助检出结核分枝杆菌和部分耐药位点；培养仍是确诊和完整药敏的重要依据。", "免疫学检查：结核菌素或IGRA反映感染及细胞免疫，不能单独区分活动性与潜伏感染。"],
      logic: ["考试顺序：采标本 → 涂片 → 培养鉴定/药敏 → 核酸快速检测 → 免疫学辅助。"], keywords: ["晨痰", "抗酸染色", "罗氏培养基", "核酸", "药敏", "IGRA"], sources: [source("微生物学大题一本通.pdf", "结核检查"), source("12-分枝杆菌属-2026 (1).pdf", "微生物学检查")]
    },
    {
      id: "short-foodborne-bacteria", type: "short", tier: "core", frequency: 3, chapter: "肠道与厌氧菌",
      title: "列举不同菌属的食物中毒细菌及主要致病物质", papers: ["2023 预防/法医", "2022 口腔", "2022 临八"],
      examPoints: ["金黄色葡萄球菌：食物中预先形成的耐热肠毒素，起病急，以恶心、呕吐和腹痛为主。", "沙门菌：随食物进入肠道后侵袭肠黏膜并引起炎症，内毒素参与发热和全身反应。", "副溶血性弧菌：常与海产品有关，耐热直接溶血素TDH及相关毒素导致水样腹泻、腹痛。", "产气荚膜梭菌：大量活菌进入肠道后形成芽胞并释放肠毒素，引起腹泻和腹痛。", "也可答肉毒梭菌：食物中预先形成的肉毒神经毒素抑制乙酰胆碱释放，导致弛缓性麻痹。"],
      logic: ["按‘菌名—食物/方式—毒力因子—主要症状’作答；题目要求不同菌属时不要重复同属。"], keywords: ["葡萄球菌肠毒素", "沙门菌侵袭", "TDH", "产气荚膜梭菌肠毒素", "肉毒毒素"], sources: [source("微生物学大题一本通.pdf", "食物中毒"), source("8-肠杆菌科等-2026-renew (1).pdf", "肠道致病菌"), source("11-厌氧菌属-2026 (1).pdf", "梭菌")]
    },
    {
      id: "short-hsv-course", type: "short", tier: "core", frequency: 2, chapter: "疱疹病毒",
      title: "以HSV为例说明原发、潜伏和复发感染", papers: ["2022 预防", "2021 临八"],
      examPoints: ["原发感染：HSV由皮肤黏膜进入，在局部上皮细胞增殖，引起疱疹性龈口炎、生殖器疱疹等，也可无症状。", "潜伏感染：病毒沿感觉神经轴突逆行到感觉神经节，HSV-1多潜伏于三叉神经节，HSV-2多潜伏于骶神经节，以基因组形式长期存在。", "复发感染：发热、紫外线、精神压力、创伤或免疫抑制等诱因使病毒再激活，沿轴突顺行到原部位附近，引起口唇或生殖器复发疱疹。", "复发通常较原发局限，但患者可间歇排毒并传播。"],
      logic: ["局部复制 → 逆行入神经节潜伏 → 诱因再激活 → 顺行回皮肤黏膜。"], keywords: ["三叉神经节", "骶神经节", "逆行", "再激活", "复发"], sources: [source("微生物学大题一本通.pdf", "HSV"), source("疱疹病毒、人乳头瘤病毒.pdf", "HSV")]
    },
    {
      id: "short-endotoxin", type: "short", tier: "core", frequency: 2, chapter: "细菌感染与免疫",
      title: "内毒素的结构和作用特点", papers: ["2022 预防", "2021 临八"],
      examPoints: ["内毒素是革兰阴性菌外膜的脂多糖LPS，由脂质A、核心多糖和特异性O抗原组成；脂质A是主要毒性成分。", "细菌死亡裂解或外膜释放时释出，耐热，毒性较外毒素弱，作用无明显组织特异性。", "可通过TLR4等激活单核-巨噬细胞和补体，引起发热、白细胞变化、低血压、DIC和感染性休克。", "抗原性弱，不能经甲醛制成类毒素；不同革兰阴性菌内毒素效应大致相似。"],
      logic: ["LPS脂质A → 炎症介质失控 → 血管扩张/通透性增加＋凝血激活 → 休克与DIC。"], keywords: ["LPS", "脂质A", "TLR4", "发热", "DIC", "休克"], sources: [source("微生物学大题一本通.pdf", "内毒素"), source("5-细菌的感染与免疫-2026 (1).pdf", "内毒素")]
    },
    {
      id: "short-influenza-negative-rna", type: "short", tier: "core", frequency: 2, chapter: "呼吸道病毒",
      title: "以甲型流感病毒说明负链RNA病毒复制特点", papers: ["2022 预防", "2021 临八"],
      examPoints: ["病毒吸附、内吞和脱壳后，核糖核蛋白复合体进入细胞核；负链RNA不能直接作为mRNA，病毒颗粒必须携带RNA依赖的RNA聚合酶。", "聚合酶利用宿主mRNA帽结构进行cap-snatching，转录病毒mRNA并翻译早期和结构蛋白。", "复制时先以负链基因组为模板合成全长正链cRNA，再以cRNA为模板合成新的负链基因组。", "HA、NA和M2等膜蛋白经内质网和高尔基体加工并插入细胞膜；核糖核蛋白在膜下装配，出芽释放，NA促进子代病毒脱离。", "流感病毒在细胞核复制、基因组分节段，是其区别于多数RNA病毒的重要特点。"],
      logic: ["-RNA → mRNA用于翻译；-RNA → 全长+cRNA → -RNA用于复制。"], keywords: ["携带聚合酶", "细胞核", "cap-snatching", "cRNA", "出芽", "NA"], sources: [source("微生物学大题一本通.pdf", "负链RNA复制"), source("呼吸道感染的病毒(一) (1).pdf", "流感复制")]
    },
    {
      id: "short-viremia", type: "short", tier: "core", frequency: 2, chapter: "病毒致病性",
      title: "什么是病毒血症？举例并说明特点", papers: ["2022 口腔", "2022 临八"],
      examPoints: ["病毒血症是病毒从局部感染灶进入血液，并以游离病毒或与血细胞结合形式在体内播散的状态。", "原发病毒血症通常量少，病毒到达网状内皮系统等部位增殖；随后形成量更大的继发病毒血症，播散至靶器官并出现全身症状。", "可见于麻疹、水痘、脊髓灰质炎、乙型脑炎等；呼吸道或消化道侵入不等于疾病只局限于入口。", "血中病毒可诱导中和抗体等全身免疫，也使多个器官受累并可能发生母婴传播。"],
      logic: ["入口局部复制 → 原发病毒血症 → 网状内皮系统增殖 → 继发病毒血症 → 靶器官。"], keywords: ["血液播散", "原发", "继发", "靶器官", "麻疹", "水痘"], sources: [source("微生物学大题一本通.pdf", "病毒血症"), source("16-病毒的致病性和抗病毒免疫-2026.pdf", "播散")]
    },
    {
      id: "short-tetanus-vs-botulinum", type: "short", tier: "core", frequency: 2, chapter: "厌氧菌",
      title: "比较破伤风痉挛毒素与肉毒毒素", papers: ["2022 预防", "2021 临八"],
      examPoints: ["共同点：均为梭菌产生的A-B型锌内肽酶神经毒素，轻链裂解SNARE蛋白，阻断突触小泡递质释放。", "破伤风痉挛毒素：由伤口产生，经神经逆行到中枢，主要阻断抑制性中间神经元释放甘氨酸和GABA，导致牙关紧闭、角弓反张等痉挛性麻痹。", "肉毒毒素：多经食物、伤口或婴儿肠道进入，在外周胆碱能神经末梢阻断乙酰胆碱释放，导致对称性下降性弛缓性麻痹，可累及呼吸肌。", "防治均强调早期抗毒素/免疫球蛋白和支持治疗；破伤风另需清创和主动免疫，肉毒中毒需处理污染食物并维持呼吸。"],
      logic: ["破伤风：去掉‘刹车’→痉挛；肉毒：阻断运动终板‘油门’→弛缓。"], keywords: ["SNARE", "GABA", "甘氨酸", "乙酰胆碱", "痉挛性", "弛缓性"], sources: [source("微生物学大题一本通.pdf", "神经毒素比较"), source("11-厌氧菌属-2026 (1).pdf", "破伤风与肉毒")]
    },
    {
      id: "short-replica-plating", type: "short", tier: "past", frequency: 1, chapter: "细菌遗传变异",
      title: "影印培养试验及其意义", papers: ["2018 预防"],
      examPoints: ["先让细菌在无选择培养基形成母板菌落，再用无菌绒布按原位置把菌落同时转印到含和不含选择因素的培养基。", "比较对应位置可发现：耐药菌落在接触选择因素前已存在，选择因素只筛选原有突变体，并不定向诱导突变。"],
      logic: ["原位置对应是证据核心；先突变、后选择。"], keywords: ["母板", "绒布转印", "耐药突变", "选择"], sources: [source("4-细菌的遗传变异-2026 (1).pdf", "突变与选择；补一本通缺口")]
    },
    {
      id: "short-positive-vs-negative-rna", type: "short", tier: "past", frequency: 1, chapter: "病毒总论",
      title: "单正链与单负链RNA病毒生物合成的异同", papers: ["2018 预防"],
      examPoints: ["共同点：均需病毒RNA依赖的RNA聚合酶，以互补链为中间体复制基因组，并合成mRNA和病毒蛋白。", "正链RNA基因组可直接作为mRNA，入胞后先翻译产生聚合酶；通常裸RNA具有感染性。", "负链RNA不能直接翻译，病毒颗粒必须携带聚合酶，先转录mRNA；复制时先合成全长正链抗基因组。", "多数RNA病毒在胞质复制，但流感病毒等存在例外。"],
      logic: ["正链先翻译，负链先转录。"], keywords: ["RdRp", "正链mRNA", "负链携酶", "抗基因组"], sources: [source("14-病毒结构和增殖-2026(1) (1).pdf", "RNA病毒复制")]
    },
    {
      id: "short-aids-art", type: "short", tier: "past", frequency: 1, chapter: "逆转录病毒",
      title: "AIDS鸡尾酒疗法的方案构成", papers: ["2018 预防"],
      examPoints: ["联合抗逆转录病毒治疗（ART）同时使用作用于不同复制环节的多种药物，以最大限度抑制病毒、恢复免疫并减少耐药。", "常用初始方案为两种核苷/核苷酸类逆转录酶抑制剂作为骨架，联合一种整合酶抑制剂；也可依具体情况联合非核苷类逆转录酶抑制剂或增强型蛋白酶抑制剂。", "强调规律、长期服药，监测病毒载量、CD4细胞、毒性和耐药。"],
      logic: ["多靶点联合不是轮换用药；目标是持续病毒学抑制。"], keywords: ["ART", "两种NRTI", "整合酶抑制剂", "联合", "耐药"], sources: [source("逆转录病毒、朊粒.pdf", "HIV治疗"), source("微生物学大题一本通.pdf", "AIDS")]
    },
    {
      id: "short-toxemia", type: "short", tier: "past", frequency: 1, chapter: "细菌感染",
      title: "什么是毒血症？举例", papers: ["2023 预防/法医"],
      examPoints: ["毒血症是病原菌主要局限在局部病灶，不进入或很少进入血流，但其外毒素进入血液并引起全身中毒症状。", "例如白喉杆菌局部感染产生白喉毒素导致心肌和神经损伤；破伤风梭菌在伤口产生痉挛毒素导致全身痉挛。"],
      logic: ["菌留局部，毒素入血；区别于菌血症和败血症。"], keywords: ["局部病灶", "外毒素入血", "白喉", "破伤风"], sources: [source("5-细菌的感染与免疫-2026 (1).pdf", "全身感染类型")]
    },
    {
      id: "short-vzv", type: "short", tier: "past", frequency: 1, chapter: "疱疹病毒",
      title: "VZV的感染特点及防治原则", papers: ["2022 临五"],
      examPoints: ["VZV经呼吸道或接触传播，原发感染经病毒血症播散，引起水痘；之后潜伏于感觉神经节。", "免疫力下降时再激活，沿感觉神经到皮肤，形成沿单侧神经节段分布的带状疱疹，可有神经痛。", "预防包括水痘/带状疱疹疫苗、隔离患者和保护高危人群；治疗可早期使用阿昔洛韦类药物并处理疼痛，暴露后高危者可考虑特异免疫球蛋白。"],
      logic: ["原发水痘—神经节潜伏—复发带状疱疹。"], keywords: ["水痘", "感觉神经节", "带状疱疹", "疫苗", "阿昔洛韦"], sources: [source("疱疹病毒、人乳头瘤病毒.pdf", "VZV")]
    },
    {
      id: "short-hpv", type: "short", tier: "past", frequency: 1, chapter: "乳头瘤病毒",
      title: "HPV传播、危害及高价次疫苗意义", papers: ["2023 临五"],
      examPoints: ["主要经性接触和密切皮肤黏膜接触传播，也可发生母婴传播。", "低危型如6、11型主要引起生殖器疣；高危型如16、18型持续感染与宫颈癌及部分肛门、生殖器和口咽癌相关。", "高价次疫苗覆盖更多高危和低危型别，可扩大对癌前病变、癌症和生殖器疣的预防范围，但不能治疗既有感染，也不能替代宫颈癌筛查。"],
      logic: ["持续高危型感染—E6/E7干扰p53和Rb—细胞转化。"], keywords: ["性接触", "6/11", "16/18", "E6/E7", "高价疫苗", "筛查"], sources: [source("疱疹病毒、人乳头瘤病毒.pdf", "HPV")]
    },
    {
      id: "short-zoonoses", type: "short", tier: "past", frequency: 1, chapter: "动物源性细菌",
      title: "列举三种人畜共患病及所致疾病", papers: ["2023 临五"],
      examPoints: ["鼠疫耶尔森菌：啮齿动物为主要储存宿主，蚤叮咬传播，可致腺鼠疫、败血症型或肺鼠疫。", "布鲁菌：接触患畜或食用未消毒乳制品传播，引起波浪热和多系统损害。", "炭疽芽胞杆菌：接触病畜、动物制品或吸入芽胞，可致皮肤、胃肠或吸入性炭疽。", "也可答钩端螺旋体病、莱姆病等，但需写清病原、宿主/媒介和疾病。"],
      logic: ["按病原—动物宿主/媒介—传播—疾病作答。"], keywords: ["鼠疫", "布鲁菌", "炭疽", "人畜共患"], sources: [source("13-动物源性细菌、四体-2026 (1).pdf", "动物源性细菌")]
    }
  ];

  const cases = [
    {
      id: "case-shigella-eiec", type: "case", tier: "core", chapter: "肠杆菌科", title: "脓血便与里急后重：志贺菌和EIEC鉴别", sourcePage: "PDF p40",
      prompt: "埃及旅行后出现脓血便和里急后重。列出两种可能的致病菌，并说明如何鉴别。",
      examPoints: ["可能病原：志贺菌和肠侵袭性大肠埃希菌（EIEC）。", "二者均可侵袭结肠上皮并引起细菌性痢疾样表现，不能只凭症状或粪便镜检区分。", "鉴别应综合分离培养、生化反应、血清学和分子检测：志贺菌通常不发酵乳糖、无动力；EIEC多数也不运动且不发酵或迟缓发酵乳糖，因此动力和乳糖并非绝对可靠。", "可结合赖氨酸脱羧酶、醋酸盐利用等生化谱、O抗原血清型及检测侵袭相关基因（如ipaH）判定。"],
      logic: ["资料原答案把EIEC写成乳糖发酵阳性、动力阳性，容易误导；按教材口径作答时要强调两者高度相似和综合鉴别。"], keywords: ["志贺菌", "EIEC", "脓血便", "里急后重", "ipaH", "鉴别"], sources: [source("微生物学大题一本通.pdf", "PDF p40", "原题；鉴别答案已按教材校正"), source("8-肠杆菌科等-2026-renew (1).pdf", "志贺菌/EIEC")]
    },
    {
      id: "case-post-strep-gn", type: "case", tier: "core", chapter: "球菌", title: "猩红热后肾小球肾炎与抗O试验", sourcePage: "PDF p40",
      prompt: "患者猩红热后发生肾小球肾炎。说明诊断、发病机制和抗链球菌溶血素O试验原理。",
      examPoints: ["诊断：A群链球菌感染后急性肾小球肾炎。", "机制：肾炎相关链球菌抗原与抗体形成免疫复合物并在肾小球沉积，激活补体和炎症反应，造成肾小球损伤，属于III型超敏反应。", "ASO原理：检测患者血清中针对链球菌溶血素O的抗体。经典中和试验中，抗体中和SLO后红细胞不溶血；现代也可用免疫学方法定量。", "ASO升高提示近期A群链球菌感染，应结合临床及动态效价，不能单独确诊肾炎。"],
      logic: ["M蛋白与心肌交叉反应更典型地用于解释风湿热；感染后肾炎重点写免疫复合物沉积。"], keywords: ["A群链球菌", "免疫复合物", "III型超敏反应", "ASO", "SLO"], sources: [source("微生物学大题一本通.pdf", "PDF p40", "原题；肾炎机制已校正"), source("7-球菌-2026 (1).pdf", "链球菌感染后疾病")]
    },
    {
      id: "case-cholera", type: "case", tier: "core", chapter: "弧菌属", title: "东南亚旅行后严重水样腹泻：霍乱", sourcePage: "PDF p40-41",
      prompt: "东南亚旅行后严重腹泻，病原提示为弧菌。回答诊断、致病机制、传播途径、实验室诊断和防治。",
      examPoints: ["诊断：O1群或O139群霍乱弧菌引起的霍乱。", "机制：细菌经口到达小肠，鞭毛运动和毒素共调菌毛等参与定植；霍乱肠毒素B亚单位结合GM1，A亚单位使Gsα持续活化，腺苷酸环化酶活性升高，cAMP增加，导致氯离子和水大量分泌，形成米泔水样便；不侵入肠黏膜、不入血。", "传播：粪-口传播，主要经污染水和食物，也可由患者或无症状携带者传播。", "检查：及时采集新鲜粪便；悬滴或暗视野可见穿梭样运动；碱性蛋白胨水增菌、TCBS分离，结合生化、血清凝集及核酸检测确证。", "防治：隔离报告、饮水食品卫生和必要时疫苗；治疗第一位是迅速足量补液和纠正电解质，抗菌药物可缩短病程和排菌期。"],
      logic: ["定植小肠—CT进入细胞—Gsα锁定—cAMP升高—水电解质分泌；答题必须把补液写在抗菌药前。"], keywords: ["O1/O139", "GM1", "Gsα", "cAMP", "米泔水样便", "TCBS", "补液"], sources: [source("微生物学大题一本通.pdf", "PDF p40-41"), source("9-弧菌属-2026 (1).pdf", "霍乱弧菌")]
    },
    {
      id: "case-h-pylori", type: "case", tier: "core", chapter: "幽门螺杆菌", title: "快速尿素酶阳性的胃窦炎症", sourcePage: "PDF p41",
      prompt: "长期胃部不适，胃镜示幽门处多发炎性病灶，快速尿素酶试验阳性。判断病原、试验原理和致病机制。",
      examPoints: ["病原：幽门螺杆菌。", "快速尿素酶试验：组织中的细菌尿素酶分解尿素产生氨，使pH升高并导致指示剂变色。", "鞭毛和螺旋形态帮助穿过黏液层，黏附素促进定植；尿素酶产生氨缓冲局部胃酸。", "VacA造成上皮细胞空泡和屏障损伤；CagA及其诱导的炎症反应与溃疡、萎缩、肠化生和胃癌风险相关。"],
      logic: ["运动穿黏液—尿素酶抗酸—黏附定植—毒素和炎症损伤。"], keywords: ["尿素酶", "氨", "VacA", "CagA", "胃癌"], sources: [source("微生物学大题一本通.pdf", "PDF p41"), source("10-幽门螺杆菌-2026 (1).pdf", "致病与检测")]
    },
    {
      id: "case-measles", type: "case", tier: "core", chapter: "呼吸道病毒", title: "麻疹发病回升、VZV与MMR", sourcePage: "PDF p41-42",
      prompt: "麻疹发病率回升。回答麻疹病毒核酸类型、相似经呼吸道传播并发生病毒血症的疱疹病毒、典型体征、MMR组成及发病回升原因。",
      examPoints: ["麻疹病毒基因组为不分节段单股负链RNA。", "可比较VZV：经呼吸道进入并发生病毒血症；原发感染为水痘，潜伏后再激活为带状疱疹。", "典型表现：发热、咳嗽、流涕、结膜炎、口腔Koplik斑，随后出现自头面向躯干和四肢扩展的斑丘疹。", "MMR包括麻疹、腮腺炎和风疹减毒活疫苗。", "回升原因包括疫苗覆盖不足或延迟、易感人群积累、人员流动和输入病例、疫苗犹豫，以及疫情期间常规免疫中断等。"],
      logic: ["高传染性＋覆盖缺口＋易感者聚集，是疫苗可预防疾病仍反弹的核心。"], keywords: ["-ssRNA", "Koplik斑", "VZV", "MMR", "疫苗覆盖"], sources: [source("微生物学大题一本通.pdf", "PDF p41-42"), source("呼吸道感染的病毒(一) (1).pdf", "麻疹")]
    },
    {
      id: "case-hbv-big-three", type: "case", tier: "core", chapter: "肝炎病毒", title: "HBV大三阳与核酸特点", sourcePage: "PDF p42-43",
      prompt: "患者有急性肝炎表现，HBsAg、HBeAg和抗HBc阳性。判断俗称阶段，解释阳性指标并说明HBV核酸特点。",
      examPoints: ["血清模式俗称‘大三阳’：HBsAg、HBeAg、抗HBc阳性。", "HBsAg提示当前存在HBV感染；HBeAg通常提示病毒复制活跃、传染性较强；抗HBc提示既往或当前自然感染，IgM抗HBc更支持近期急性感染或急性发作。", "HBV基因组为部分双链、松弛环状DNA：负链较完整，正链不完整。", "复制经前基因组RNA中间体并发生逆转录；rcDNA入核修复成稳定cccDNA，后者是持续转录和复发的重要基础。", "仅凭大三阳不能区分急性与慢性，需结合病程、IgM抗HBc、HBV DNA和肝功能。"],
      logic: ["表面抗原看感染、e抗原看复制、核心抗体看自然感染；再补rcDNA—cccDNA—pgRNA逆转录。"], keywords: ["大三阳", "HBsAg", "HBeAg", "抗HBc IgM", "rcDNA", "cccDNA"], sources: [source("微生物学大题一本通.pdf", "PDF p42-43"), source("肝炎病毒.pdf", "HBV")]
    },
    {
      id: "case-acute-hbv-injection", type: "case", tier: "past", chapter: "肝炎病毒", title: "共用注射器后的急性乙型肝炎", sourcePage: "PDF p43",
      prompt: "共用注射器后出现黄疸和肝功能损伤，HBsAg、HBeAg、抗HBc阳性。给出初步诊断、进一步检查和处理原则。",
      examPoints: ["初步考虑急性乙型肝炎，但应检测IgM抗HBc并结合既往HBsAg史，排除慢性HBV急性发作。", "进一步检查：HBV DNA定量、完整乙肝血清学、肝功能和凝血功能；筛查HIV、HCV和HDV等共同暴露感染。", "处理：评估是否重症，给予休息、营养和对症支持；急性重型、迁延或特殊高危患者按临床指南考虑抗病毒治疗。", "进行传染源管理和血液/性传播防护，密切接触者检测并接种疫苗。"],
      logic: ["高危血液暴露＋急性肝炎；诊断关键是IgM抗HBc和病程，处理关键是严重程度。"], keywords: ["共用注射器", "急性乙肝", "IgM抗HBc", "HBV DNA", "HIV/HCV/HDV"], sources: [source("微生物学大题一本通.pdf", "PDF p43"), source("肝炎病毒.pdf", "HBV诊断")]
    },
    {
      id: "case-hbv-family-hdv", type: "case", tier: "core", chapter: "肝炎病毒", title: "HBV家庭血清学、妻子防护与HDV", sourcePage: "PDF p43-44",
      prompt: "慢性活动性乙肝患者大三阳，妻子五项全阴，儿子仅抗HBs阳性；两年后肝损伤再次加重。解释检查、传播、防护和可能的合并感染。",
      examPoints: ["常规评估：肝功能、乙肝五项、HBV DNA定量，必要时影像、凝血和肝纤维化评估。", "患者大三阳提示当前感染且复制较活跃；妻子五项全阴，既未感染也无保护性抗体；儿子仅抗HBs阳性符合疫苗免疫。", "HBV主要经血液、性接触和母婴传播。妻子应尽快全程接种乙肝疫苗并复查抗HBs，产生保护前规范使用安全套；避免共用剃须刀、牙刷等可能接触血液的物品。", "再次严重肝损伤应考虑HDV重叠感染或其他原因；HDV为缺陷病毒，需HBsAg帮助装配，传播途径与HBV相似。"],
      logic: ["五项判读＋三条传播途径＋妻子主动免疫＋HDV依赖HBsAg。"], keywords: ["大三阳", "五项全阴", "仅抗HBs", "疫苗", "HDV", "缺陷病毒"], sources: [source("微生物学大题一本通.pdf", "PDF p43-44", "家属防护表述已校正"), source("肝炎病毒.pdf", "HBV/HDV")]
    },
    {
      id: "case-dengue-zika", type: "case", tier: "core", chapter: "虫媒病毒", title: "登革、寨卡、ADE与虫媒病毒防控", sourcePage: "PDF p44-45",
      prompt: "东南亚旅行者检出最常见虫媒病毒和可致新生儿小头畸形的病毒。回答病原、媒介、登革再感染重症机制、其他虫媒病毒及防控。",
      examPoints: ["病毒A为登革病毒，病毒B为寨卡病毒；二者主要由伊蚊传播。", "异型登革病毒再次感染时，原有非中和或低水平交叉抗体通过Fc受体促进病毒进入单核-巨噬细胞，形成抗体依赖的感染增强（ADE），增加重症登革、出血和休克风险。", "其他举例：乙型脑炎病毒—流行性乙型脑炎；西尼罗病毒—西尼罗热/脑炎；基孔肯雅病毒—基孔肯雅热。", "防控以媒介监测、防蚊灭蚊、清除孳生地、个人防叮咬和病例监测为主；疫苗使用应按当地适应证和既往感染状态执行。"],
      logic: ["登革异型再感染—非中和抗体—Fc受体—感染增强—血管通透性和重症。"], keywords: ["登革", "寨卡", "伊蚊", "ADE", "重症登革", "防蚊"], sources: [source("微生物学大题一本通.pdf", "PDF p44-45"), source("虫媒病毒、出血热病毒、狂犬病毒等.pdf", "登革与寨卡")]
    },
    {
      id: "case-hantavirus", type: "case", tier: "past", chapter: "出血热病毒", title: "Andes汉坦病毒邮轮聚集性病例", sourcePage: "PDF p45-46",
      prompt: "邮轮出现Andes汉坦病毒聚集性感染。回答基因组、其他分节段病毒、宿主和传播、所致疾病及防治。",
      examPoints: ["汉坦病毒基因组为三节段单股负链RNA；流感病毒和轮状病毒也具有分节段基因组。", "主要自然宿主为啮齿动物；人多因吸入被鼠排泄物污染的气溶胶，也可经消化道、破损皮肤黏膜或咬伤感染。Andes病毒存在有限的人际传播报道。", "可致肾综合征出血热（HFRS）和汉坦病毒肺综合征（HPS）。", "预防以防鼠灭鼠、通风湿式清洁、避免扬尘和个人防护为主；部分地区有针对HFRS的疫苗。", "治疗主要为早期识别、严密监护、液体管理和器官支持；避免简单写成大量补液。"],
      logic: ["啮齿动物—污染气溶胶—毛细血管损伤—肾或肺综合征。"], keywords: ["分节段-ssRNA", "啮齿动物", "气溶胶", "HFRS", "HPS"], sources: [source("微生物学大题一本通.pdf", "PDF p45-46"), source("虫媒病毒、出血热病毒、狂犬病毒等.pdf", "汉坦病毒")]
    },
    {
      id: "case-rabies-pep-failure", type: "case", tier: "past", chapter: "狂犬病毒", title: "头颈部重度咬伤后狂犬病暴露处置", sourcePage: "PDF p46",
      prompt: "3岁儿童头颈部被流浪犬重度咬伤，已接种疫苗和免疫球蛋白但18天后死亡。分析失败原因并说明综合防治原则。",
      examPoints: ["失败风险：头颈部距中枢近、伤口深且多、病毒接种量大，潜伏期极短；疫苗诱导主动抗体需要时间；若伤口冲洗不充分、RIG未尽可能浸润全部伤口或剂量/程序不规范，保护可能不足。", "暴露后立即用大量流动水和肥皂水充分冲洗伤口至少约15分钟，再使用合适消毒剂；不应依赖挤压伤口。", "III级暴露在规范接种疫苗基础上，应将足量狂犬病免疫球蛋白尽可能浸润注射于所有伤口周围和深部。", "尽快按程序全程接种疫苗；必要时处理破伤风和细菌感染风险。", "狂犬病一旦出现临床症状几乎致死，重点是犬类免疫、暴露前预防和规范暴露后处置。"],
      logic: ["冲洗＋RIG局部浸润＋全程疫苗三者缺一不可；头颈部重伤必须争分夺秒。"], keywords: ["头颈部", "15分钟冲洗", "RIG浸润", "疫苗", "III级暴露"], sources: [source("微生物学大题一本通.pdf", "PDF p46", "伤口处理已按规范校正"), source("虫媒病毒、出血热病毒、狂犬病毒等.pdf", "狂犬病")]
    }
  ];

  const fullCasePrompts = {
    "case-shigella-eiec": `Case 1: A woman traveled to Egypt. After returning home, she had stool mixed with pus and blood, accompanied by tenesmus.

1. List two possible pathogenic bacteria that cause this disease.
2. Write down the methods to tell these two bacteria apart.`,
    "case-post-strep-gn": `Case 2: A patient develops glomerulonephritis after scarlet fever. Answer the following questions.

1. State the diagnosis.
2. Explain its disease mechanism.
3. Describe the principle of anti-streptolysin O test (ASO test).`,
    "case-cholera": `Case 3: A traveler came back from Southeast Asia and suffered from serious diarrhea. The pathogen is vibrio. Answer the five questions below.

1. What is the clinical diagnosis?
2. Explain its infection mechanism.
3. List its transmission routes.
4. Describe laboratory diagnosis methods.
5. State the prevention and treatment principles.`,
    "case-h-pylori": `Case 4: A patient has felt uncomfortable in the stomach for months. The gastroscopy finds multiple inflammatory lesions at the pylorus, and the rapid urea test shows a positive result. Please answer the questions below.

1. What pathogen causes this infection?
2. State the principle of the rapid urea test.
3. Explain its pathogenic mechanism.`,
    "case-measles": `Case 5: In recent years, the incidence of measles has witnessed a noticeable rise. Answer the following questions based on your knowledge of this disease.

1. What type of genetic material does the measles virus have?
2. Find one virus in the herpes family. It spreads through breathing, causes viremia and brings whole-body symptoms, just like measles. Write down this virus and its common signs.
3. List the typical body signs when a patient with measles has a fever.
4. Besides measles virus, what are the other two viruses in the triple vaccine?
5. Vaccines can stop measles. Why do more people get this disease now?`,
    "case-hbv-big-three": `Case 6：患者刘某，男，35岁，以“纳差、恶心、呕吐、尿黄10天”为主诉入院。10天前无明显诱因出现纳差，饮食量减少约1/2，恶心，呕吐2次，尿黄，尿液呈淡茶水样。

检查乙肝五项示：HBsAg（+）、HBsAb（-）、HBeAg（+）、HBeAb（-）、HBcAb（+）。

肝功能示：TBIL 48.2 μmol/L（正常参考值3.4～17.1 μmol/L）、DBIL 31.1 μmol/L（正常参考值1.7～10.2 μmol/L）、ALT 1079 U/L（参考值5～40 U/L）、AST 972 U/L（参考值8～40 U/L）。

入院查体：T 36.4℃，HR 56次/分，R 18次/分，BP 108/61 mmHg。神志清，精神差，肝病面容，全身皮肤黏膜轻度黄染，未见肝掌、蜘蛛痣，巩膜轻度黄染，咽部黏膜无红肿，双侧扁桃体无肿大。听诊心肺正常，腹平软，无压痛、反跳痛，肝脾肋下未触及，肝区无叩击痛，移动性浊音阴性，双下肢无水肿，病理征阴性。

结合病人的症状，请回答以下问题（12分）：
1. 按照乙肝五项的检查结果，该病人目前处于临床俗称的哪个阶段？
2. 请描述此病例中乙肝三项阳性指标的临床意义。
3. 请简单描述此病例所感染病原体的核酸特点。`,
    "case-acute-hbv-injection": `Case 7：患者男性，32岁，因食欲下降、乏力、尿黄、肝区疼痛两周而就诊。患者一月前曾参加“同志哥”聚会并与他人共用注射器。

检查发现：T 37.8℃，巩膜、皮肤黄染，心肺正常，肝肋下3～4 cm，有压痛，脾脏肋下可及。血常规正常。总胆红素100 μmol/L（正常5～17 μmol/L），血ALT 500 U，AST 400 U，AFP 10 ng/dl（正常＜20 ng/ml）。HBsAg（+）、HBeAg（+）、HBcAb（+）、抗HCV IgM（-）。

1. 你的初步诊断是什么？
2. 下一步做何检查？
3. 对该病人的处理原则是什么？`,
    "case-hbv-family-hdv": `Case 8：一名男性确诊慢性活动性乙型肝炎，对他、妻子、儿子检测乙肝血清标志物：

男子：HBsAg（+）、HBeAg（+）、HBcAb（+），HBsAb（-）、HBeAb（-）。
妻子：乙肝五项全部阴性。
儿子：仅HBsAb阳性，其余均为阴性。

该男子经治疗病情好转，两年后肝脏损伤再次加重。请作答：
1. 诊断乙肝需要做哪些常规检查？
2. 写出乙肝五项包含哪五项，分别解读男子、妻子、儿子的检验结果。
3. 乙型肝炎病毒有哪些传播途径？妻子属于易感人群，如何避免被传染？
4. 患者病情好转两年后再次出现严重肝损伤，高度怀疑合并哪种病毒感染？该病毒的传播途径是什么？`,
    "case-dengue-zika": `Case 9: A traveler returned from Southeast Asia. His armpit temperature was 38.2°C when examined at Guangzhou Baiyun Airport. Further viral tests identified Virus A and Virus B. Answer all questions below.

1. Virus A is the most common arbovirus. Which one is it?
Options: Hantavirus / Dengue virus / Crimean-Congo hemorrhagic fever virus / West Nile virus / Zika virus / Chikungunya virus

2. Virus B can cause microcephaly in newborns. Which one is it?
Options: Hantavirus / Dengue virus / Crimean-Congo hemorrhagic fever virus / West Nile virus / Zika virus / Chikungunya virus

3. Both Virus A and Virus B are transmitted by insect bites. What is the vector?
Options: Mosquito / Louse / Tick

4. Secondary infection with Virus A may trigger a severe disease. Name this disease and explain why reinfection leads to more serious symptoms.

5. List three other arboviruses and the illnesses they cause. Briefly describe general prevention measures for arboviruses.`,
    "case-hantavirus": `Case 10: In April 2026, an expedition cruise ship departed from Ushuaia, Argentina. Five days after sailing, a 70-year-old Dutch passenger suffered fever, headache and diarrhea, and died of severe breathing distress rapidly. Later, 12 more related cases emerged on the ship, with a total of 13 infected people and three deaths. WHO identified the pathogen as Andes virus, a subtype of hantavirus. Answer all questions below.

1. What is the type of hantavirus genome?
A. dsDNA
B. ssDNA
C. segmented (-) ssRNA
D. non-segmented (+) ssRNA

2. Which group of viruses also own segmented nucleic acid, similar to hantavirus?
A. Influenza virus, rotavirus
B. Poliovirus, rabies virus
C. Herpes virus, poxvirus
D. HIV, HCV

3. What is the main natural host of hantavirus? List its main transmission routes.
4. Name two diseases caused by hantavirus.
5. Briefly describe the prevention and treatment principles of hantavirus infection.`,
    "case-rabies-pep-failure": `Case 11: A widely discussed online case: a 3-year-old boy was severely bitten on his head and neck by a stray dog. He received rabies vaccine and rabies immunoglobulin right after injury, but died of rabies only 18 days later before finishing all vaccine shots. Answer the two questions below:

1. Analyze the key reasons why the child still suffered from rabies after vaccination.
2. State the comprehensive prevention and treatment principles for rabies.`
  };

  const casePromptTranslations = {
    "case-shigella-eiec": `病例1：一名女性曾前往埃及旅行。回国后出现脓血便，并伴有里急后重。

1. 列出两种可能引起该病的致病菌。
2. 写出鉴别这两种细菌的方法。`,
    "case-post-strep-gn": `病例2：一名患者在患猩红热后出现肾小球肾炎。请回答以下问题：

1. 写出诊断。
2. 解释其发病机制。
3. 说明抗链球菌溶血素O试验（ASO试验）的原理。`,
    "case-cholera": `病例3：一名旅行者从东南亚返回后出现严重腹泻，病原体提示为弧菌。请回答以下五个问题：

1. 临床诊断是什么？
2. 解释其感染机制。
3. 列出其传播途径。
4. 描述实验室诊断方法。
5. 说明防治原则。`,
    "case-h-pylori": `病例4：一名患者数月来一直感到胃部不适。胃镜检查发现幽门部有多处炎性病灶，快速尿素酶试验结果为阳性。请回答以下问题：

1. 引起该感染的病原体是什么？
2. 说明快速尿素酶试验的原理。
3. 解释该病原体的致病机制。`,
    "case-measles": `病例5：近年来，麻疹发病率明显上升。请根据你对该病的认识回答以下问题：

1. 麻疹病毒的遗传物质属于什么类型？
2. 在疱疹病毒科中找出一种与麻疹相似、可经呼吸道传播并引起病毒血症和全身症状的病毒，写出该病毒及其常见临床表现。
3. 列出麻疹患者发热时的典型体征。
4. 三联疫苗除麻疹病毒外还包括哪两种病毒？
5. 疫苗能够预防麻疹，为什么现在麻疹患者反而增多？`,
    "case-dengue-zika": `病例9：一名旅行者从东南亚返回。在广州白云机场接受检查时，其腋温为38.2℃。进一步病毒学检查检出病毒A和病毒B。请回答以下所有问题：

1. 病毒A是最常见的虫媒病毒，它是哪一种？
选项：汉坦病毒／登革病毒／克里米亚-刚果出血热病毒／西尼罗病毒／寨卡病毒／基孔肯雅病毒

2. 病毒B可导致新生儿小头畸形，它是哪一种？
选项：汉坦病毒／登革病毒／克里米亚-刚果出血热病毒／西尼罗病毒／寨卡病毒／基孔肯雅病毒

3. 病毒A和病毒B均可通过昆虫叮咬传播，其传播媒介是什么？
选项：蚊／虱／蜱

4. 再次感染病毒A可能引起重症。写出该疾病名称，并解释为什么再次感染时症状会更加严重。
5. 再列举三种虫媒病毒及其所致疾病，并简述虫媒病毒的一般预防措施。`,
    "case-hantavirus": `病例10：2026年4月，一艘探险邮轮从阿根廷乌斯怀亚出发。启航5天后，一名70岁的荷兰乘客出现发热、头痛和腹泻，并迅速因严重呼吸窘迫死亡。此后船上又出现12例相关病例，共有13人感染、3人死亡。世界卫生组织确认病原体为安第斯病毒，它是汉坦病毒的一种亚型。请回答以下所有问题：

1. 汉坦病毒的基因组类型是什么？
A. 双链DNA
B. 单链DNA
C. 分节段负链单链RNA
D. 不分节段正链单链RNA

2. 下列哪组病毒也像汉坦病毒一样具有分节段核酸？
A. 流感病毒、轮状病毒
B. 脊髓灰质炎病毒、狂犬病病毒
C. 疱疹病毒、痘病毒
D. HIV、HCV

3. 汉坦病毒的主要自然宿主是什么？列出其主要传播途径。
4. 写出汉坦病毒引起的两种疾病。
5. 简述汉坦病毒感染的防治原则。`,
    "case-rabies-pep-failure": `病例11：一则在网络上引发广泛讨论的病例：一名3岁男童头颈部被流浪犬严重咬伤。受伤后立即接种了狂犬病疫苗并注射狂犬病免疫球蛋白，但在尚未完成全部疫苗接种程序时，仅18天后便因狂犬病死亡。请回答以下两个问题：

1. 分析患儿接种疫苗后仍发生狂犬病的主要原因。
2. 说明狂犬病的综合防治原则。`
  };

  cases.forEach((item) => {
    item.summaryPrompt = item.prompt;
    item.prompt = fullCasePrompts[item.id] || item.prompt;
    item.promptZh = casePromptTranslations[item.id] || "";
    item.questionComplete = Boolean(fullCasePrompts[item.id]);
  });

  const choices = [
    { id: "choice-teichoic-acid", type: "choice", tier: "core", chapter: "细菌形态结构", mode: "single", prompt: "革兰阳性菌细胞壁特有的成分是：", options: [option("A", "肽聚糖"), option("B", "磷壁酸"), option("C", "脂多糖"), option("D", "脂蛋白")], answer: ["B"], explanation: "肽聚糖两类细菌均有；磷壁酸为革兰阳性菌特有。", sourceLabel: "2023 临五 A1" },
    { id: "choice-sterilization-spore", type: "choice", tier: "core", chapter: "细菌生理", mode: "single", prompt: "评价灭菌是否彻底，通常以能否杀灭哪种结构为标准？", options: [option("A", "荚膜"), option("B", "鞭毛"), option("C", "芽胞"), option("D", "菌毛")], answer: ["C"], explanation: "芽胞抵抗力强，能杀灭芽胞通常认为达到灭菌。", sourceLabel: "2023 临五 A1" },
    { id: "choice-binary-fission", type: "choice", tier: "high", chapter: "细菌生理", mode: "single", prompt: "细菌最主要的繁殖方式是：", options: [option("A", "有丝分裂"), option("B", "二分裂"), option("C", "出芽"), option("D", "孢子生殖")], answer: ["B"], explanation: "细菌以无性二分裂为主要繁殖方式；芽胞不是繁殖结构。", sourceLabel: "2023 临五 A1" },
    { id: "choice-fecal-oral-hev", type: "choice", tier: "core", chapter: "肝炎病毒", mode: "single", prompt: "下列病原体中主要经粪-口途径传播的是：", options: [option("A", "HIV"), option("B", "HBV"), option("C", "HCV"), option("D", "HEV"), option("E", "HCMV")], answer: ["D"], explanation: "HAV和HEV主要经粪-口传播。", sourceLabel: "2023 临五 A1" },
    { id: "choice-loeffler", type: "choice", tier: "high", chapter: "其他致病菌", mode: "single", prompt: "吕氏血清培养基主要用于培养：", options: [option("A", "鼠疫耶尔森菌"), option("B", "白喉棒状杆菌"), option("C", "结核分枝杆菌"), option("D", "流感嗜血杆菌")], answer: ["B"], explanation: "吕氏血清培养基可促进白喉棒状杆菌生长和异染颗粒形成。", sourceLabel: "2023 临五 A1" },
    { id: "choice-seafood-vibrio", type: "choice", tier: "core", chapter: "弧菌属", mode: "single", prompt: "食用未充分加热的海产品后出现急性胃肠炎，最应考虑：", options: [option("A", "副溶血性弧菌"), option("B", "流感嗜血杆菌"), option("C", "白喉棒状杆菌"), option("D", "结核分枝杆菌")], answer: ["A"], explanation: "副溶血性弧菌嗜盐，常污染海产品。", sourceLabel: "2023 临五 A1" },
    { id: "choice-sspe", type: "choice", tier: "core", chapter: "呼吸道病毒", mode: "single", prompt: "亚急性硬化性全脑炎（SSPE）与哪种病毒持续感染有关？", options: [option("A", "麻疹病毒"), option("B", "腮腺炎病毒"), option("C", "流感病毒"), option("D", "狂犬病毒")], answer: ["A"], explanation: "SSPE是麻疹病毒感染后少见的慢发性中枢神经系统并发症。", sourceLabel: "2022 临五/2023 临五" },
    { id: "choice-stormy-organism", type: "choice", tier: "core", chapter: "厌氧菌", mode: "single", prompt: "在牛乳培养基中出现汹涌发酵现象的细菌是：", options: [option("A", "破伤风梭菌"), option("B", "肉毒梭菌"), option("C", "产气荚膜梭菌"), option("D", "艰难梭菌")], answer: ["C"], explanation: "产气荚膜梭菌分解乳糖，产酸凝乳并大量产气冲碎凝块。", sourceLabel: "2023 临五 A1" },
    { id: "choice-rubella-fetus", type: "choice", tier: "core", chapter: "呼吸道病毒", mode: "single", prompt: "孕妇早期感染后最典型地可导致胎儿先天畸形的是：", options: [option("A", "风疹病毒"), option("B", "鼻病毒"), option("C", "轮状病毒"), option("D", "诺如病毒")], answer: ["A"], explanation: "孕早期风疹可导致先天性风疹综合征。", sourceLabel: "2023 临五 A1" },
    { id: "choice-infectious-rna", type: "choice", tier: "core", chapter: "病毒总论", mode: "single", prompt: "通常情况下，纯化后单独导入易感细胞即可启动复制的病毒核酸是：", options: [option("A", "+ssRNA"), option("B", "-ssRNA"), option("C", "dsRNA"), option("D", "逆转录病毒RNA")], answer: ["A"], explanation: "+ssRNA可直接作为mRNA；-ssRNA和dsRNA需要病毒颗粒携带聚合酶。", sourceLabel: "2023 临五/2018 预防" },
    { id: "choice-hbv-rt", type: "choice", tier: "core", chapter: "肝炎病毒", mode: "single", prompt: "下列病毒中，病毒颗粒内含逆转录酶并经RNA中间体复制的是：", options: [option("A", "HAV"), option("B", "HBV"), option("C", "HCV"), option("D", "HDV")], answer: ["B"], explanation: "HBV虽为DNA病毒，但复制经过前基因组RNA逆转录。", sourceLabel: "2023 临五 A1" },
    { id: "choice-outer-membrane", type: "choice", tier: "core", chapter: "细菌形态结构", mode: "multiple", prompt: "革兰阴性菌外膜的组成包括：", options: [option("A", "脂多糖"), option("B", "脂蛋白"), option("C", "脂质双层"), option("D", "周浆间隙"), option("E", "膜磷壁酸")], answer: ["A", "B", "C"], explanation: "周浆间隙是内、外膜之间的空间，不是外膜本身；磷壁酸属于革兰阳性菌。", sourceLabel: "2018 预防 X1" },
    { id: "choice-nucleoid-errors", type: "choice", tier: "high", chapter: "细菌形态结构", mode: "multiple", prompt: "关于细菌核质，错误的是：", options: [option("A", "典型情况下为单倍体"), option("B", "都是二倍体"), option("C", "无核膜包裹"), option("D", "全部为环状DNA"), option("E", "也称拟线粒体")], answer: ["B", "D", "E"], explanation: "细菌典型为单倍体且无核膜，但并非全部染色体均为环状；核质不是拟线粒体。", sourceLabel: "2018 预防 X2" },
    { id: "choice-virus-cell-outcomes", type: "choice", tier: "core", chapter: "病毒致病性", mode: "multiple", prompt: "病毒感染易感细胞后可能出现：", options: [option("A", "细胞死亡"), option("B", "细胞膜出现新抗原"), option("C", "形成包涵体"), option("D", "细胞转化"), option("E", "细胞融合")], answer: ["A", "B", "C", "D", "E"], explanation: "均可见于不同病毒感染，是病毒感染细胞的常见结局或表现。", sourceLabel: "2018 预防 X3" },
    { id: "choice-segmented-rna", type: "choice", tier: "core", chapter: "病毒总论", mode: "multiple", prompt: "基因组为分节段RNA的病毒包括：", options: [option("A", "流感病毒"), option("B", "轮状病毒"), option("C", "登革病毒"), option("D", "汉坦病毒"), option("E", "狂犬病毒")], answer: ["A", "B", "D"], explanation: "流感病毒、轮状病毒和汉坦病毒基因组分节段；登革和狂犬不分节段。", sourceLabel: "2018 预防 X4" },
    { id: "choice-early-protein-error", type: "choice", tier: "high", chapter: "病毒总论", mode: "single", prompt: "关于病毒早期蛋白，错误的是：", options: [option("A", "通常是病毒结构蛋白"), option("B", "在子代核酸复制前合成"), option("C", "可调节或抑制宿主代谢"), option("D", "可为核酸复制提供酶")], answer: ["A"], explanation: "早期蛋白通常为非结构性调控蛋白或复制酶；结构蛋白多属晚期蛋白。", sourceLabel: "2018 预防 X5" },
    { id: "choice-lactose-fermenters", type: "choice", tier: "core", chapter: "肠杆菌科", mode: "multiple", prompt: "能发酵乳糖产酸产气的是：", options: [option("A", "伤寒沙门菌"), option("B", "痢疾志贺菌"), option("C", "大肠埃希菌"), option("D", "变形杆菌"), option("E", "肺炎克雷伯菌")], answer: ["C", "E"], explanation: "大肠埃希菌和克雷伯菌是典型乳糖发酵菌。", sourceLabel: "2018 预防 X7" },
    { id: "choice-antibiotic-mechanisms", type: "choice", tier: "core", chapter: "抗菌药物", mode: "multiple", prompt: "抗菌药物的主要作用机制包括：", options: [option("A", "影响核酸代谢"), option("B", "干扰细胞壁合成"), option("C", "抑制蛋白质合成"), option("D", "损伤细胞膜"), option("E", "阻断中介体形成")], answer: ["A", "B", "C", "D"], explanation: "前四项均为经典作用机制；‘阻断中介体形成’不是标准分类。", sourceLabel: "2018 预防 X8" },
    { id: "choice-two-bacteremia", type: "choice", tier: "high", chapter: "肠杆菌科", mode: "single", prompt: "感染过程中两次进入血流并主要以内毒素致病的是：", options: [option("A", "霍乱弧菌"), option("B", "脑膜炎奈瑟菌"), option("C", "伤寒沙门菌"), option("D", "痢疾志贺菌")], answer: ["C"], explanation: "伤寒沙门菌经淋巴组织和单核吞噬细胞系统增殖后可形成两次菌血症。", sourceLabel: "2018 预防 X9" },
    { id: "choice-diplococci", type: "choice", tier: "core", chapter: "球菌", mode: "multiple", prompt: "显微镜下常成双排列的细菌有：", options: [option("A", "金黄色葡萄球菌"), option("B", "肺炎链球菌"), option("C", "脑膜炎奈瑟菌"), option("D", "淋病奈瑟菌"), option("E", "铜绿假单胞菌")], answer: ["B", "C", "D"], explanation: "肺炎链球菌为矛头状双球菌，奈瑟菌为肾形革兰阴性双球菌。", sourceLabel: "2018 预防 X10" },
    { id: "choice-virus-entry", type: "choice", tier: "core", chapter: "病毒总论", mode: "multiple", prompt: "病毒进入细胞的方式包括：", options: [option("A", "简单扩散"), option("B", "直接穿入"), option("C", "受体介导内吞/吞饮"), option("D", "包膜融合"), option("E", "脂质体介导")], answer: ["B", "C", "D"], explanation: "病毒主要经直接穿入、内吞或包膜融合进入；脂质体介导是实验转染方式。", sourceLabel: "2018 预防 X12" },
    { id: "choice-hsv1-latency", type: "choice", tier: "core", chapter: "疱疹病毒", mode: "single", prompt: "HSV-1主要潜伏于：", options: [option("A", "口唇上皮细胞"), option("B", "脊髓后根神经节"), option("C", "B细胞"), option("D", "三叉神经节"), option("E", "骶神经节")], answer: ["D"], explanation: "HSV-1多潜伏于三叉神经节；HSV-2多潜伏于骶神经节。", sourceLabel: "2018 预防 X14" },
    { id: "choice-plasmid-error", type: "choice", tier: "high", chapter: "细菌遗传变异", mode: "single", prompt: "关于质粒的叙述，错误的是：", options: [option("A", "多为闭合环状双链DNA"), option("B", "具有自我复制能力"), option("C", "不能通过转导在细菌间转移"), option("D", "某些可在不同种属细菌间转移"), option("E", "通常不是生命活动所必需")], answer: ["C"], explanation: "质粒DNA可通过接合、转化，也可被噬菌体转导。", sourceLabel: "2018 预防 X15" },
    { id: "choice-pneumococcus", type: "choice", tier: "core", chapter: "球菌", mode: "single", prompt: "鼻咽拭子分离菌落呈草绿色溶血，胆汁溶菌试验阳性，最可能是：", options: [option("A", "甲型溶血性链球菌"), option("B", "乙型溶血性链球菌"), option("C", "肠球菌"), option("D", "肺炎链球菌")], answer: ["D"], explanation: "肺炎链球菌α溶血、胆汁溶菌阳性并对奥普托欣敏感。", sourceLabel: "2018 预防 X16" },
    { id: "choice-staph-localized", type: "choice", tier: "core", chapter: "球菌", mode: "single", prompt: "金黄色葡萄球菌化脓性感染易局限化，主要因为产生：", options: [option("A", "溶血素"), option("B", "葡萄球菌激酶"), option("C", "透明质酸酶"), option("D", "凝固酶"), option("E", "SPA")], answer: ["D"], explanation: "凝固酶促使纤维蛋白形成，包绕病灶并有利于抗吞噬。", sourceLabel: "2018 预防 X17" },
    { id: "choice-arboviruses", type: "choice", tier: "core", chapter: "虫媒病毒", mode: "multiple", prompt: "下列属于虫媒病毒的是：", options: [option("A", "乙脑病毒"), option("B", "登革病毒"), option("C", "黄热病病毒"), option("D", "脊髓灰质炎病毒"), option("E", "发热伴血小板减少综合征病毒")], answer: ["A", "B", "C", "E"], explanation: "SFTS病毒主要由蜱传播，也属节肢动物媒介病毒。", sourceLabel: "2018 预防 X18" },
    { id: "choice-ha-error", type: "choice", tier: "core", chapter: "呼吸道病毒", mode: "single", prompt: "关于流感病毒血凝素HA，错误的是：", options: [option("A", "是一种糖蛋白"), option("B", "位于病毒核衣壳内"), option("C", "介导吸附和膜融合"), option("D", "可出现在受感染细胞膜上"), option("E", "易发生变异")], answer: ["B"], explanation: "HA位于包膜表面突起，不在核衣壳内。", sourceLabel: "2018 预防 X19" },
    { id: "choice-hiv-features", type: "choice", tier: "core", chapter: "逆转录病毒", mode: "single", prompt: "关于HIV病原学特征，正确的是：", options: [option("A", "含逆转录酶的DNA病毒"), option("B", "无包膜"), option("C", "主要攻击CD8+T细胞"), option("D", "易发生抗原性变异"), option("E", "本身直接导致Kaposi肉瘤")], answer: ["D"], explanation: "HIV是有包膜RNA逆转录病毒，主要靶向CD4+细胞；Kaposi肉瘤直接相关病原为HHV-8。", sourceLabel: "2018 预防 X22" },
    { id: "choice-virulence-unrelated", type: "choice", tier: "core", chapter: "细菌感染", mode: "single", prompt: "与细菌致病性强弱通常无直接关系的是：", options: [option("A", "毒素"), option("B", "鞭毛"), option("C", "荚膜"), option("D", "芽胞"), option("E", "黏附素")], answer: ["D"], explanation: "芽胞主要与环境抵抗力和传播有关，不是直接毒力因子。", sourceLabel: "2018 预防 X23" },
    { id: "choice-botox", type: "choice", tier: "core", chapter: "厌氧菌", mode: "single", prompt: "已广泛用于美容除皱的细菌毒素是：", options: [option("A", "霍乱肠毒素"), option("B", "破伤风痉挛毒素"), option("C", "肉毒毒素"), option("D", "白喉毒素")], answer: ["C"], explanation: "肉毒毒素阻断神经肌接头乙酰胆碱释放，使局部肌肉松弛。", sourceLabel: "2018 预防 X24" },
    { id: "choice-noncellular", type: "choice", tier: "high", chapter: "绪论", mode: "single", prompt: "下列疾病中，病原体属于非细胞型微生物的是：", options: [option("A", "COVID-19"), option("B", "梅毒"), option("C", "斑疹伤寒"), option("D", "沙眼"), option("E", "体癣")], answer: ["A"], explanation: "SARS-CoV-2属于病毒；其余分别由螺旋体、立克次体、衣原体和真菌引起，均为细胞型微生物。", sourceLabel: "2018 预防 X25" },
    { id: "choice-h-pylori-virulence", type: "choice", tier: "core", chapter: "幽门螺杆菌", mode: "multiple", prompt: "幽门螺杆菌的主要致病相关因素包括：", options: [option("A", "尿素酶"), option("B", "鞭毛和黏附素"), option("C", "VacA"), option("D", "CagA"), option("E", "破伤风痉挛毒素")], answer: ["A", "B", "C", "D"], explanation: "前四项均参与定植、抗酸、上皮损伤和炎症；E无关。", sourceLabel: "2023 预防/法医 X" },
    { id: "choice-hbv-carriage", type: "choice", tier: "high", chapter: "肝炎病毒", mode: "multiple", prompt: "感染后可形成长期或终身病原携带/持续感染的有：", options: [option("A", "HIV"), option("B", "HAV"), option("C", "HBV"), option("D", "EBV")], answer: ["A", "C", "D"], explanation: "HIV持续感染，HBV可慢性化，EBV终身潜伏；HAV不形成慢性携带。", sourceLabel: "2023 临五 X" },
    { id: "choice-hdv", type: "choice", tier: "high", chapter: "肝炎病毒", mode: "multiple", prompt: "关于HDV，正确的是：", options: [option("A", "为缺陷病毒"), option("B", "复制和装配依赖HBsAg"), option("C", "可与HBV联合或重叠感染"), option("D", "主要经粪-口传播")], answer: ["A", "B", "C"], explanation: "HDV传播途径与HBV相似，主要为血液、性和母婴传播。", sourceLabel: "2022 临五 X" },
    { id: "choice-influenza-pandemic", type: "choice", tier: "core", chapter: "呼吸道病毒", mode: "multiple", prompt: "甲型流感容易出现大流行的原因包括：", options: [option("A", "基因组分节段，可发生重配"), option("B", "具有动物宿主，存在跨种传播机会"), option("C", "人群对新HA/NA亚型缺乏免疫"), option("D", "病毒只能通过粪-口传播")], answer: ["A", "B", "C"], explanation: "分节段重配和动物宿主可产生新亚型，人群缺乏免疫时可大流行。", sourceLabel: "2023 临五 X" },
    { id: "choice-norovirus", type: "choice", tier: "core", chapter: "胃肠道病毒", mode: "single", prompt: "学校或游轮发生聚集性呕吐、腹泻，病程短且通常无高热，最可能是：", options: [option("A", "诺如病毒"), option("B", "狂犬病毒"), option("C", "乙脑病毒"), option("D", "HIV")], answer: ["A"], explanation: "诺如病毒传染性强，常引起学校、游轮等场所急性胃肠炎暴发。", sourceLabel: "2022 口腔/2023 预防/法医" },
    { id: "choice-tb-bile", type: "choice", tier: "high", chapter: "分枝杆菌", mode: "single", prompt: "结核分枝杆菌实验室检查中，不能单独用于判断活动性结核的是：", options: [option("A", "抗酸染色"), option("B", "培养"), option("C", "核酸扩增"), option("D", "结核菌素试验")], answer: ["D"], explanation: "结核菌素试验反映感染和细胞免疫，不能区分活动性与潜伏感染。", sourceLabel: "习题集定向补漏" },
    { id: "choice-cholera-toxin", type: "choice", tier: "core", chapter: "弧菌属", mode: "single", prompt: "霍乱肠毒素导致大量水样腹泻的直接细胞内机制是：", options: [option("A", "抑制腺苷酸环化酶"), option("B", "持续活化Gsα并升高cAMP"), option("C", "抑制蛋白质合成"), option("D", "破坏肠上皮细胞并入血")], answer: ["B"], explanation: "A亚单位使Gsα持续活化，cAMP升高导致氯和水分泌。", sourceLabel: "一本通病例同源题" },
    { id: "choice-botulinum-site", type: "choice", tier: "core", chapter: "厌氧菌", mode: "single", prompt: "肉毒毒素主要作用于：", options: [option("A", "中枢抑制性神经元"), option("B", "外周胆碱能神经末梢"), option("C", "肝细胞核糖体"), option("D", "肠上皮腺苷酸环化酶")], answer: ["B"], explanation: "肉毒毒素裂解SNARE蛋白，阻断外周胆碱能末梢释放乙酰胆碱。", sourceLabel: "2023 临五 A1" }
  ];

  const compactTermAnswers = {
    "term-cccdna": ["HBV的rcDNA入核后修复形成的共价闭合环状双链DNA。", "它是稳定的病毒转录模板，是HBV持续感染和停药复发的重要原因。"],
    "term-coagulase": ["金黄色葡萄球菌产生的、可使人或兔血浆凝固的酶。", "分游离型和结合型，可抗吞噬、使感染局限，是鉴别致病株的重要指标。"],
    "term-stormy-fermentation": ["产气荚膜梭菌在牛乳培养基中发酵乳糖，产酸使酪蛋白凝固。", "同时大量产气冲碎凝块，形成汹涌状现象。"],
    "term-cpe": ["病毒在培养细胞内增殖引起的、显微镜下可见的细胞形态改变。", "如细胞圆缩、裂解、融合或形成包涵体，可用于病毒鉴定。"],
    "term-pyrogenic-exotoxin": ["由溶原化A群链球菌产生的外毒素，又称猩红热毒素。", "具有超抗原作用，可引起发热、皮疹及中毒性休克。"],
    "term-reverse-transcriptase": ["逆转录是以RNA为模板合成DNA的过程；逆转录酶是催化该过程的病毒酶。", "该酶主要具有RNA依赖的DNA聚合酶和RNase H活性。"],
    "term-slow-virus-infection": ["病毒感染后潜伏期很长、发病后呈慢性进行性加重的一类持续感染。", "如HIV感染、麻疹相关SSPE和朊粒病。"],
    "term-virus-life-cycle": ["病毒在易感细胞内产生子代病毒的全过程。", "包括吸附、穿入、脱壳、生物合成、装配成熟和释放。"],
    "term-toxoid": ["外毒素经甲醛等处理后失去毒性但保留抗原性的制剂。", "可刺激产生抗毒素，用于人工主动免疫。"],
    "term-bacterial-l-form": ["细胞壁肽聚糖受损或合成受抑制后，仍能在高渗环境中存活的细菌细胞壁缺陷型。", "形态多形、需高渗培养，部分可回复为原菌。"],
    "term-transduction": ["以噬菌体为媒介，将供体菌DNA转移给受体菌的基因转移方式。", "分为普遍性转导和局限性转导。"],
    "term-reassortment": ["两种分节段基因组病毒共感染同一细胞时，子代病毒重新组合亲代基因节段的现象。", "可导致甲型流感病毒抗原性转变。"],
    "term-prokaryotic-microorganism": ["无核膜和核仁、遗传物质位于核质、仅有核糖体等简单细胞器的一类细胞型微生物。", "包括细菌、支原体、衣原体、立克次体和螺旋体等。"],
    "term-lysogenic-bacterium": ["染色体中整合有温和噬菌体基因组（前噬菌体）的细菌。", "前噬菌体可随细菌复制，诱导后进入裂解周期。"],
    "term-infectious-rna": ["某些正链RNA病毒的裸基因组RNA，单独进入易感细胞即可作为mRNA启动复制。", "负链RNA通常必须依赖病毒自带的RNA聚合酶，裸RNA无感染性。"],
    "term-antigenic-shift": ["甲型流感病毒因基因节段重配，使HA和/或NA发生突然、显著改变。", "可产生新亚型并引起世界性大流行。"],
    "term-crossing-reactivation": ["两个核酸受损而失活的相关病毒共同感染同一细胞时，通过重组产生感染性子代病毒的现象。"],
    "term-daa": ["直接靶向病毒蛋白或病毒酶、阻断病毒复制的抗病毒药物。", "如HCV蛋白酶、NS5A或聚合酶抑制剂。"],
    "term-mic": ["规定条件下，能抑制肉眼可见细菌生长的抗菌药物最低浓度。", "用于定量判断细菌对抗菌药物的敏感性。"],
    "term-spa": ["金黄色葡萄球菌细胞壁蛋白，可非特异结合IgG的Fc段。", "能抗吞噬，也可用于协同凝集试验。"],
    "term-latent-infection": ["原发感染后病毒基因组长期潜伏于特定细胞，通常不产生完整病毒和症状。", "受刺激后可再激活并引起复发，如HSV和VZV。"],
    "term-viral-receptor": ["易感细胞上能被病毒特异识别并介导吸附或进入的宿主分子。", "其分布是决定病毒宿主范围和组织嗜性的重要因素。"],
    "term-hemagglutination": ["某些病毒的血凝素与红细胞受体结合，使红细胞发生凝集的现象。", "可用于病毒定量；特异抗体阻止血凝称血凝抑制试验。"],
    "term-growth-curve": ["在封闭液体培养中，以时间为横坐标、活菌数对数为纵坐标绘制的细菌群体生长曲线。", "分迟缓期、对数期、稳定期和衰亡期。"],
    "term-plasmid": ["细菌染色体外能自主复制的遗传物质，通常为闭合环状双链DNA。", "非生命必需，但可携带耐药、毒力等基因并可转移。"],
    "term-resistance-plasmid": ["携带耐药基因、使细菌获得一种或多种耐药性的质粒。", "通常由负责转移的RTF和决定耐药性的r-det组成。"],
    "term-conjugation": ["供体菌与受体菌直接接触，通常经性菌毛将遗传物质转移给受体菌的方式。"],
    "term-nosocomial-infection": ["患者或医务人员在医院等医疗机构内获得的感染。", "可分内源性和外源性感染，机会致病菌是重要来源。"],
    "term-staphylococcal-enterotoxin": ["金黄色葡萄球菌产生的耐热、抗胃肠蛋白酶的外毒素，部分有超抗原作用。", "摄入食物中预形成毒素后可迅速引起呕吐、腹痛和腹泻。"],
    "term-widal-test": ["用已知伤寒、副伤寒沙门菌抗原检测患者血清相应抗体及效价的定量凝集试验。", "用于辅助诊断伤寒和副伤寒，双份血清效价四倍升高更有意义。"],
    "term-koch-phenomenon": ["结核分枝杆菌再次感染时，特异性细胞免疫和IV型超敏反应同时存在的现象。", "病灶出现快而局限，细菌不易扩散，但局部组织损伤较明显。"],
    "term-acid-fast-stain": ["利用分枝杆菌经石炭酸复红染色后不被盐酸酒精脱色的特性进行的鉴别染色。", "抗酸菌呈红色，其他细菌和背景呈蓝色。"],
    "term-antigenic-drift": ["流感病毒HA、NA基因点突变导致的连续、小幅抗原改变。", "不产生新亚型，主要引起季节性流行。"],
    "term-arbovirus": ["经吸血节肢动物叮咬在脊椎动物间传播的一类病毒的生态学统称。", "所致疾病多有自然疫源性、地方性和季节性。"],
    "term-negri-body": ["狂犬病毒感染后在中枢神经细胞质内形成的圆形或椭圆形嗜酸性包涵体。", "含病毒核衣壳，具有诊断价值。"],
    "term-prion": ["不含核酸、由异常构象蛋白组成的传染因子。", "可诱导正常朊蛋白构象改变，引起传染性海绵状脑病。"]
  };

  const compactShortAnswers = {
    "short-live-vs-inactivated-vaccine": ["减毒活疫苗可在体内有限增殖，能诱导体液、细胞和黏膜免疫，免疫持久。", "其缺点是稳定性较差，有毒力回复风险，免疫缺陷者和孕妇一般禁用。", "灭活疫苗不能增殖，安全稳定、无毒力回复，主要诱导体液免疫。", "其免疫原性较弱，常需较大剂量、多次接种和加强。"],
    "short-tb-lab-diagnosis": ["按病变部位采集晨痰、灌洗液、脑脊液或组织等标本。", "抗酸染色或荧光染色直接镜检。", "罗氏或液体培养分离鉴定，并进行药敏试验。", "核酸检测可快速检出病原和部分耐药；PPD/IGRA仅作感染辅助判断。"],
    "short-foodborne-bacteria": ["金黄色葡萄球菌：食物中预形成的耐热肠毒素，常致急性呕吐。", "沙门菌：侵袭肠黏膜并释放内毒素，致发热、腹泻。", "副溶血性弧菌：海产品相关，TDH等毒素致水样腹泻。", "产气荚膜梭菌：肠内形成芽胞并释放肠毒素，致腹痛、腹泻。"],
    "short-hsv-course": ["原发感染：病毒在皮肤黏膜上皮细胞增殖，引起口唇或生殖器疱疹。", "潜伏感染：HSV-1多潜伏于三叉神经节，HSV-2多潜伏于骶神经节。", "发热、紫外线、创伤或免疫抑制可使病毒再激活。", "病毒沿感觉神经返回皮肤黏膜，引起局限性复发并可排毒传播。"],
    "short-endotoxin": ["内毒素是革兰阴性菌LPS，由脂质A、核心多糖和O抗原组成，脂质A有毒性。", "细菌裂解或外膜释放时释出，耐热，作用无明显组织特异性。", "可引起发热、白细胞变化、低血压、DIC和感染性休克。", "抗原性弱，不能用甲醛制成类毒素。"],
    "short-influenza-negative-rna": ["负链RNA不能直接翻译，病毒必须携带RNA依赖的RNA聚合酶；流感病毒在细胞核复制。", "先转录mRNA，并通过cap-snatching获得帽结构。", "复制时先合成全长正链cRNA，再以其为模板合成子代负链RNA。", "HA、NA等插入细胞膜，病毒装配后出芽释放，NA促进子代脱离。"],
    "short-viremia": ["病毒血症是病毒进入血液并随血流播散的状态。", "原发病毒血症通常量少，使病毒到达网状内皮系统等部位。", "增殖后可形成量更大的继发病毒血症并播散至靶器官。", "麻疹、水痘、脊髓灰质炎和乙脑等可出现病毒血症。"],
    "short-tetanus-vs-botulinum": ["两者均为梭菌神经外毒素，可裂解SNARE蛋白、阻断递质释放。", "破伤风毒素阻断中枢抑制性递质GABA和甘氨酸，导致痉挛性麻痹。", "肉毒毒素阻断外周胆碱能末梢释放乙酰胆碱，导致弛缓性麻痹。", "防治均需早期抗毒素和支持治疗；破伤风还需清创和主动免疫。"],
    "short-replica-plating": ["先让细菌在无选择培养基形成母板菌落。", "用无菌绒布按原位置转印到含和不含选择因素的培养基。", "比较对应菌落，可发现耐药菌在接触选择因素前已经存在。", "说明突变是自发、非定向的，药物只起选择作用。"],
    "short-positive-vs-negative-rna": ["两者均需病毒RNA依赖的RNA聚合酶，并以互补链为复制中间体。", "正链RNA可直接作为mRNA，入胞后先翻译聚合酶。", "负链RNA不能直接翻译，病毒必须自带聚合酶并先转录mRNA。", "因此正链裸RNA常有感染性，负链裸RNA通常无感染性。"],
    "short-aids-art": ["采用多种抗逆转录病毒药物联合治疗，以同时阻断不同复制环节。", "常用方案为两种NRTI联合一种整合酶抑制剂。", "联合用药可最大限度抑制病毒并减少耐药。", "需长期规律服药，监测病毒载量、CD4细胞和药物不良反应。"],
    "short-toxemia": ["毒血症指病原菌局限在局部生长，不进入或很少进入血流。", "其产生的外毒素进入血液并作用于易感组织，引起全身中毒症状。", "白喉和破伤风是典型例子。"],
    "short-vzv": ["VZV经呼吸道或接触传播，原发感染引起水痘。", "病毒随后潜伏于感觉神经节。", "免疫力下降时再激活，引起沿单侧神经节段分布的带状疱疹。", "可用疫苗预防，发病后早期使用阿昔洛韦类药物并处理疼痛。"],
    "short-hpv": ["HPV主要经性接触或皮肤黏膜密切接触传播。", "低危型6、11主要引起生殖器疣。", "高危型16、18等持续感染与宫颈癌及部分其他肿瘤相关。", "高价疫苗覆盖型别更多，但不能治疗已有感染，也不能替代宫颈癌筛查。"],
    "short-zoonoses": ["鼠疫：鼠疫耶尔森菌，以啮齿动物为宿主、蚤为媒介，可致腺鼠疫和肺鼠疫。", "布鲁菌病：接触患畜或未消毒乳制品传播，可致波浪热。", "炭疽：炭疽芽胞杆菌经接触、消化道或吸入传播，可致皮肤、胃肠或吸入性炭疽。", "共同特点是动物为重要传染源，常有地域性或职业性。"]
  };

  terms.forEach((item) => {
    item.detailPoints = item.examPoints;
    item.examPoints = compactTermAnswers[item.id] || item.examPoints;
    item.answerScore = 3;
  });
  shorts.forEach((item) => {
    item.detailPoints = item.examPoints;
    item.examPoints = compactShortAnswers[item.id] || item.examPoints;
    item.answerScore = 4;
  });

  window.microbiologyData = {
    meta: {
      title: "医学微生物学C · 最后35小时冲刺",
      subtitle: "名词必背36个（历年23＋星号补充13） · 8个高频简答 · 一本通11个病例",
      examAt: "2026-07-02T13:00:00+08:00",
      pastIdentifiable: 184,
      paperRecords: 8,
      termOccurrences: 41,
      termConcepts: 23,
      starredTermConcepts: 31,
      requiredTermConcepts: 36,
      starredSupplementTerms: 13,
      missingTermPrompts: 2,
      coverage: { exerciseAB: "91.3%", exerciseABC: "96.7%", termSource: "21/23（91.3%）" }
    },
    schedule: [
      { time: "优先完成", target: "名词解释必背", detail: "36个分三层：12个跨年高频 → 13个*号新增 → 11个历年单次", view: "terms" },
      { time: "10:15-15:15", target: "高频简答", detail: "先前4题，再后4题；每题只背得分骨架", view: "shorts" },
      { time: "15:30-21:00", target: "一本通病例", detail: "先HBV/HDV、霍乱、幽门螺杆菌、链球菌，再完成其余病例", view: "cases" },
      { time: "21:15-23:15", target: "高频选择", detail: "只做可靠答案题；错题立即进入回炉", view: "choices" },
      { time: "23:15-00:15", target: "第二轮", detail: "名词＋错题，不再开新章节", view: "return" },
      { time: "7月2日 08:00-12:00", target: "考前回炉", detail: "23词速背、8简答提纲、核心病例和错题", view: "last30" }
    ],
    terms,
    shorts,
    cases,
    choices
  };
}());
