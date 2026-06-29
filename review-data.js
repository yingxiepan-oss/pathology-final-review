(function () {
  const auditedAnswerProfiles = window.pathologyAnswerProfiles || {};
  const q = (prompt, topic = "", options = [], answer = "", note = "") => ({ prompt, topic, options, answer, note });
  const section = (type, items) => ({ type, items });
  const paper = (id, label, groupId, source, sections, note = "") => ({ id, label, groupId, source, sections, note });

  const topics = {
    benignMalignant: { chapter: "肿瘤", label: "良、恶性肿瘤鉴别", pages: "PDF p85、p98、p102", match: "exact", aliases: ["良性肿瘤", "恶性肿瘤", "良、恶性", "癌和肉瘤"] },
    metaplasia: { chapter: "适应与损伤", label: "化生", pages: "PDF p12、p20", match: "exact", aliases: ["化生", "metaplasia", "鳞状化生"] },
    necrosisOutcome: { chapter: "适应与损伤", label: "坏死的结局", pages: "PDF p21", match: "exact", aliases: ["坏死的结局", "脓肿的结局", "坏死转归"] },
    hemorrhagicInfarct: { chapter: "局部血液循环", label: "出血性梗死", pages: "PDF p42–51", match: "same", aliases: ["出血性梗死", "肠套叠", "睾丸扭转"] },
    thrombosis: { chapter: "局部血液循环", label: "血栓形成", pages: "PDF p39–51", match: "exact", aliases: ["血栓", "thrombosis", "白色血栓", "混合血栓"] },
    inflammation: { chapter: "炎症", label: "炎症基本病变", pages: "PDF p54–66", match: "same", aliases: ["炎症", "渗出", "化脓性炎", "肉芽肿性炎"] },
    granuloma: { chapter: "炎症", label: "肉芽肿", pages: "PDF p59、p66", match: "exact", aliases: ["肉芽肿", "granuloma"] },
    rheumatic: { chapter: "心血管", label: "风湿病与赘生物", pages: "PDF p116–137", match: "same", aliases: ["风湿", "aschoff", "rheumatic body", "赘生物", "心瓣膜"] },
    myocardialInfarct: { chapter: "心血管", label: "心肌梗死及并发症", pages: "PDF p119–137", match: "exact", aliases: ["心肌梗死", "心梗", "室壁瘤", "ventricular aneurysm"] },
    chronicBronchitis: { chapter: "呼吸", label: "慢支、肺气肿与肺心病", pages: "PDF p141–151", match: "exact", aliases: ["慢性支气管炎", "慢支", "肺气肿", "emphysema", "肺源性心脏病", "cor pulmonale", "copd", "阻塞性肺"] },
    pneumonia: { chapter: "呼吸", label: "大叶性与小叶性肺炎", pages: "PDF p141–151", match: "same", aliases: ["大叶性肺炎", "小叶性肺炎", "肺肉质变", "carnification"] },
    gastricUlcer: { chapter: "消化", label: "胃溃疡", pages: "PDF p168、p173–188", match: "exact", aliases: ["胃溃疡", "消化性溃疡"] },
    cirrhosis: { chapter: "消化", label: "肝硬化与门脉高压", pages: "PDF p169–188", match: "same", aliases: ["肝硬化", "假小叶", "cirrhosis", "门脉高压", "食管下静脉", "呕血"] },
    hepatitis: { chapter: "消化", label: "病毒性肝炎", pages: "PDF p169、p173、p180–184", match: "same", aliases: ["肝炎", "桥接坏死", "bridging necrosis", "毛玻璃样", "ground glass"] },
    schistoLiver: { chapter: "感染", label: "血吸虫性肝纤维化", pages: "PDF p270–289", match: "same", aliases: ["血吸虫", "干线型", "pipe-stem", "嗜酸性脓肿"] },
    nephrotic: { chapter: "泌尿", label: "肾病综合征", pages: "PDF p204–219", match: "exact", aliases: ["肾病综合征", "nephrotic syndrome", "足突病", "foot process", "钉突", "spike"] },
    glomerulonephritis: { chapter: "泌尿", label: "肾小球肾炎", pages: "PDF p203–219", match: "same", aliases: ["肾小球肾炎", "肾炎综合征", "新月体", "goodpasture", "线性"] },
    pyelonephritis: { chapter: "泌尿", label: "肾盂肾炎", pages: "PDF p203、p208–219", match: "same", aliases: ["肾盂肾炎"] },
    tb: { chapter: "感染", label: "结核病", pages: "PDF p270–289", match: "same", aliases: ["结核", "tuberculoma", "ghon", "干酪样"] },
    encephalitis: { chapter: "神经", label: "流行性乙型脑炎", pages: "PDF p254–267", match: "same", aliases: ["乙脑", "卫星现象", "噬神经", "neurophagia", "筛状软化", "sieve-like"] },
    brainEdema: { chapter: "神经", label: "脑水肿与脑积水", pages: "PDF p254–255", match: "same", aliases: ["脑水肿", "脑积水", "hydrocephalus"] },
    reproductive: { chapter: "生殖与乳腺", label: "滋养层及宫颈疾病", pages: "PDF p222–235", match: "same", aliases: ["绒毛膜癌", "绒癌", "葡萄胎", "cin", "nabothian", "宫颈"] },
    hematology: { chapter: "淋巴造血", label: "淋巴造血系统", pages: "PDF p190–202", match: "same", aliases: ["ph chromosome", "philadelphia", "费城", "霍奇金", "r-s", "kaposi", "bence-jones"] },
    thyroid: { chapter: "内分泌", label: "甲状腺疾病", pages: "PDF p241–250", match: "same", aliases: ["graves", "甲状腺", "桥本", "砂粒体"] },
  };

  const papers = [
    paper("p23-clinical", "23级临五｜病理解剖学", "p23-shared", "聊天补发", [
      section("选择题", [
        q("哪一个与化生有关？食管鳞癌/气管鳞癌", "metaplasia", ["食管鳞癌", "气管鳞癌"], "气管鳞癌。气管/支气管黏膜可先发生鳞状化生，再在此基础上发生鳞癌；食管原本即为复层鳞状上皮。"),
        q("白色血栓主要成分？血小板/纤维蛋白", "thrombosis", ["血小板", "纤维蛋白"], "血小板"),
        q("血吸虫卵结节与结核结节的区别？", "schistoLiver", [], "血吸虫卵结节中央可见虫卵及嗜酸性坏死，嗜酸性粒细胞突出；结核结节以类上皮细胞、Langhans巨细胞和干酪样坏死为特征。"),
        q("急性炎症最主要的特征？渗出/充血/坏死", "inflammation", ["渗出", "充血", "坏死"], "渗出"),
        q("肉芽肿的特征性细胞？", "granuloma", [], "巨噬细胞及其衍生细胞"),
        q("肿瘤中心坏死属于哪类坏死？", "benignMalignant", [], "多为凝固性坏死"),
        q("血道转移癌常见终点？肝与肺/肾与肺", "benignMalignant", [], "肝与肺"),
        q("高血压代偿期心脏变化？", "myocardialInfarct", [], "左心室向心性肥大"),
        q("风湿性全心炎中风湿小体主要见于何处？", "rheumatic", [], "心肌间质"),
        q("大叶性肺炎属于什么类型炎症？", "pneumonia", [], "纤维蛋白性炎"),
        q("关于小叶性肺炎并发症的说法错误的是？", "pneumonia", [], "“病灶多分布于肺上叶”为错误描述。小叶性肺炎病灶以细支气管为中心，散在于两肺各叶，常以下叶及背侧较重；可并发肺脓肿、脓胸等。"),
        q("慢支导致的肺气肿是哪种类型？", "chronicBronchitis", [], "腺泡中央型"),
        q("肺中央型癌最常见的组织学类型？", "chronicBronchitis", [], "鳞状细胞癌"),
        q("关于胃溃疡的正确描述？", "gastricUlcer", [], "溃疡边缘黏膜肌层可与肌层接近或融合。典型慢性胃溃疡底部较洁净，镜下由内向外为渗出坏死层、炎症层、肉芽组织层和瘢痕层。"),
        q("Leather bottle stomach 是什么？", "gastricUlcer", [], "弥漫浸润型胃癌（革囊胃）"),
        q("乙肝感染细胞沙砾样核与何种抗原有关？", "hepatitis", [], "HBcAg", "回忆题干可能指沙砾样核；与毛玻璃样肝细胞的 HBsAg 不同。"),
        q("亚急性重型肝炎与急性重型肝炎最大的区别？", "hepatitis", [], "亚急性重型肝炎可见明显肝细胞结节状再生"),
        q("急性弥漫性肾小球肾炎最主要的特征？", "glomerulonephritis", [], "肾小球内皮细胞和系膜细胞增生"),
        q("免疫荧光呈线性的是？", "glomerulonephritis", [], "肺出血肾炎综合征（Goodpasture syndrome）"),
        q("Graves病的镜下病理特征？", "thyroid", [], "滤泡上皮高柱状增生，胶质减少并见吸收空泡"),
        q("神经系统瘢痕形成由哪个细胞完成？", "encephalitis", [], "星形胶质细胞"),
        q("Lacunae 的定义？", "encephalitis", [], "脑内直径通常小于1.5 cm的腔隙性软化灶"),
        q("何处检出结核分枝杆菌浓度最高？", "tb", [], "空洞内液化的干酪样坏死物"),
        q("梅毒不具有哪种病理变化？", "tb", [], "干酪样坏死"),
        q("肠阿米巴病的诊断依据？", "schistoLiver", [], "粪便或病灶中检出阿米巴滋养体"),
        q("Nabothian cyst 见于？", "reproductive", [], "宫颈黏液潴留性囊肿"),
        q("狼疮细胞是什么？", "inflammation", [], "吞噬了狼疮小体（苏木素小体）的中性粒细胞或巨噬细胞。"),
        q("与 HIV 有关的肿瘤？", "hematology", [], "Kaposi 肉瘤"),
        q("Ph 染色体见于？", "hematology", [], "慢性粒细胞性白血病"),
        q("心衰细胞是什么？", "chronicBronchitis", [], "吞噬含铁血黄素的肺泡巨噬细胞"),
        q("第31题未提供", "", [], "", "原回忆缺失，不推测。"),
        q("胸痛放射至左臂，T波倒置，CK-MB与肌钙蛋白升高，夜间猝死，死因？", "myocardialInfarct", [], "冠心病并急性心肌梗死，猝死多与致命性心律失常有关"),
        q("淋巴结内见角化珠，最可能诊断？", "benignMalignant", [], "淋巴结转移性高分化鳞状细胞癌"),
        q("钉突＋肾病综合征，电子致密物位于何处？", "nephrotic", [], "上皮下"),
        q("6岁儿童肠套叠，淤血的原因及结局？", "hemorrhagicInfarct", [], "静脉回流受阻，易发生出血性梗死"),
        q("女性咯血，影像提示子宫病灶，考虑？", "reproductive", [], "绒毛膜癌肺转移"),
        q("头痛、紫癜、脾刮取腻子状、肾上腺出血（华-佛综合征），考虑？", "encephalitis", [], "暴发性流行性脑脊髓膜炎"),
        q("长期咳痰、呼吸困难、桶状胸、肋间隙增宽，诊断？", "chronicBronchitis", [], "慢性支气管炎并肺气肿"),
        q("肝穿刺见肝细胞气球样变性，诊断？", "hepatitis", [], "急性普通型病毒性肝炎"),
        q("甲状腺乳头分支多、有纤维血管轴心和砂粒体，正确特征？", "thyroid", [], "癌细胞核呈透明毛玻璃样"),
      ]),
      section("名词解释", [
        q("Sieve-like softening foci", "encephalitis"), q("Carnification", "pneumonia"), q("Cirrhosis", "cirrhosis"), q("Ventricular aneurysm", "myocardialInfarct"), q("Tuberculoma", "tb"),
      ]),
      section("简答题", [
        q("辨析脑水肿与脑积水", "brainEdema"),
        q("举例阻塞性肺部疾病并介绍其病理特征", "chronicBronchitis"),
        q("从病因、病理特征、临床表现辨析肾小球肾炎与肾盂肾炎", "pyelonephritis"),
        q("简述坏死的结局", "necrosisOutcome"),
      ]),
      section("病例分析", [q("42岁工人，既往乙肝，病程迁延并有轻度黄疸、转氨酶波动；判断疾病并写肝穿刺病理特征。", "hepatitis", [], "慢性病毒性肝炎；门管区淋巴细胞浸润，界面炎/碎片状坏死，较重者可见桥接坏死并伴纤维化。")]),
    ], "A1回忆编号1–30，第31题未提供；A2为32–40。"),

    paper("p23-oral", "23级口腔｜病理", "p23-shared", "聊天补发", [
      section("选择题", [q("与23级临五同卷：A1 1–31、A2 32–40；原文未逐题重复。", "", [], "", "频率统计与23级临五合并为一套独立试卷。")]),
      section("名词解释", [q("Sieve-like softening foci", "encephalitis"), q("Ventricular aneurysm", "myocardialInfarct"), q("Carnification", "pneumonia"), q("Cirrhosis", "cirrhosis"), q("Tuberculoma", "tb")]),
      section("简答题", [q("脑水肿和脑积水的区别", "brainEdema"), q("举例3个阻塞性肺部疾病并描述病理特征", "chronicBronchitis"), q("肾小球肾炎和肾盂肾炎的区别", "pyelonephritis"), q("坏死的结局", "necrosisOutcome")]),
      section("病例分析", [q("乙肝病程迁延，发热、黄疸，医生建议穿刺活检：诊断及病变特征。", "hepatitis")]),
    ], "与23级临五大题相同；按专业分别展示，频率只计一次。"),

    paper("p21-eight", "21级临八｜病理期末", "p21-eight", "聊天补发", [
      section("选择题", [q("卫星现象", "encephalitis"), q("绒癌血清学检测", "reproductive", [], "血/尿 hCG（尤其 β-hCG）"), q("免疫荧光线性分布：肺出血肾炎综合征", "glomerulonephritis")]),
      section("名词解释", [q("Aschoff小体", "rheumatic"), q("Emphysema", "chronicBronchitis"), q("Mallory小体", "hepatitis"), q("Tuberculoma", "tb"), q("Neurophagia", "encephalitis"), q("Philadelphia chromosome", "hematology"), q("Pipe-stem fibrosis", "schistoLiver"), q("Spike", "nephrotic")]),
      section("简答题", [q("肺源性心脏病的病因和病理特征", "chronicBronchitis"), q("肾病综合征的定义并举例三个表现为肾病综合征的肾小球疾病", "nephrotic"), q("胃溃疡的病理特征和并发症", "gastricUlcer"), q("列举与心瓣膜赘生物相关的两种疾病并简述病理特点", "rheumatic")]),
      section("病例分析", [q("20年肝炎未治疗，呕血，肝内低回声结节、肝静脉窄、肝外静脉增宽、脾大、腹水：诊断、病理变化、呕血原因和机制。", "cirrhosis", [], "慢性病毒性肝炎发展为肝硬化并门静脉高压；呕血主要因食管胃底静脉曲张破裂。低回声结节需结合AFP和影像排除肝癌。")]),
    ]),

    paper("p22-oral", "22级口腔｜病理学", "p22-oral", "病理学题库1.pdf p12–14", [
      section("选择题", [q("含毛发、骨、牙齿等多胚层成分的肿瘤？", "benignMalignant", [], "畸胎瘤"), q("周围型肺癌最常见类型？", "chronicBronchitis", [], "腺癌"), q("明显败血症表现，选择英文诊断", "inflammation", [], "septicemia"), q("肠套叠属于哪类梗死？", "hemorrhagicInfarct", [], "出血性梗死"), q("肠坏疽属于哪类坏疽？", "necrosisOutcome", [], "湿性坏疽"), q("甲状腺乳头状癌病例判断", "thyroid"), q("红色神经元的本质", "encephalitis", [], "神经元急性缺血性坏死"), q("白色血栓的主要成分", "thrombosis", [], "血小板"), q("与AIDS密切相关的肿瘤", "hematology", [], "Kaposi肉瘤"), q("Hodgkin淋巴瘤诊断性细胞", "hematology", [], "R-S细胞"), q("羊水栓塞的主要病理诊断依据", "thrombosis", [], "肺小血管内见羊水成分"), q("Goodpasture综合征的免疫荧光特点", "glomerulonephritis", [], "沿肾小球基膜线性沉积"), q("急性弥漫性增生性肾炎主要增生细胞", "glomerulonephritis", [], "内皮细胞和系膜细胞")]),
      section("名词解释", [q("Precancerous lesion", "benignMalignant"), q("Ventricular aneurysm", "myocardialInfarct"), q("Ph chromosome", "hematology"), q("Eosinophilic abscess", "schistoLiver"), q("Anaplasia", "benignMalignant"), q("Heart failure cell", "chronicBronchitis")]),
      section("简答题", [q("良、恶性肿瘤的鉴别", "benignMalignant"), q("肾病综合征定义并举两例", "nephrotic"), q("胃溃疡病理特点和并发症", "gastricUlcer"), q("列举两种肉芽肿性炎并述病理特点", "granuloma")]),
      section("病例分析", [q("长期饮酒，有黄疸、门静脉增宽、口腔异味、牙龈易出血：诊断及口腔症状机制。", "cirrhosis", [], "小结节性（酒精性）肝硬化；肝功能障碍致凝血因子合成减少和毒性代谢产物蓄积。")]),
    ]),

    paper("p20-preventive", "20级预防｜病理理论", "p20-preventive", "病理学题库1.pdf p12", [
      section("选择题", [q("基础知识30题；含病理形态学创始人、透明变性小体、长骨骨折后栓塞。", "thrombosis")]),
      section("名词解释", [q("Metaplasia", "metaplasia"), q("Abscess", "inflammation"), q("Granuloma", "granuloma"), q("Atrophy", "necrosisOutcome"), q("Thrombosis", "thrombosis"), q("Carcinoma in situ", "benignMalignant"), q("Anaplasia", "benignMalignant"), q("Recanalization", "thrombosis"), q("Caseous necrosis", "tb"), q("Gangrene", "necrosisOutcome")]),
      section("简答题", [q("癌和肉瘤的区别", "benignMalignant"), q("颈部淋巴结肿大见于哪些疾病", "inflammation"), q("炎症的局部表现和全身反应及机制", "inflammation"), q("透明变性的特点", "necrosisOutcome")]),
      section("论述题", [q("血栓、栓塞、梗死、坏死的联系", "thrombosis"), q("恶性肿瘤的特点", "benignMalignant")]),
    ], "原资料明确：该卷只考总论。"),

    paper("p18-upper", "18级08组｜病理解剖上", "p18-upper", "病理学题库1.pdf p10–11", [
      section("选择题", [q("白细胞向化学刺激物定向移动：chemotaxis", "inflammation"), q("细胞凋亡通路最终执行者", "necrosisOutcome", [], "caspase-3等执行者caspase"), q("白色血栓成分", "thrombosis", [], "血小板"), q("脓肿向体表形成排脓管道称什么", "inflammation", [], "窦道；连接两个有腔器官或体表时称瘘管"), q("睾丸扭转导致的梗死类型", "hemorrhagicInfarct", [], "出血性梗死")]),
      section("名词解释", [q("Karyorrhexis", "necrosisOutcome"), q("Atrophy", "necrosisOutcome"), q("Metaplasia", "metaplasia"), q("Decompression disease", "thrombosis"), q("Organization", "thrombosis"), q("Repair", "necrosisOutcome"), q("Granuloma", "granuloma"), q("Keloid", "necrosisOutcome"), q("Recanalization", "thrombosis"), q("Borderline tumor", "benignMalignant")]),
      section("简答题", [q("化脓性炎定义并举四例", "inflammation"), q("良、恶性肿瘤区别", "benignMalignant"), q("出血性梗死发生条件", "hemorrhagicInfarct"), q("癌前病变定义并举四例", "benignMalignant")]),
      section("论述题", [q("创伤修复；一期愈合与二期愈合", "necrosisOutcome"), q("渗出液和漏出液的区别", "inflammation")]),
      section("病例分析", [q("股骨骨折后三日进行性呼吸困难死亡，脑和肺小血管见油红O阳性物：诊断及死因。", "thrombosis", [], "脂肪栓塞综合征；脂滴栓塞肺和脑微循环，引起呼吸功能障碍及神经系统损害。")]),
    ]),

    paper("p16-clinical", "16级临五｜病理", "p12-clinical", "病理学题库1.pdf p10", [section("整卷说明", [q("与12级临五理论卷相同，仅将名词解释中的冈氏复合征改为桥接坏死；补充选择题：结核杆菌最多见于液化干酪样坏死物。", "tb")])], "同卷频率与12级临五合并计算。"),
    paper("p14-forensic", "14级法医｜病理", "p14-forensic", "病理学题库1.pdf p10", [
      section("名词解释", [q("纤维蛋白样坏死", "necrosisOutcome"), q("桥本甲状腺炎", "thyroid"), q("Atheromatous plaque", "thrombosis"), q("Hydrocephalus", "brainEdema")]),
      section("简答/论述", [q("肝炎后肝硬化与血吸虫性肝纤维化", "schistoLiver"), q("胃溃疡病理特点和并发症", "gastricUlcer"), q("列举三个以上肠道溃疡疾病并述病理特点", "gastricUlcer"), q("癌前病变并举四例", "benignMalignant"), q("肾小球肾炎基本病理变化", "glomerulonephritis"), q("脑水肿与脑积水比较", "brainEdema"), q("肾病综合征举两例", "nephrotic"), q("透壁性心肌梗死并发症", "myocardialInfarct"), q("肺结核基本病变与转归", "tb"), q("慢支形态改变及发展为肺气肿和肺心病的机制", "chronicBronchitis")]),
    ]),

    paper("p13-clinical", "13级临五｜病理理论", "p13-clinical", "病理学题库1.pdf p9", [
      section("简答题", [q("炎症的局部表现和全身反应", "inflammation"), q("淋巴结肿大的病变及原因", "inflammation"), q("四种消化道疾病的常见病变", "gastricUlcer")]),
      section("病例分析", [q("女性少尿、血尿、氮质血症、高血压、蛋白尿、水肿，抗体实验阳性：诊断、光镜、电镜和预后。", "glomerulonephritis", [], "倾向急性弥漫性增生性肾小球肾炎；需按题目抗体类型及完整选项进一步确认。", "回忆信息不完整，保留诊断不确定性。")]),
    ]),
    paper("p13-eight", "13级临八｜病理", "p13-eight", "病理学题库1.pdf p10", [section("名词解释", [q("Miliary tuberculosis", "tb"), q("Chocolate cyst", "reproductive"), q("Crescent", "glomerulonephritis"), q("Lobule", "hepatitis"), q("Carcinoma in situ", "benignMalignant"), q("Piecemeal necrosis", "hepatitis")])]),

    paper("p12-eight", "12级临八上｜病理", "p12-eight", "病理学题库1.pdf p9", [
      section("名词解释", [q("Karyolysis", "necrosisOutcome"), q("Granuloma", "granuloma"), q("Organization", "thrombosis"), q("Hyalinosis", "necrosisOutcome"), q("Nutmeg liver", "cirrhosis"), q("Anaplasia", "benignMalignant"), q("Fistula", "inflammation"), q("Caseous necrosis", "tb"), q("Apoptosis", "necrosisOutcome"), q("Pyemia", "inflammation")]),
      section("问答题", [q("一期愈合和二期愈合", "necrosisOutcome"), q("死后血凝块与血栓", "thrombosis"), q("化生并举三例", "metaplasia"), q("脓肿的结局", "necrosisOutcome")]),
      section("病例分析", [q("结肠腺癌与肾贫血性梗死大体/镜下判断；形态学判断良恶性和转移。", "benignMalignant", [], "", "原回忆为图像病例，未提供图片。")]),
    ]),
    paper("p12-clinical", "12级临五｜病理理论", "p12-clinical", "病理学题库1.pdf p7–8", [
      section("选择题", [q("革囊胃的病变", "gastricUlcer", [], "弥漫浸润型胃癌"), q("肠上皮化生常见于何种疾病", "metaplasia", [], "慢性萎缩性胃炎"), q("绒毛膜癌错误描述", "reproductive", [], "间质内有丰富血管（错误）"), q("良性高血压脑出血主要原因", "brainEdema", [], "脑细小动脉微动脉瘤破裂"), q("大叶性肺炎的炎症类型", "pneumonia", [], "纤维蛋白性炎"), q("ARDS早期特征", "pneumonia", [], "肺透明膜形成"), q("乙脑特征性病变", "encephalitis"), q("不可逆性改变", "necrosisOutcome", [], "核碎裂"), q("DIC微血管内血栓", "thrombosis", [], "纤维蛋白性血栓"), q("结核肉芽肿特征性细胞", "tb", [], "类上皮细胞和朗汉斯巨细胞")]),
      section("名词解释", [q("Rheumatic body", "rheumatic"), q("Cor pulmonale", "chronicBronchitis"), q("COPD", "chronicBronchitis"), q("Foot process disease", "nephrotic"), q("Lacunae", "encephalitis"), q("CIN", "reproductive"), q("Ameboma", "schistoLiver"), q("Philadelphia chromosome", "hematology"), q("Ghon complex", "tb"), q("Carnification", "pneumonia")]),
      section("简答题", [q("血栓定义及混合血栓形成机制、形态", "thrombosis"), q("慢性支气管炎病理改变", "chronicBronchitis"), q("菌痢与结肠阿米巴病理比较", "schistoLiver")]),
      section("论述题", [q("终末期肾定义、三种来源及病理特征", "glomerulonephritis")]),
      section("病例分析", [q("反复肝炎多年，后出现黄疸、腹胀、呕血并死亡：尸检病变及临床病理联系。", "cirrhosis")]),
    ]),

    paper("p11-eight-lower", "11级临八下｜病理", "p11-eight-lower", "病理学题库1.pdf p6–7", [
      section("选择题", [q("高血压相关细动脉玻璃样变", "myocardialInfarct"), q("慢支相关肺气肿类型", "chronicBronchitis"), q("肺癌最常见组织学类型", "chronicBronchitis"), q("Goodpasture抗原", "glomerulonephritis"), q("CNS瘢痕由何种细胞形成", "encephalitis", [], "星形胶质细胞"), q("血吸虫卵主要沉积部位", "schistoLiver")]),
      section("名词解释", [q("Rheumatic body", "rheumatic"), q("Carnification", "pneumonia"), q("COPD", "chronicBronchitis"), q("Cor pulmonale", "chronicBronchitis"), q("Foot process disease", "nephrotic"), q("Philadelphia chromosome", "hematology"), q("CIN", "reproductive"), q("Lacunae", "encephalitis"), q("Ghon complex", "tb"), q("Ameboma", "schistoLiver")]),
      section("简答题", [q("透壁性心肌梗死并发症", "myocardialInfarct"), q("慢性支气管炎形态改变", "chronicBronchitis"), q("菌痢与阿米巴痢疾病理比较", "schistoLiver")]),
      section("论述题", [q("终末期肾并举三种来源", "glomerulonephritis")]),
      section("病例分析", [q("慢性肝炎进展至肝硬化、门脉高压并呕血死亡：尸检与临床病理联系。", "cirrhosis")]),
    ]),

    paper("p11-clinical-final", "11级临五期末｜病理", "p11-clinical-final", "病理学题库1.pdf p4", [
      section("名词解释", [q("Aneurysm", "myocardialInfarct"), q("Carnification", "pneumonia"), q("Crescent", "glomerulonephritis"), q("Interface hepatitis", "hepatitis"), q("Ph chromosome", "hematology"), q("Tuberculoma", "tb"), q("Eosinophilic abscess", "schistoLiver"), q("Rheumatic body", "rheumatic"), q("Foot process disease", "nephrotic"), q("Virchow node", "benignMalignant")]),
      section("简答题", [q("肠伤寒四期病理特征", "tb"), q("肾炎综合征并举例说明基础病变", "glomerulonephritis"), q("结节性肝硬化病理特点和临床病理联系", "cirrhosis"), q("原发性和继发性肺结核比较", "tb")]),
      section("论述题", [q("主动脉瓣关闭不全临床表现；举三种病因并述机制", "rheumatic")]),
    ]),

    paper("p11-upper", "11级临八上｜病理理论部分", "p11-upper", "病理学题库1.pdf p5–6", [
      section("选择题", [q("适应不包括哪一项", "metaplasia", [], "变性"), q("空泡变性为何种物质积聚", "necrosisOutcome", [], "水"), q("凝固性坏死可发生于哪个器官", "necrosisOutcome"), q("凋亡最终执行者", "necrosisOutcome", [], "caspase-3等"), q("白色血栓主要成分", "thrombosis", [], "血小板"), q("羊水栓塞诊断依据", "thrombosis", [], "肺小血管内见羊水成分")]),
      section("名词解释", [q("Hyalinosis", "necrosisOutcome"), q("Caseous necrosis", "tb"), q("Granulation tissue", "necrosisOutcome"), q("Congestion", "thrombosis"), q("Nutmeg liver", "cirrhosis"), q("Embolism", "thrombosis"), q("Pyemia", "inflammation"), q("Precancerous disorder", "benignMalignant"), q("Infarction", "hemorrhagicInfarct"), q("Metastasis", "benignMalignant")]),
      section("简答题", [q("化脓性炎定义并举四例", "inflammation"), q("良、恶性肿瘤比较", "benignMalignant"), q("静脉血栓形成过程、结构和成分", "thrombosis"), q("化生并举三例", "metaplasia"), q("出血性梗死发生条件", "hemorrhagicInfarct")]),
      section("论述题", [q("创伤愈合；一期与二期愈合", "necrosisOutcome")]),
    ], "扫描页同时包含实验识图题，本数据只保留理论部分。"),

    paper("p10-eight-lower", "10级临八下｜病理", "p10-eight-lower", "病理学题库1.pdf p5", [
      section("名词解释", [q("Ph chromosome", "hematology"), q("Crescent", "glomerulonephritis"), q("Virchow lymph node", "benignMalignant"), q("Foot process disease", "nephrotic"), q("Interface hepatitis", "hepatitis"), q("Aneurysm", "myocardialInfarct")]),
      section("简答题", [q("Typhoid fever 四期病理变化", "tb"), q("肾病综合征举三种疾病", "nephrotic"), q("干线型肝硬化与肝炎后肝硬化", "schistoLiver"), q("肉芽肿定义并举三种肉芽肿性炎", "granuloma")]),
      section("论述题", [q("主动脉瓣关闭不全并举三种病因", "rheumatic")]),
    ]),
    paper("p10-eight-upper", "10级临八上｜病理", "p10-eight-upper", "病理学题库1.pdf p4", [
      section("简答题", [q("良性和恶性肿瘤区别", "benignMalignant"), q("静脉血栓形成过程和成分", "thrombosis"), q("肺栓塞的结局", "thrombosis"), q("坏疽分类", "necrosisOutcome"), q("举四种纤维蛋白性炎", "inflammation")]),
      section("论述题", [q("出血性炎和出血性梗死鉴别", "hemorrhagicInfarct")]),
    ]),
    paper("p10-clinical-makeup", "10级临五缓考｜病理", "p10-clinical-makeup", "病理学题库1.pdf p4", [
      section("名词解释", [q("Nutmeg liver", "cirrhosis"), q("Carnification", "pneumonia"), q("Atheroma", "thrombosis"), q("Metaplasia", "metaplasia"), q("Carcinoma in situ", "benignMalignant"), q("Septicemia", "inflammation"), q("Thrombosis", "thrombosis"), q("Phlegmon", "inflammation"), q("Organization", "thrombosis"), q("Pseudolobule", "cirrhosis")]),
      section("简答题", [q("玻璃样变概念和类型", "necrosisOutcome"), q("透壁性心肌梗死病理特点", "myocardialInfarct"), q("肾小球肾炎和肾盂肾炎比较", "pyelonephritis")]),
      section("论述题", [q("举四种肉芽肿性炎并述病理特点", "granuloma")]),
    ]),
    paper("p10-clinical-final", "10级临五期末｜病理", "p10-clinical-final", "病理学题库1.pdf p3–4", [
      section("名词解释", [q("Eosinophilic abscess", "schistoLiver"), q("Pyemia", "inflammation"), q("Carnification", "pneumonia"), q("Krukenberg tumor", "benignMalignant"), q("Gangrene", "necrosisOutcome"), q("Pseudolobule", "cirrhosis"), q("Red neuron", "encephalitis"), q("K-W nodule", "cirrhosis"), q("R-S cell", "hematology"), q("Spike", "nephrotic")]),
      section("简答/论述", [q("良、恶性肿瘤诊断鉴别", "benignMalignant"), q("急性风湿性心脏病病理特点", "rheumatic"), q("大叶性和小叶性肺炎比较", "pneumonia"), q("举四种胃肠道溃疡并述特点", "gastricUlcer")]),
    ]),
    paper("p09-clinical", "09级临五期末｜病理", "p09-clinical", "病理学题库1.pdf p3", [
      section("名词解释", [q("Rheumatic body", "rheumatic"), q("Carnification", "pneumonia"), q("Crescent", "glomerulonephritis"), q("LE cell", "inflammation"), q("Gumma", "tb"), q("Ghon complex", "tb"), q("Eosinophilic abscess", "schistoLiver"), q("Transient ischemic attack", "encephalitis"), q("Intestinal metaplasia", "metaplasia"), q("Emphysema", "chronicBronchitis")]),
      section("简答题", [q("导致肺明显纤维化的疾病举五例", "chronicBronchitis"), q("干细胞坏死类型（原回忆疑有OCR错误）", "", [], "", "题干存疑"), q("心肌梗死并发症", "myocardialInfarct"), q("玻璃样变定义和类型", "necrosisOutcome")]),
      section("论述题", [q("导致便血的疾病举三例", "gastricUlcer"), q("结核病病理变化和转归", "tb")]),
    ]),
    paper("p08-eight", "08级临八｜病理", "p08-eight", "病理学题库1.pdf p3", [
      section("名词解释", [q("Ameboma", "schistoLiver"), q("Tuberculoma", "tb"), q("Nephritic syndrome", "glomerulonephritis"), q("Crescent", "glomerulonephritis"), q("Waterhouse-Friderichsen syndrome", "encephalitis"), q("Immune complex disease", "inflammation"), q("Cor villosum", "rheumatic"), q("Hashimoto thyroiditis", "thyroid"), q("Ischemic encephalopathy", "encephalitis"), q("Atherosclerosis", "thrombosis")]),
      section("简答/论述", [q("消化道癌常见病理类型和特征", "benignMalignant"), q("慢性肾小球肾炎与慢性肾盂肾炎", "pyelonephritis"), q("慢性纤维空洞型肺结核大体改变", "tb"), q("干线型肝硬化与肝炎后肝硬化比较", "schistoLiver"), q("缺血性脑病病理改变", "encephalitis"), q("慢支病变及导致肺气肿和肺心病机制", "chronicBronchitis")]),
    ]),
    paper("p07-eight", "07级临八｜病理下", "p07-eight", "病理学题库1.pdf p3", [
      section("名词解释", [q("Angina pectoris", "myocardialInfarct"), q("Hematoxylin body", "inflammation"), q("Nephritic syndrome", "glomerulonephritis"), q("Eosinophilic abscess", "schistoLiver"), q("Cor pulmonale", "chronicBronchitis"), q("Cirrhosis", "cirrhosis"), q("Chancre", "tb"), q("Neurophagia", "encephalitis"), q("CIN", "reproductive"), q("Tuberculoma", "tb")]),
      section("简答题", [q("透壁性心肌梗死并发症", "myocardialInfarct"), q("矽肺并发症", "chronicBronchitis"), q("肾病综合征定义并举例", "nephrotic"), q("原发性与继发性肺结核", "tb")]),
      section("论述题", [q("干线型与肝炎后肝硬化", "schistoLiver"), q("慢支病变及导致肺心病和肺气肿的机制", "chronicBronchitis")]),
    ]),
    paper("p05-eight", "05级临八｜病理", "p05-eight", "病理学题库1.pdf p1–2", [
      section("选择题", [q("血吸虫卵主要沉积部位", "schistoLiver"), q("Hodgkin淋巴瘤预后最好亚型", "hematology"), q("动脉粥样硬化非危险因素", "thrombosis", [], "肿瘤"), q("假结核结节见于何病", "schistoLiver"), q("IgA肾病免疫复合物沉积部位", "glomerulonephritis", [], "系膜区"), q("Mallory小体常见于何种肝硬化", "hepatitis", [], "酒精性肝硬化"), q("神经元噬现象涉及何种细胞", "encephalitis", [], "小胶质细胞")]),
      section("名词解释", [q("Atheroma", "thrombosis"), q("Carnification", "pneumonia"), q("Bridging necrosis", "hepatitis"), q("Foot process disease", "nephrotic"), q("Lupus erythematosus body", "inflammation"), q("Ph chromosome", "hematology"), q("CIN", "reproductive"), q("Sieve-like softening", "encephalitis"), q("Eosinophilic abscess", "schistoLiver"), q("Chancre", "tb")]),
      section("简答/论述", [q("肾病综合征举三例", "nephrotic"), q("透壁性心肌梗死并发症", "myocardialInfarct"), q("结节性肝硬化病因、机制、病变和临床", "cirrhosis")]),
    ]),
    paper("p04-eight", "04级临八｜病理", "p04-eight", "病理学题库1.pdf p1", [section("名词解释", [q("Metaplasia", "metaplasia"), q("Organization", "thrombosis"), q("Thrombosis", "thrombosis"), q("Granuloma", "granuloma"), q("Carcinoma in situ", "benignMalignant"), q("Aschoff body", "rheumatic"), q("Carnification", "pneumonia"), q("Krukenberg tumor", "benignMalignant"), q("Pipe-stem fibrosis", "schistoLiver"), q("Bridging necrosis", "hepatitis")])]),
    paper("p04-clinical", "04级临五｜病理", "p04-clinical", "病理学题库1.pdf p1", [section("名词解释", [q("Carnification", "pneumonia"), q("Gumma", "tb"), q("Apoptosis", "necrosisOutcome"), q("Karyolysis", "necrosisOutcome"), q("Metaplasia", "metaplasia"), q("Ventricular aneurysm", "myocardialInfarct"), q("Sarcoma", "benignMalignant"), q("Thrombosis", "thrombosis")]), section("简答/论述", [q("炎性渗出液的作用", "inflammation"), q("风湿性与细菌性心内膜炎赘生物比较", "rheumatic"), q("葡萄胎病变特点", "reproductive"), q("静脉淤血定义、后果并举例", "thrombosis"), q("结节性肝硬化与血吸虫性肝硬化", "schistoLiver")])]),
    paper("p03", "03级｜病理", "p03", "病理学题库1.pdf p1", [section("问答题", [q("大叶性与小叶性肺炎比较", "pneumonia"), q("胃溃疡与溃疡型胃癌比较", "gastricUlcer"), q("淤血及其后果", "thrombosis")])]),
    paper("p02", "02级｜病理", "p02", "病理学题库1.pdf p1", [section("名词解释", [q("Fistula", "inflammation"), q("End-stage kidney", "glomerulonephritis"), q("Mural thrombus", "thrombosis"), q("Granulation tissue", "necrosisOutcome"), q("Intestinal metaplasia", "metaplasia"), q("Lupus cell", "inflammation"), q("Vegetation", "rheumatic")]), section("问答题", [q("栓子及运行途径", "thrombosis"), q("结节性肝硬化与血吸虫性肝硬化", "schistoLiver"), q("二尖瓣狭窄尸检病变", "rheumatic")])]),
    paper("p01", "01级基础｜病理", "p01", "病理学题库1.pdf p1", [section("问答题", [q("良性与恶性肿瘤诊断标准", "benignMalignant"), q("成人呼吸窘迫综合征发病机制和病理变化", "pneumonia"), q("急性心肌梗死病理变化和常见并发症", "myocardialInfarct")])]),
  ];

  const answerSeeds = [
    { id: "hf-benign", type: "简答题", topic: "benignMalignant", title: "良性肿瘤与恶性肿瘤的鉴别", answer: ["分化与异型性：良性分化好、异型性小；恶性分化差、异型性明显。", "核分裂：良性少且正常；恶性多，可见病理性核分裂。", "生长：良性缓慢、膨胀/外生；恶性较快、浸润/外生。", "边界：良性较清楚，常有包膜；恶性边界不清。", "转移与复发：良性不转移、切除后少复发；恶性可转移、易复发。", "对机体：良性以压迫阻塞为主；恶性破坏大，可致出血、坏死、恶病质。"] },
    { id: "hf-mi", type: "简答题", topic: "myocardialInfarct", title: "透壁性心肌梗死的常见并发症", answer: ["心力衰竭与心源性休克。", "心律失常，可导致猝死。", "心脏破裂：游离壁破裂致心包填塞、室间隔破裂、乳头肌断裂。", "室壁瘤形成、附壁血栓及体循环栓塞。", "急性/慢性心包炎，后期可形成心肌瘢痕。"] },
    { id: "hf-nephrotic", type: "简答题", topic: "nephrotic", title: "肾病综合征定义并举例", answer: ["临床表现为大量蛋白尿、低白蛋白血症、全身性水肿和高脂血症/脂质尿。", "常见疾病：微小病变性肾小球病、膜性肾病、膜增生性肾小球肾炎。", "还可见局灶节段性肾小球硬化、系膜增生性肾小球肾炎。"] },
    { id: "hf-chronic", type: "简答题", topic: "chronicBronchitis", title: "慢支如何发展为肺气肿和肺源性心脏病", answer: ["慢支时黏液-纤毛系统受损、杯状细胞增多、黏膜下腺增生，管壁慢性炎症和纤维化导致小气道阻塞。", "阻塞造成呼气性通气障碍、肺泡过度充气；炎症和蛋白酶作用破坏肺泡隔，形成肺气肿。", "长期缺氧引起肺小动脉痉挛、内膜增厚；肺毛细血管床减少，肺血管阻力升高。", "肺动脉高压使右心室肥厚、扩张，最终形成肺源性心脏病。"] },
    { id: "hf-cirrhosis", type: "简答题", topic: "schistoLiver", title: "肝炎后肝硬化与血吸虫性肝纤维化比较", answer: ["肝炎后肝硬化：肝细胞反复坏死，弥漫纤维隔形成并分割肝小叶，出现假小叶；兼有肝功能障碍和门脉高压。", "血吸虫性肝纤维化：虫卵主要沉积于门静脉分支，形成虫卵肉芽肿和干线型纤维化；肝小叶结构和肝细胞相对保存。", "血吸虫病门脉高压突出，而肝功能损害相对较轻。"] },
    { id: "hf-ulcer", type: "简答题", topic: "gastricUlcer", title: "胃溃疡的病理特点与并发症", answer: ["多位于胃小弯胃窦部，通常单发，圆或椭圆，直径多小于2 cm。", "边缘整齐如刀切，底部平坦洁净，深达肌层甚至浆膜；黏膜皱襞放射状集中。", "镜下底部由内向外为渗出坏死层、炎症层、肉芽组织层和瘢痕层。", "并发症：出血、穿孔、幽门梗阻；癌变极少见。"] },
    { id: "hf-tb", type: "简答题", topic: "tb", title: "原发性与继发性肺结核比较", answer: ["原发性多见于儿童或初次感染者，病灶多位于肺上叶下部或下叶上部近胸膜处，形成原发综合征。", "继发性多见于成人，常为再感染或复燃，病灶多位于肺尖，局部反应强、干酪样坏死和空洞常见。", "原发性更易淋巴道、血道播散；继发性更易支气管播散并形成慢性纤维空洞型肺结核。"] },
    { id: "hf-rheumatic", type: "简答题", topic: "rheumatic", title: "风湿性与感染性心内膜炎赘生物比较", answer: ["风湿性：赘生物小、灰白、串珠状，附着牢固，沿瓣膜闭锁缘分布；主要由血小板和纤维蛋白组成，细菌少见。", "感染性：赘生物大而脆、污秽，易脱落；含纤维蛋白、坏死组织、炎细胞和菌落，可破坏瓣膜并形成感染性栓子。"] },
    { id: "hf-gn", type: "简答题", topic: "pyelonephritis", title: "肾小球肾炎与肾盂肾炎辨析", answer: ["肾小球肾炎多为免疫介导，主要累及肾小球；常见血尿、蛋白尿、水肿、高血压和肾功能异常。", "肾盂肾炎为细菌感染，多由大肠杆菌上行感染，主要累及肾盂、肾间质和肾小管；常见发热、腰痛、脓尿及尿路刺激征。", "慢性肾小球肾炎多为双肾对称细颗粒固缩；慢性肾盂肾炎多不对称瘢痕、肾盂肾盏变形。"] },
    { id: "hf-necrosis", type: "简答题", topic: "necrosisOutcome", title: "坏死的结局", answer: ["溶解吸收：水解酶液化并由巨噬细胞清除，可形成囊腔。", "分离排出：形成糜烂、溃疡、窦道、瘘管或空洞。", "机化与包裹：肉芽组织长入并被瘢痕组织取代；过大者可被纤维组织包裹。", "钙化：坏死组织发生营养不良性钙化。"] },
    { id: "hf-brain", type: "简答题", topic: "brainEdema", title: "脑水肿与脑积水", answer: ["脑水肿是脑组织内水分增加，可位于细胞内或细胞外，脑体积增大、脑回变宽、脑沟变浅，可致颅内压升高和脑疝。", "脑积水是脑脊液生成、循环或吸收障碍导致脑室系统异常扩张；严重时脑组织受压变薄、萎缩。", "两者均可导致颅内压升高，但液体所在部位和形成机制不同。"] },
    { id: "hf-hepatitis-case", type: "病例分析", topic: "hepatitis", title: "乙肝迁延后的肝穿刺判断", answer: ["病程超过半年并有转氨酶反复波动，首先考虑慢性病毒性肝炎。", "轻者肝小叶结构尚保存，门管区淋巴细胞浸润并可见界面炎/碎片状坏死。", "较重者坏死明显，可见桥接坏死、纤维间隔形成，并逐步发展为肝硬化。"] },
    { id: "hf-cirrhosis-case", type: "病例分析", topic: "cirrhosis", title: "慢性肝炎—肝硬化—门脉高压—呕血", answer: ["诊断链：慢性病毒性肝炎 → 肝硬化 → 门静脉高压。", "病理：肝细胞变性坏死、结节状再生、弥漫纤维隔和假小叶形成；并见脾大、腹水和侧支循环开放。", "呕血机制：门静脉压力升高使食管胃底静脉曲张，曲张静脉壁薄、受食物损伤或压力骤增后破裂出血。", "肝内结节若影像可疑，应结合AFP和增强影像排除肝细胞癌。"] },
    { id: "hf-fat-case", type: "病例分析", topic: "thrombosis", title: "长骨骨折后的脂肪栓塞综合征", answer: ["长骨骨折使骨髓脂肪进入破裂静脉，形成脂肪栓子。", "脂滴阻塞肺微循环并产生游离脂肪酸毒性，可导致低氧和呼吸衰竭；进入体循环可累及脑，出现神经症状。", "尸检小血管内油红O阳性物支持诊断。"] },
    { id: "hf-carnification", type: "名词解释", topic: "pneumonia", title: "Carnification｜肺肉质变", answer: ["大叶性肺炎肺泡腔内的纤维蛋白性渗出物未能完全溶解吸收，由肺泡壁或细支气管旁肉芽组织长入并机化，使病变肺组织呈褐色肉样、质韧。"] },
    { id: "hf-rheumatic-body", type: "名词解释", topic: "rheumatic", title: "Aschoff body｜风湿小体", answer: ["风湿病增生期的特征性肉芽肿样病灶，中心为纤维素样坏死，周围聚集Aschoff细胞、Anitschkow细胞及淋巴细胞，多见于心肌间质。"] },
    { id: "hf-foot", type: "名词解释", topic: "nephrotic", title: "Foot process disease｜足突病", answer: ["即微小病变性肾小球病。光镜下肾小球基本正常，免疫荧光多阴性，电镜见足细胞足突广泛融合或消失；多见于儿童并表现为肾病综合征。"] },
    { id: "hf-ph", type: "名词解释", topic: "hematology", title: "Philadelphia chromosome｜费城染色体", answer: ["由t(9;22)形成的缩短22号染色体，产生BCR-ABL融合基因及持续活化的酪氨酸激酶，是慢性髓性白血病的特征性分子异常。"] },
    { id: "hf-eosin", type: "名词解释", topic: "schistoLiver", title: "Eosinophilic abscess｜嗜酸性脓肿", answer: ["急性血吸虫虫卵结节中，虫卵周围发生坏死并有大量嗜酸性粒细胞浸润，外观类似脓肿，故称嗜酸性脓肿。"] },
    { id: "hf-tuberculoma", type: "名词解释", topic: "tb", title: "Tuberculoma｜结核球", answer: ["继发性肺结核的一种形态，通常为直径2–5 cm、境界清楚的球形干酪样坏死灶，周围有纤维包裹，可由浸润型病灶纤维包裹或空洞引流支气管阻塞后形成。"] },
    { id: "hf-bridge", type: "名词解释", topic: "hepatitis", title: "Bridging necrosis｜桥接坏死", answer: ["较重慢性病毒性肝炎中，两个中央静脉、两个门管区或中央静脉与门管区之间的肝细胞坏死相互连接成带状。"] },
    { id: "hf-sieve", type: "名词解释", topic: "encephalitis", title: "Sieve-like softening foci｜筛状软化灶", answer: ["乙型脑炎严重时神经组织发生灶性液化性坏死，形成质地疏松、染色淡、镂空筛网状的小软化灶，具有一定诊断意义。"] },
    { id: "hf-cirrhosis-term", type: "名词解释", topic: "cirrhosis", title: "Cirrhosis｜肝硬化", answer: ["多种慢性肝损伤的终末阶段，以肝细胞弥漫性变性坏死、结节状再生、弥漫纤维组织增生和假小叶形成导致肝小叶结构及血液循环重建为特征。"] },
    { id: "hf-ventricular", type: "名词解释", topic: "myocardialInfarct", title: "Ventricular aneurysm｜室壁瘤", answer: ["透壁性心肌梗死后，坏死心肌被瘢痕组织取代，局部心室壁在心腔压力作用下向外膨出形成的局限性囊状扩张，可并发附壁血栓、心衰和心律失常。"] },
    { id: "hf-neurophagia", type: "名词解释", topic: "encephalitis", title: "Neurophagia｜噬神经元现象", answer: ["坏死神经元周围聚集小胶质细胞，并由其吞噬清除坏死神经元的现象，常见于病毒性脑炎。"] },
    { id: "hf-pipe", type: "名词解释", topic: "schistoLiver", title: "Pipe-stem fibrosis｜干线型肝纤维化", answer: ["慢性血吸虫病时，虫卵沿门静脉分支沉积引起肉芽肿和显著纤维化，使门管区纤维组织增宽如烟斗干；肝小叶结构相对保存而门脉高压突出。"] },
    { id: "hf-spike", type: "名词解释", topic: "nephrotic", title: "Spike｜钉突", answer: ["膜性肾病时，上皮下免疫复合物沉积之间的肾小球基膜反应性增生，在银染下形成垂直于基膜的钉状突起。"] },
    { id: "hf-choice-white", type: "选择题", topic: "thrombosis", title: "白色血栓的主要成分", answer: ["答案：血小板。白色血栓主要见于血流较快处，由血小板小梁和少量纤维蛋白构成。"] },
    { id: "hf-choice-linear", type: "选择题", topic: "glomerulonephritis", title: "肾小球免疫荧光线性分布", answer: ["答案：抗GBM抗体型新月体性肾小球肾炎；合并肺出血时称Goodpasture综合征。"] },
    { id: "hf-choice-intussusception", type: "选择题", topic: "hemorrhagicInfarct", title: "肠套叠/睾丸扭转的梗死类型", answer: ["答案：出血性梗死。静脉回流先受阻、组织疏松且已有淤血，动脉供血仍可短暂进入。"] },
    { id: "hf-choice-lobar", type: "选择题", topic: "pneumonia", title: "大叶性肺炎的炎症性质", answer: ["答案：纤维蛋白性炎，以肺泡腔大量纤维蛋白渗出为主要特征。"] },
    { id: "hf-choice-astro", type: "选择题", topic: "encephalitis", title: "中枢神经系统瘢痕由何种细胞形成", answer: ["答案：星形胶质细胞。其增生形成胶质瘢痕。"] },
    { id: "hf-choice-cml", type: "选择题", topic: "hematology", title: "Ph染色体最典型见于", answer: ["答案：慢性髓性白血病（CML）。"] },
    { id: "hf-metaplasia", type: "名词解释", topic: "metaplasia", title: "Metaplasia｜化生", answer: ["一种已分化成熟的细胞类型被另一种已分化成熟细胞类型取代的适应性改变。", "通常由局部干细胞或未分化间叶细胞重编程所致，并非成熟细胞直接转变。", "长期刺激下可增加异型增生和恶性肿瘤风险；如慢性支气管炎时柱状上皮鳞状化生。"] },
    { id: "hf-thrombosis-term", type: "名词解释", topic: "thrombosis", title: "Thrombosis｜血栓形成", answer: ["活体心血管内，血液成分发生析出、黏集或凝固形成固体质块的过程称血栓形成，所形成的固体质块称血栓。", "形成条件为心血管内皮损伤、血流状态改变和血液凝固性增高。"] },
    { id: "hf-organization", type: "名词解释", topic: "thrombosis", title: "Organization｜机化", answer: ["坏死组织、血栓或其他异物不能完全溶解吸收时，由周围新生毛细血管和成纤维细胞组成的肉芽组织长入，逐渐替代为瘢痕组织的过程。"] },
    { id: "hf-recanalization", type: "名词解释", topic: "thrombosis", title: "Recanalization｜再通", answer: ["血栓机化过程中，血栓内出现裂隙并由内皮细胞覆盖，形成相互吻合的新生血管，使被阻塞血管部分恢复血流的现象。"] },
    { id: "hf-granuloma", type: "名词解释", topic: "granuloma", title: "Granuloma｜肉芽肿", answer: ["由巨噬细胞及其衍生的类上皮细胞、异物巨细胞或Langhans巨细胞局灶聚集形成的境界清楚的结节状病灶。", "常见于结核、麻风、梅毒、血吸虫病及异物反应；应与肉芽组织区分。"] },
    { id: "hf-cis", type: "名词解释", topic: "benignMalignant", title: "Carcinoma in situ｜原位癌", answer: ["异型增生的癌细胞累及上皮全层，但尚未突破基底膜向间质浸润的上皮性恶性肿瘤。", "及时完整切除通常预后良好；突破基底膜后成为浸润癌。"] },
    { id: "hf-anaplasia", type: "名词解释", topic: "benignMalignant", title: "Anaplasia｜间变", answer: ["恶性肿瘤细胞缺乏分化、异型性显著的状态，表现为细胞和细胞核多形性、核深染、核质比增大及病理性核分裂象。", "间变程度通常与肿瘤恶性程度相关。"] },
    { id: "hf-precancer", type: "名词解释", topic: "benignMalignant", title: "Precancerous lesion｜癌前病变", answer: ["某些具有癌变潜在可能性的良性病变，若长期存在，部分病例可发展为癌，但并非必然癌变。", "常见例子包括黏膜白斑、慢性萎缩性胃炎、溃疡性结肠炎、乳腺非典型增生等。"] },
    { id: "hf-emphysema", type: "名词解释", topic: "chronicBronchitis", title: "Emphysema｜肺气肿", answer: ["终末细支气管远端肺组织持续性过度充气、膨胀，并伴肺泡壁破坏而无明显纤维化。", "可导致肺弹性回缩力降低、呼气性通气障碍，晚期可并发肺动脉高压和肺源性心脏病。"] },
    { id: "hf-heart-failure-cell", type: "名词解释", topic: "chronicBronchitis", title: "Heart failure cell｜心衰细胞", answer: ["慢性肺淤血时，肺泡腔内吞噬含铁血黄素的巨噬细胞；常见于左心衰竭，故名心衰细胞。"] },
    { id: "hf-mallory", type: "名词解释", topic: "hepatitis", title: "Mallory body｜Mallory小体", answer: ["肝细胞胞质内由受损角蛋白中间丝聚集形成的不规则嗜酸性团块，常见于酒精性肝炎和酒精性肝硬化，也可见于其他慢性肝损伤。"] },
    { id: "hf-lupus", type: "名词解释", topic: "inflammation", title: "Lupus cell｜狼疮细胞", answer: ["吞噬了狼疮小体（苏木素小体）的中性粒细胞或巨噬细胞。", "狼疮小体为受损细胞核与抗核抗体结合后形成的均质嗜酸性物质。"] },
    { id: "hf-cin", type: "名词解释", topic: "reproductive", title: "CIN｜宫颈上皮内瘤变", answer: ["宫颈鳞状上皮内不同程度异型增生的癌前病变，病变局限于上皮内、基底膜完整。", "按异型细胞累及上皮厚度分为CIN1、CIN2和CIN3；CIN3包括重度异型增生和原位癌。"] },
    { id: "hf-crescent", type: "名词解释", topic: "glomerulonephritis", title: "Crescent｜新月体", answer: ["肾小球严重损伤时，壁层上皮细胞增生并伴单核细胞渗出，在肾小囊内形成新月形细胞团。", "大量肾小球出现新月体提示快速进展性肾小球肾炎。"] },
    { id: "hf-ghon", type: "名词解释", topic: "tb", title: "Ghon complex｜原发综合征", answer: ["肺原发结核病时，肺原发病灶、结核性淋巴管炎和肺门淋巴结结核三者合称原发综合征。"] },
    { id: "hf-caseous", type: "名词解释", topic: "tb", title: "Caseous necrosis｜干酪样坏死", answer: ["凝固性坏死的特殊类型，坏死组织呈淡黄色、细腻、均质、质软似干酪；镜下为无结构颗粒状红染物，常见于结核病。"] },
    { id: "hf-lacuna", type: "名词解释", topic: "encephalitis", title: "Lacunae｜腔隙", answer: ["脑深部小动脉病变导致的小梗死灶液化后形成的微小囊腔，直径通常小于1.5 cm，多见于基底节、内囊、丘脑和脑桥。"] },
    { id: "hf-satellite", type: "名词解释", topic: "encephalitis", title: "Satellitosis｜卫星现象", answer: ["受损神经元胞体周围聚集5个或更多少突胶质细胞的现象，提示神经元损伤，常见于病毒性脑炎等病变。"] },
    { id: "hf-pseudolobule", type: "名词解释", topic: "cirrhosis", title: "Pseudolobule｜假小叶", answer: ["肝硬化时，增生纤维隔分割并包绕原有肝小叶及再生肝细胞结节，形成中央静脉缺如、偏位或多个的异常肝细胞团。"] },
    { id: "hf-healing", type: "简答题", topic: "necrosisOutcome", title: "一期愈合与二期愈合比较", answer: ["一期愈合见于组织缺损少、创缘整齐、无感染且对合严密的伤口；炎症轻、肉芽组织少、愈合快、瘢痕小。", "二期愈合见于缺损大、创缘不整、污染或感染的伤口；炎症明显、肉芽组织多、愈合慢、瘢痕大。", "二期愈合常伴明显伤口收缩，主要由肌成纤维细胞完成。"] },
    { id: "hf-hyalinosis", type: "简答题", topic: "necrosisOutcome", title: "玻璃样变的概念和类型", answer: ["玻璃样变是细胞内、纤维结缔组织或细动脉壁出现均质、红染、半透明蛋白样物质。", "细胞内玻璃样变：如肾小管上皮蛋白吸收小滴、浆细胞Russell小体和酒精性肝病Mallory小体。", "纤维结缔组织玻璃样变：见于瘢痕、浆膜粘连及动脉粥样硬化斑块。", "细动脉壁玻璃样变：见于缓进型高血压和糖尿病。"] },
    { id: "hf-ameboma", type: "名词解释", topic: "schistoLiver", title: "Ameboma｜阿米巴肿", answer: ["慢性肠阿米巴病时，肠壁肉芽组织过度增生形成的局限性肿块，常见于盲肠、升结肠，可导致肠腔狭窄并需与肠癌鉴别。"] },
    { id: "hf-cor-pulmonale", type: "简答题", topic: "chronicBronchitis", title: "Cor pulmonale｜肺源性心脏病", answer: ["由肺组织、肺血管或胸廓慢性病变引起肺循环阻力升高、肺动脉高压，继而导致右心室肥厚和/或扩张的心脏病。", "常见病因：慢阻肺最常见，也可见于支气管扩张、肺纤维化、肺血管病和严重胸廓畸形。", "肺部病变导致缺氧性肺小动脉收缩、血管壁重构及肺毛细血管床减少。", "肺动脉高压使右心室肥厚，失代偿后扩张并出现右心衰竭。"] },
    { id: "hf-nutmeg", type: "名词解释", topic: "cirrhosis", title: "Nutmeg liver｜槟榔肝", answer: ["慢性肝淤血时，肝小叶中央区淤血、出血并伴肝细胞萎缩或坏死，周边区肝细胞脂肪变，切面呈红黄相间似槟榔纹理，称槟榔肝。"] },
    { id: "hf-pyemia", type: "名词解释", topic: "inflammation", title: "Pyemia｜脓毒败血症", answer: ["化脓菌由原发灶间歇进入血流并随血流播散，在全身多个器官形成多发性栓塞性脓肿的全身感染状态。"] },
    { id: "hf-hemorrhagic-conditions", type: "简答题", topic: "hemorrhagicInfarct", title: "出血性梗死的发生条件", answer: ["严重静脉淤血：静脉回流先受阻，局部已有明显淤血。", "组织结构疏松：如肺和肠，出血可进入坏死组织。", "具有双重血液供应或丰富吻合支：侧支血流可进入坏死区。", "常见于肺、肠及卵巢或睾丸扭转。"] },
    { id: "hf-suppurative", type: "简答题", topic: "inflammation", title: "化脓性炎的定义、类型和举例", answer: ["以中性粒细胞大量渗出并伴组织液化坏死、脓液形成为特征的炎症。", "表面化脓和积脓：如化脓性支气管炎、脓胸。", "蜂窝织炎：疏松组织内弥漫性化脓，如蜂窝织炎性阑尾炎。", "脓肿：局限性化脓性炎，如疖、痈、肝脓肿。"] },
    { id: "hf-schisto-site", type: "选择题", topic: "schistoLiver", title: "血吸虫卵主要沉积部位", answer: ["答案：门静脉系统分支，尤其结肠壁和肝内门静脉小分支。虫卵随门静脉血流进入肝，诱发虫卵肉芽肿和干线型纤维化。"] },
    { id: "hf-aneurysm", type: "名词解释", topic: "myocardialInfarct", title: "Aneurysm｜动脉瘤", answer: ["动脉壁局限性或弥漫性异常扩张形成的囊状或梭形病变，可因动脉粥样硬化、高血压、感染或先天缺陷导致。", "主要危险为破裂出血、附壁血栓形成及远端栓塞。"] },
    { id: "hf-apoptosis", type: "名词解释", topic: "necrosisOutcome", title: "Apoptosis｜凋亡", answer: ["由基因调控、caspase介导的单个或小群细胞主动性死亡。", "细胞皱缩、染色质浓缩并形成凋亡小体，迅速被吞噬，通常不引起明显炎症反应。"] },
    { id: "hf-atheroma", type: "名词解释", topic: "thrombosis", title: "Atheroma｜粥样斑块", answer: ["动脉粥样硬化的基本病变，由表面纤维帽和深部粥样坏死物组成；坏死物内含脂质、胆固醇结晶、泡沫细胞碎屑及钙盐。"] },
    { id: "hf-atrophy", type: "名词解释", topic: "necrosisOutcome", title: "Atrophy｜萎缩", answer: ["发育正常的器官、组织或细胞体积缩小，可伴细胞数目减少。", "常见原因包括营养不良、失用、去神经、压迫、内分泌刺激减弱及老化。"] },
    { id: "hf-chancre", type: "名词解释", topic: "tb", title: "Chancre｜硬下疳", answer: ["一期梅毒在螺旋体侵入部位形成的无痛性、境界清楚、基底较硬的溃疡；局部富含梅毒螺旋体，并伴区域淋巴结肿大。"] },
    { id: "hf-copd", type: "名词解释", topic: "chronicBronchitis", title: "COPD｜慢性阻塞性肺疾病", answer: ["以持续性、通常进行性且不完全可逆的气流受限为特征的慢性肺疾病，主要包括慢性支气管炎和肺气肿。", "长期可导致低氧、肺动脉高压及肺源性心脏病。"] },
    { id: "hf-fistula", type: "名词解释", topic: "inflammation", title: "Fistula｜瘘管", answer: ["连接两个有腔器官，或连接有腔器官与体表的异常病理性管道，常由脓肿穿破或慢性炎症形成；仅一端通向体表者称窦道。"] },
    { id: "hf-gangrene", type: "名词解释", topic: "necrosisOutcome", title: "Gangrene｜坏疽", answer: ["较大范围组织坏死并继发腐败菌感染而呈黑色、暗绿色等特殊形态的病变。", "分为干性坏疽、湿性坏疽和气性坏疽。"] },
    { id: "hf-granulation", type: "名词解释", topic: "necrosisOutcome", title: "Granulation tissue｜肉芽组织", answer: ["由新生毛细血管、增生的成纤维细胞和多种炎细胞构成的幼稚结缔组织，肉眼呈鲜红、颗粒状、柔软湿润。", "具有抗感染、填补缺损、机化异物和形成瘢痕等作用。"] },
    { id: "hf-gumma", type: "名词解释", topic: "tb", title: "Gumma｜树胶样肿", answer: ["三期梅毒的特征性肉芽肿性病变，中央为树胶样坏死，周围有肉芽组织及大量浆细胞浸润，可见闭塞性小动脉内膜炎。"] },
    { id: "hf-interface", type: "名词解释", topic: "hepatitis", title: "Interface hepatitis｜界面性肝炎", answer: ["慢性肝炎时，门管区炎细胞浸润突破界板并侵入邻近肝小叶，引起界板肝细胞变性坏死的病变，旧称碎片状坏死。"] },
    { id: "hf-karyolysis", type: "名词解释", topic: "necrosisOutcome", title: "Karyolysis｜核溶解", answer: ["坏死细胞核DNA被DNA酶降解，核染色质嗜碱性逐渐减弱直至完全消失的形态变化。"] },
    { id: "hf-krukenberg", type: "名词解释", topic: "benignMalignant", title: "Krukenberg tumor｜库肯勃瘤", answer: ["胃肠道黏液癌，尤其胃印戒细胞癌，转移至卵巢形成的转移性肿瘤，常为双侧，镜下可见黏液性印戒细胞。"] },
    { id: "hf-nephritic", type: "名词解释", topic: "glomerulonephritis", title: "Nephritic syndrome｜肾炎综合征", answer: ["以血尿、蛋白尿、水肿和高血压为主要表现，可伴少尿和氮质血症的一组肾小球疾病临床综合征。", "病理基础多为肾小球细胞增生和炎性损伤，导致滤过率下降及红细胞漏出。"] },
    { id: "hf-obstructive-lung", type: "简答题", topic: "chronicBronchitis", title: "阻塞性肺部疾病举例及病理特征", answer: ["慢性支气管炎：杯状细胞增多、黏膜下腺增生，Reid指数增大，管壁慢性炎症和纤维化导致气道狭窄。", "肺气肿：终末细支气管远端气腔持续扩大并伴肺泡壁破坏，无明显纤维化。", "支气管哮喘：支气管平滑肌肥厚、黏液腺增生，黏液栓内可见Curschmann螺旋体和Charcot-Leyden结晶。", "支气管扩张：支气管壁肌层及弹力组织破坏，管腔永久性扩张并伴慢性化脓性炎。"] },
    { id: "hf-papillary-thyroid", type: "选择题", topic: "thyroid", title: "甲状腺乳头状癌的诊断性形态", answer: ["答案要点：乳头有纤维血管轴心；癌细胞核透明呈毛玻璃样，可见核沟和核内假包涵体；间质常见砂粒体。", "易错点：C细胞来源的是甲状腺髓样癌，不是乳头状癌。"] },
  ];

  const sourceByTopic = {
    benignMalignant: { type: "ppt", label: "当前课程PPT", refs: ["肿瘤（人卫） (1).pptx：幻灯片74–83"] },
    metaplasia: { type: "studyGuide", label: "学习指导", refs: ["《病理学学习指导与习题集》PDF p12、p20"] },
    necrosisOutcome: { type: "synthesis", label: "综合整理", refs: ["修复-2026-刘国元.pdf：p49–50", "《病理学学习指导与习题集》PDF p21"] },
    hemorrhagicInfarct: { type: "ppt", label: "当前课程PPT", refs: ["第二章 局部血液循环障碍pptx.pptx", "《病理学学习指导与习题集》PDF p42–51"] },
    thrombosis: { type: "ppt", label: "当前课程PPT", refs: ["第二章 局部血液循环障碍pptx.pptx", "《病理学学习指导与习题集》PDF p39–51"] },
    inflammation: { type: "ppt", label: "当前课程PPT", refs: ["炎症-2026-刘国元.pdf：p29–30、p56–71"] },
    granuloma: { type: "ppt", label: "当前课程PPT", refs: ["炎症-2026-刘国元.pdf：p30、p97–108"] },
    rheumatic: { type: "ppt", label: "当前课程PPT", refs: ["心血管系统疾病 刘学光 (1).pdf：p98–116"] },
    myocardialInfarct: { type: "ppt", label: "当前课程PPT", refs: ["心血管系统疾病 刘学光 (1).pdf：p51、p55、p73–74"] },
    chronicBronchitis: { type: "studyGuide", label: "学习指导", refs: ["《病理学学习指导与习题集》PDF p141–159（当前文件夹无独立呼吸系统课件）"] },
    pneumonia: { type: "studyGuide", label: "学习指导", refs: ["《病理学学习指导与习题集》PDF p141–162（当前文件夹无独立呼吸系统课件）"] },
    gastricUlcer: { type: "ppt", label: "当前课程PPT", refs: ["消化系统疾病 2026-4-22 曾文姣.pptx：幻灯片35、41、43、46–47"] },
    cirrhosis: { type: "ppt", label: "当前课程PPT", refs: ["消化系统疾病 2026-4-22 曾文姣.pptx：幻灯片204、208–211、223–227"] },
    hepatitis: { type: "ppt", label: "当前课程PPT", refs: ["消化系统疾病 2026-4-22 曾文姣.pptx：幻灯片142、145、160、168、187–196"] },
    schistoLiver: { type: "synthesis", label: "综合整理", refs: ["传染病与寄生虫病  李慧 Granuloma.pptx", "《病理学学习指导与习题集》PDF p270–289"] },
    nephrotic: { type: "ppt", label: "当前课程PPT", refs: ["泌尿系统疾病 中文 2026-whj (1).pdf：p25、p30–31、p50、p54"] },
    glomerulonephritis: { type: "ppt", label: "当前课程PPT", refs: ["泌尿系统疾病 中文 2026-whj (1).pdf：p15、p54、p102"] },
    pyelonephritis: { type: "synthesis", label: "综合整理", refs: ["泌尿系统疾病 中文 2026-whj (1).pdf", "《病理学学习指导与习题集》PDF p203–219"] },
    tb: { type: "ppt", label: "当前课程PPT", refs: ["结核病-2026-刘颖 (1).pdf：p26–35、p48、p63、p73"] },
    encephalitis: { type: "ppt", label: "当前课程PPT", refs: ["神经系统疾病-刘颖-临床班(非整合） (1).pdf：p28、p32、p67–68、p96、p99–101"] },
    brainEdema: { type: "ppt", label: "当前课程PPT", refs: ["神经系统疾病-刘颖-临床班(非整合） (1).pdf：p36–43、p73–77"] },
    reproductive: { type: "ppt", label: "当前课程PPT", refs: ["女性生殖病理-2026上传版.pdf", "《病理学学习指导与习题集》PDF p222–235"] },
    hematology: { type: "ppt", label: "当前课程PPT", refs: ["淋巴造血系统疾病.pdf：p19、p21、p34、p55、p65"] },
    thyroid: { type: "ppt", label: "当前课程PPT", refs: ["内分泌系统疾病 2026-wsy (1).pdf：p21–32、p57"] },
  };

  const ruleSpecs = [
    ["hf-hepatitis-case", [/42岁工人|乙肝病程迁延|既往乙肝.*转氨酶|穿刺活检.*乙肝/i], "same"],
    ["hf-cirrhosis-case", [/肝炎.*呕血|慢性肝炎.*门脉高压|反复肝炎多年.*呕血/i], "same"],
    ["hf-fat-case", [/股骨骨折.*油红|长骨骨折.*脂肪栓塞/i], "exact"],
    ["hf-benign", [/良[、和]?恶性肿瘤.*(鉴别|区别|比较|诊断标准)|良性和恶性肿瘤区别/i], "exact"],
    ["hf-mi", [/透壁性心肌梗死.*并发症|心肌梗死.*(病理变化和)?常见并发症/i], "exact"],
    ["hf-nephrotic", [/肾病综合征.*(定义|举例|举两例|举三例|三种疾病)/i], "exact"],
    ["hf-chronic", [/慢支.*(肺气肿|肺心病)|慢性支气管炎.*(肺气肿|肺源性心脏病)|慢性支气管炎形态改变|慢性支气管炎病理改变/i], "same"],
    ["hf-cirrhosis", [/(肝炎后|结节性|干线型).*血吸虫.*肝|血吸虫.*(肝炎后|结节性).*肝/i], "same"],
    ["hf-ulcer", [/胃溃疡.*(病理|特点|特征|并发症)/i], "exact"],
    ["hf-tb", [/原发性.*继发性肺结核|继发性.*原发性肺结核/i], "exact"],
    ["hf-rheumatic", [/(风湿性|心瓣膜).*赘生物|风湿性.*(细菌性|感染性)心内膜炎/i], "same"],
    ["hf-gn", [/肾小球肾炎.*肾盂肾炎|慢性肾小球肾炎.*慢性肾盂肾炎/i], "same"],
    ["hf-necrosis", [/坏死的结局|脓肿的结局/i], "exact"],
    ["hf-brain", [/脑水肿.*脑积水|脑积水.*脑水肿/i], "same"],
    ["hf-healing", [/一期愈合.*二期愈合|创伤愈合.*一期.*二期/i], "exact"],
    ["hf-hyalinosis", [/玻璃样变.*(概念|类型|定义)|透明变性的特点|^\s*Hyalinosis\s*$/i], "same"],
    ["hf-cor-pulmonale", [/^\s*Cor pulmonale\s*$|肺源性心脏病的病因和病理特征/i], "exact"],
    ["hf-obstructive-lung", [/阻塞性肺部疾病.*病理特征|举例.*阻塞性肺部疾病/i], "same"],
    ["hf-papillary-thyroid", [/甲状腺乳头状癌病例判断|甲状腺乳头分支多.*砂粒体/i], "same"],
    ["hf-choice-white", [/白色血栓.*(主要成分|成分)/i], "exact"],
    ["hf-choice-linear", [/免疫荧光.*线性|Goodpasture.*免疫荧光/i], "exact"],
    ["hf-choice-intussusception", [/(肠套叠|睾丸扭转).*(梗死|淤血)/i], "same"],
    ["hf-choice-lobar", [/大叶性肺炎.*(炎症类型|什么类型炎症|炎症性质)/i], "exact"],
    ["hf-choice-astro", [/(中枢神经系统|神经系统)瘢痕.*细胞/i], "exact"],
    ["hf-choice-cml", [/Ph\s*染色体.*(见于|最典型)|与HIV有关的肿瘤.*Ph/i], "exact"],
    ["hf-carnification", [/^\s*Carnification\s*$|^\s*肺肉质变\s*$/i], "exact"],
    ["hf-rheumatic-body", [/^\s*(Aschoff|Rheumatic)\s*(小体|body)\s*$/i], "exact"],
    ["hf-foot", [/^\s*Foot process disease\s*$|^\s*足突病\s*$/i], "exact"],
    ["hf-ph", [/^\s*(Philadelphia|Ph)\s*(chromosome|染色体)\s*$/i], "exact"],
    ["hf-eosin", [/^\s*Eosinophilic abscess\s*$|^\s*嗜酸性脓肿\s*$/i], "exact"],
    ["hf-tuberculoma", [/^\s*Tuberculoma\s*$|^\s*结核(球|瘤)\s*$/i], "exact"],
    ["hf-bridge", [/^\s*Bridging necrosis\s*$|^\s*桥接坏死\s*$/i], "exact"],
    ["hf-sieve", [/Sieve-like softening/i], "exact"],
    ["hf-cirrhosis-term", [/^\s*Cirrhosis\s*$|^\s*肝硬化\s*$/i], "exact"],
    ["hf-ventricular", [/^\s*Ventricular aneurysm\s*$/i], "exact"],
    ["hf-neurophagia", [/^\s*Neurophagia\s*$|^\s*噬神经(元|细胞)现象\s*$/i], "exact"],
    ["hf-pipe", [/^\s*Pipe[- ]stem fibrosis\s*$|^\s*干线型肝纤维化\s*$/i], "same"],
    ["hf-spike", [/^\s*Spike\s*$|^\s*钉突\s*$/i], "same"],
    ["hf-metaplasia", [/^\s*Metaplasia\s*$|^\s*化生并举|^\s*Intestinal metaplasia\s*$/i], "exact"],
    ["hf-thrombosis-term", [/^\s*Thrombosis\s*$/i], "exact"],
    ["hf-organization", [/^\s*Organization\s*$/i], "exact"],
    ["hf-recanalization", [/^\s*Recanalization\s*$/i], "exact"],
    ["hf-granuloma", [/^\s*Granuloma\s*$|肉芽肿定义并举|肉芽肿性炎并述病理/i], "exact"],
    ["hf-cis", [/^\s*Carcinoma in situ\s*$/i], "exact"],
    ["hf-anaplasia", [/^\s*Anaplasia\s*$/i], "exact"],
    ["hf-precancer", [/Precancerous|癌前病变.*举/i], "exact"],
    ["hf-emphysema", [/^\s*Emphysema\s*$/i], "exact"],
    ["hf-heart-failure-cell", [/^\s*Heart failure cell\s*$|心衰细胞是什么/i], "exact"],
    ["hf-mallory", [/Mallory小体|Mallory\s*body/i], "exact"],
    ["hf-lupus", [/Lupus cell|LE cell|Lupus erythematosus body|狼疮细胞是什么/i], "exact"],
    ["hf-cin", [/^\s*CIN\s*$/i], "exact"],
    ["hf-crescent", [/^\s*Crescent\s*$/i], "exact"],
    ["hf-ghon", [/^\s*Ghon complex\s*$/i], "exact"],
    ["hf-caseous", [/^\s*Caseous necrosis\s*$/i], "exact"],
    ["hf-lacuna", [/^\s*Lacunae\s*(的定义)?\??\s*$/i], "exact"],
    ["hf-satellite", [/卫星现象/i], "exact"],
    ["hf-pseudolobule", [/^\s*Pseudolobule\s*$/i], "exact"],
    ["hf-ameboma", [/^\s*Ameboma\s*$/i], "exact"],
    ["hf-nutmeg", [/^\s*Nutmeg liver\s*$/i], "exact"],
    ["hf-pyemia", [/^\s*Pyemia\s*$/i], "exact"],
    ["hf-hemorrhagic-conditions", [/出血性梗死发生条件/i], "exact"],
    ["hf-suppurative", [/化脓性炎定义并举/i], "exact"],
    ["hf-schisto-site", [/血吸虫卵主要沉积部位/i], "exact"],
    ["hf-aneurysm", [/^\s*Aneurysm\s*$/i], "exact"],
    ["hf-apoptosis", [/^\s*Apoptosis\s*$/i], "exact"],
    ["hf-atheroma", [/^\s*Atheroma\s*$|^\s*Atheromatous plaque\s*$/i], "exact"],
    ["hf-atrophy", [/^\s*Atrophy\s*$/i], "exact"],
    ["hf-chancre", [/^\s*Chancre\s*$/i], "exact"],
    ["hf-copd", [/^\s*COPD\s*$/i], "exact"],
    ["hf-fistula", [/^\s*Fistula\s*$/i], "exact"],
    ["hf-gangrene", [/^\s*Gangrene\s*$/i], "exact"],
    ["hf-granulation", [/^\s*Granulation tissue\s*$/i], "exact"],
    ["hf-gumma", [/^\s*Gumma\s*$/i], "exact"],
    ["hf-interface", [/^\s*Interface hepatitis\s*$/i], "exact"],
    ["hf-karyolysis", [/^\s*Karyolysis\s*$/i], "exact"],
    ["hf-krukenberg", [/^\s*Krukenberg tumor\s*$/i], "exact"],
    ["hf-nephritic", [/^\s*Nephritic syndrome\s*$/i], "exact"],
  ];

  const seedById = Object.fromEntries(answerSeeds.map((seed) => [seed.id, seed]));
  const conceptDefinitions = ruleSpecs.map(([id, patterns, bankMatch]) => ({
    ...seedById[id],
    conceptId: id,
    patterns,
    bankMatch,
    bankRef: bankMatch === "exact" ? `《病理学学习指导与习题集》${topics[seedById[id].topic]?.pages || ""}` : `题库覆盖同一考点：${topics[seedById[id].topic]?.pages || "页码待核"}`,
    answerSource: sourceByTopic[seedById[id].topic] || { type: "synthesis", label: "综合整理", refs: [] },
    pptEmphasis: ["hf-spike", "hf-ph", "hf-satellite", "hf-neurophagia", "hf-sieve", "hf-mallory", "hf-brain", "hf-rheumatic-body"].includes(id),
  }));

  function normalizePrompt(value) {
    return String(value || "").toLowerCase().replace(/[\s，。；：、？！“”‘’（）()\[\]｜|/\\·—_-]+/g, "").trim();
  }

  function stableId(text) {
    let hash = 2166136261;
    for (const char of text) { hash ^= char.charCodeAt(0); hash = Math.imul(hash, 16777619); }
    return `auto-${(hash >>> 0).toString(36)}`;
  }

  const typeKeys = {
    choice: { label: "选择题", sections: ["选择题"] },
    term: { label: "名词解释", sections: ["名词解释"] },
    short: { label: "简答 / 论述", sections: ["简答题", "问答题", "论述题", "简答/论述"] },
    case: { label: "病例分析", sections: ["病例分析"] },
  };

  const choicePractice = {
    "hf-choice-white": {
      prompt: "白色血栓的主要成分是",
      options: ["血小板", "纤维蛋白", "红细胞", "中性粒细胞", "胶原纤维"],
      correctAnswer: "A",
    },
    "hf-choice-linear": {
      prompt: "下列哪种疾病的肾小球免疫荧光呈线性沉积？",
      options: ["急性弥漫性增生性肾小球肾炎", "膜性肾病", "IgA肾病", "Goodpasture综合征", "狼疮性肾炎"],
      correctAnswer: "D",
    },
    "hf-choice-intussusception": {
      prompt: "肠套叠或睾丸扭转时最容易发生哪种类型的梗死？",
      options: ["贫血性梗死", "出血性梗死", "败血性梗死", "液化性坏死", "脂肪坏死"],
      correctAnswer: "B",
    },
    "hf-chronic": {
      prompt: "慢性支气管炎最常导致哪种类型的肺气肿？",
      options: ["腺泡中央型肺气肿", "全腺泡型肺气肿", "腺泡远端型肺气肿", "不规则型肺气肿", "代偿性肺气肿"],
      correctAnswer: "A",
    },
    "hf-papillary-thyroid": {
      prompt: "下列哪项形态最支持甲状腺乳头状癌？",
      options: ["癌细胞核呈毛玻璃样，可见核沟和核内假包涵体", "由C细胞发生并伴间质淀粉样物质沉积", "主要由小滤泡构成且缺乏乳头状癌核特征", "癌细胞高度多形性并可见瘤巨细胞", "嗜酸性细胞增生并伴大量淋巴滤泡形成"],
      correctAnswer: "A",
    },
    "hf-choice-lobar": {
      prompt: "大叶性肺炎的炎症性质主要是",
      options: ["浆液性炎", "纤维蛋白性炎", "化脓性炎", "出血性炎", "肉芽肿性炎"],
      correctAnswer: "B",
    },
    "hf-schisto-site": {
      prompt: "日本血吸虫卵在人体内主要沉积于",
      options: ["肺内小动脉分支", "肾小球毛细血管", "结肠壁和肝内门静脉小分支", "脑实质灰质", "胆囊壁"],
      correctAnswer: "C",
    },
  };

  function sectionTypeKey(sectionName) {
    return Object.entries(typeKeys).find(([, config]) => config.sections.includes(sectionName))?.[0] || "note";
  }

  function canonicalTypeKey(typeName) {
    return sectionTypeKey(typeName) !== "note" ? sectionTypeKey(typeName) : /选择/.test(typeName || "") ? "choice" : /名词/.test(typeName || "") ? "term" : /病例/.test(typeName || "") ? "case" : "short";
  }

  function splitTermTitle(title) {
    const parts = String(title || "").split("｜").map((part) => part.trim()).filter(Boolean);
    if (parts.length >= 2) {
      const firstLatin = /^[A-Za-z]/.test(parts[0]);
      return firstLatin ? { chinese: parts[1], english: parts[0] } : { chinese: parts[0], english: parts[1] };
    }
    if (/^[A-Za-z]/.test(title || "")) return { chinese: "中文名待核对", english: title };
    return { chinese: title || "术语待核对", english: "" };
  }

  function yearFromPaper(paperItem) {
    const match = String(paperItem.label || "").match(/(^|\D)(\d{2})级/);
    return match ? Number(match[2]) : 0;
  }

  function theoryHoursForChapter(chapterName) {
    const chapters = window.pathologyBankData?.syllabus?.chapters || [];
    const normalized = normalizePrompt(chapterName).replace(/系统|疾病|和|与/g, "");
    const found = chapters.find((chapter) => {
      const candidate = normalizePrompt(chapter.name).replace(/系统|疾病|和|与/g, "");
      return normalized && candidate && (normalized.includes(candidate) || candidate.includes(normalized));
    });
    return found?.theoryHours || 0;
  }

  function tierForFrequency(frequency, supplement) {
    if (frequency >= 3) return "core";
    if (frequency === 2) return "high";
    if (frequency === 1) return "past";
    return supplement ? "supplement" : "archive";
  }

  function createReviewModel(inputPapers, definitions = conceptDefinitions) {
    const recentGroups = new Set(inputPapers.filter((paperItem) => yearFromPaper(paperItem) >= 21).map((paperItem) => paperItem.groupId));
    const concepts = new Map();
    const initConcept = (conceptId, definition, raw, secType) => {
      const fallbackSource = sourceByTopic[raw?.topic] || { type: "synthesis", label: "综合整理", refs: ["依据当前课程资料与学习指导整理"] };
      const term = splitTermTitle(definition?.title || raw?.prompt || "");
      const chapter = topics[definition?.topic || raw?.topic]?.chapter || "待确认";
      return {
        conceptId,
        id: conceptId,
        title: definition?.title || raw?.prompt || "待核对母题",
        chineseTitle: term.chinese,
        englishTitle: term.english,
        prompt: definition?.title || raw?.prompt || "待核对母题",
        type: definition?.type || secType || "问答题",
        canonicalType: canonicalTypeKey(definition?.type || secType),
        topic: definition?.topic || raw?.topic || "",
        chapter,
        answer: definition?.answer || raw?.answer || "",
        answerProfiles: auditedAnswerProfiles[conceptId] || {},
        answerSource: definition?.answerSource || fallbackSource,
        bankMatch: definition?.bankMatch || "none",
        bankRef: definition?.bankRef || "未在题库中定位到直接对应题；不影响复习优先级",
        pptEmphasis: Boolean(definition?.pptEmphasis),
        pptRank: definition?.pptEmphasis ? 2 : (definition?.answerSource?.type === "ppt" ? 1 : 0),
        pptPages: definition?.answerSource?.refs || [],
        syllabusLevel: topics[definition?.topic || raw?.topic] ? 1 : 0,
        theoryHours: theoryHoursForChapter(chapter),
        choicePractice: choicePractice[conceptId] || null,
        paperGroups: new Map(),
        typeGroups: { choice: new Set(), term: new Set(), short: new Set(), case: new Set() },
        recentTypeGroups: { choice: new Set(), term: new Set(), short: new Set(), case: new Set() },
        variants: [],
      };
    };

    const classifiedPapers = inputPapers.map((paperItem) => ({
      ...paperItem,
      year: yearFromPaper(paperItem),
      sections: paperItem.sections.map((sec) => ({
        ...sec,
        items: sec.items.map((raw) => {
          const definition = definitions.find((candidate) => candidate.patterns.some((pattern) => pattern.test(raw.prompt || "")));
          const normalized = normalizePrompt(raw.prompt);
          const incomplete = /未提供|同卷|原文未逐题重复/.test(raw.prompt || "");
          const fallbackSource = sourceByTopic[raw.topic] || { type: "synthesis", label: "综合整理", refs: ["依据当前课程资料与学习指导整理"] };
          const conceptId = definition?.conceptId || stableId(`${sec.type}:${normalized || paperItem.id}`);
          const bankMatch = definition?.bankMatch || (normalized && !incomplete && !raw.note?.includes("不推测") ? "none" : "unavailable");
          const bankRef = definition?.bankRef || (bankMatch === "none" ? "未在题库中定位到直接对应题；不影响复习优先级" : "题干缺失或无法比较");
          const typeKey = sectionTypeKey(sec.type);
          const classified = {
            ...raw,
            id: `${paperItem.id}-${stableId(`${sec.type}:${normalized || "missing"}`)}`,
            conceptId,
            typeKey,
            bankMatch,
            bankRef,
            answerSource: definition?.answerSource || fallbackSource,
          };
          if (!concepts.has(conceptId)) {
            concepts.set(conceptId, initConcept(conceptId, definition, raw, sec.type));
          }
          const concept = concepts.get(conceptId);
          if (typeKey !== "note") {
            concept.paperGroups.set(paperItem.groupId, paperItem.label);
            concept.typeGroups[typeKey].add(paperItem.groupId);
            if (recentGroups.has(paperItem.groupId)) concept.recentTypeGroups[typeKey].add(paperItem.groupId);
          }
          concept.variants.push({ paperId: paperItem.id, groupId: paperItem.groupId, paperLabel: paperItem.label, year: yearFromPaper(paperItem), type: sec.type, typeKey, prompt: raw.prompt });
          if (!concept.answer && raw.answer) concept.answer = raw.answer;
          return classified;
        }),
      })),
    }));

    // Keep high-value syllabus/PPT definitions even when no historical paper matched.
    definitions.forEach((definition) => {
      if (!concepts.has(definition.conceptId)) concepts.set(definition.conceptId, initConcept(definition.conceptId, definition, null, definition.type));
    });

    const derivedConcepts = [...concepts.values()].map((concept) => {
      const frequencies = Object.fromEntries(Object.entries(concept.typeGroups).map(([key, groups]) => [key, groups.size]));
      const recentFrequencies = Object.fromEntries(Object.entries(concept.recentTypeGroups).map(([key, groups]) => [key, groups.size]));
      const totalFrequency = concept.paperGroups.size;
      const supplementEligible = Boolean(concept.syllabusLevel && (concept.pptEmphasis || concept.answerSource?.type === "ppt"));
      const tiers = Object.fromEntries(Object.keys(typeKeys).map((key) => [key, tierForFrequency(frequencies[key], supplementEligible && concept.canonicalType === key)]));
      const answerComplete = Array.isArray(concept.answer) ? concept.answer.filter(Boolean).length : Number(Boolean(concept.answer));
      return {
        ...concept,
        paperGroups: undefined,
        typeGroups: undefined,
        recentTypeGroups: undefined,
        choiceFrequency: frequencies.choice,
        termFrequency: frequencies.term,
        shortFrequency: frequencies.short,
        caseFrequency: frequencies.case,
        totalFrequency,
        paperFrequency: totalFrequency,
        frequency: totalFrequency,
        recentChoiceFrequency: recentFrequencies.choice,
        recentTermFrequency: recentFrequencies.term,
        recentShortFrequency: recentFrequencies.short,
        recentCaseFrequency: recentFrequencies.case,
        typeFrequency: frequencies,
        recentTypeFrequency: recentFrequencies,
        tiers,
        answerComplete,
        paperLabels: [...concept.paperGroups.values()],
        paperGroupIds: [...concept.paperGroups.keys()],
      };
    });

    const sortForType = (typeKey) => {
      const frequencyKey = `${typeKey}Frequency`;
      const recentKey = `recent${typeKey[0].toUpperCase()}${typeKey.slice(1)}Frequency`;
      return (a, b) => b[frequencyKey] - a[frequencyKey]
        || b.totalFrequency - a.totalFrequency
        || b[recentKey] - a[recentKey]
        || b.syllabusLevel - a.syllabusLevel
        || b.pptRank - a.pptRank
        || ({ exact: 2, same: 1, none: 0, unavailable: -1 }[b.bankMatch] || 0) - ({ exact: 2, same: 1, none: 0, unavailable: -1 }[a.bankMatch] || 0)
        || b.answerComplete - a.answerComplete
        || a.title.localeCompare(b.title, "zh-CN");
    };
    const pools = Object.fromEntries(Object.keys(typeKeys).map((typeKey) => [
      typeKey,
      derivedConcepts.filter((item) => item.tiers[typeKey] !== "archive").sort(sortForType(typeKey)),
    ]));
    const highFrequency = derivedConcepts.filter((item) => Object.values(item.tiers).some((tier) => tier === "core" || tier === "high"));

    return { papers: classifiedPapers, concepts: derivedConcepts, pools, highFrequency, sortForType };
  }

  const model = createReviewModel(papers);
  window.pathologyReviewData = {
    examAt: "2026-06-29T13:00:00+08:00",
    generatedAt: "2026-06-28",
    scope: "病理学理论期末；不含标本、切片、数字人、实验识图和实验考操作。",
    sourceBook: "6.病理学学习指导与习题集-全书签(OCR).pdf",
    topics,
    typeKeys,
    papers: model.papers,
    concepts: model.concepts,
    pools: model.pools,
    highFrequency: model.highFrequency,
    createReviewModel,
    last30: [
      "只看各题型“核心高频＋高频”：先背名解，再背简答/论述和病例诊断链。",
      "简答按病因/机制/形态/临床病理联系分点；病例先写诊断，再列题干证据、病理变化和症状机制。",
      "同题型频次是第一排序键；PPT、大纲和题库证据只处理同频题，绝不让1套题超过2套题。",
      "遇到回忆不全的选择题，不补造题干；回到课程PPT对应页掌握判断依据。",
    ],
  };
})();
