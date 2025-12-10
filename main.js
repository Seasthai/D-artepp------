// Medical Dosage Calculator - 主要JavaScript逻辑
// 版本：v8.6 - 添加动态体重范围提示
// 日期：2024-01-20

// 全局变量
let currentWeight = 35.0;
let selectedProduct = null;
let isDragging = false;
let startAngle = 0;
let currentRotation = 0;
let currentLanguage = 'en'; // 默认语言为英语
let injectionRoute = 'iv'; // 新增：默认静脉注射（'iv'或'im'）

// 多语言翻译数据 - 添加D-Artepp专用范围提示
const translations = {
    en: {
        appTitle: "Medical Dosage Calculator",
        navCalculator: "Calculator",
        navMedications: "Medications",
        selectProduct: "Select Product",
        selectProductDesc: "Please select the product for dosage calculation",
        darteppDesc: "Antimalarial Dosage Calculator",
        artesunDesc: "Artesunate for Injection",
        argesunDesc: "Artesunate Injection Dosage Calculator",
        recommended: "Recommended",
        comingSoon: "Coming Soon",
        // D-Artepp
        darteppCalculatorTitle: "D-Artepp® Dosage Calculation",
        darteppCalculatorDesc: "Select patient weight, system will automatically calculate recommended D-Artepp® dosage",
        // Argesun
        argesunCalculatorTitle: "Argesun® Dosage Calculation",
        argesunCalculatorDesc: "Select patient weight, system will calculate recommended Argesun® injection dosage",
        // Artesun
        artesunCalculatorTitle: "Artesun® Dosage Calculation",
        artesunCalculatorDesc: "Select patient weight and injection route, system will calculate recommended Artesun® injection dosage",
        routeSelectionInstruction: "Select IV for slow intravenous injection or IM for intramuscular injection",
        // 通用
        weightSelector: "Weight Selector",
        manualInput: "Or enter weight manually",
        weightRange: "Range: 0-100kg",
        weightRangeDartepp: "Range: 5-100kg", // D-Artepp专用
        dosagePlan: "Recommended Dosage Plan",
        selectWeight: "Please select weight",
        selectWeightDesc: "Slide the dial on the left to set patient weight",
        backToProducts: "Back to Products",
        footerCopyright: "© 2025 Medical Dosage Calculator. Professional medical tool for safe medication.",
        footerDisclaimer: "This tool is for reference only, please follow medical advice for actual medication.",
        // D-Artepp 结果
        darteppDosageResultTitle: "D-Artepp® dosage based on weight",
        darteppDosageResultSubtitle: "D-Artepp® - Three-day treatment plan",
        // Argesun 结果
        argesunDosageResultTitle: "Argesun® dosage based on weight",
        argesunDosageResultSubtitle: "Argesun® - Injectable Artesunate (Single Solvent)",
        // Artesun 结果
        artesunDosageResultTitle: "Artesun® dosage based on weight {weight}kg",
        artesunDosageResultSubtitle: "Artesun® - Injectable Artesunate (Dual Solvent)",
        // 通用结果
        patientWeight: "Patient Weight",
        recommendedMedication: "Recommended Medication Plan:",
        dosageInstruction: "Recommended dosage:",
        medicationInstructions: "Medication Instructions:",
        takeDaily: "Take daily",
        forDays: "for 3 days",
        pleaseFollow: "Please strictly follow medical advice. Seek medical attention immediately if adverse reactions occur.",
        weightOutOfRange: "Weight out of range",
        checkWeight: "Please check if weight input is correct (0-100kg)",
        checkWeightDartepp: "Please check if weight input is correct (5-100kg)", // D-Artepp专用
        selectProductAlert: "Please select a product first",
        // 注射途径选择
        injectionRoute: "Injection Route",
        selectRoute: "Select Injection Route",
        ivRoute: "Intravenous (IV)",
        imRoute: "Intramuscular (IM)",
        ivRouteDesc: "10 mg/ml · Slow injection over 1-2 minutes",
        imRouteDesc: "20 mg/ml · Anterior thigh injection",
        finalInjectionVolume: "Final Injection Volume",
        reconstitutionGuide: "Reconstitution Guide",
        vial: "vial",
        concentration: "Concentration",
        // Argesun 特有
        dosageFormula: "Dosage formula:",
        dosagePerKg: "Dosage per kg:",
        forAdults: "for patients ≥20kg",
        forChildren: "for children <20kg",
        reconstitutionSteps: "Reconstitution Steps:",
        administrationMethod: "Administration Method:",
        singleSolvent: "Single-solvent system",
        dualSolvent: "Dual-solvent system",
        immediateUse: "Must be used within 1 hour after reconstitution",
        availableStrengths: "Available Strengths:",
        reconstitutionVolume: "Reconstitution Volume:",
        injectionVolume: "Injection Volume:",
        selectStrength: "Select Strength Combination",
        ivImNote: "Note: Same volume for IV and IM injection (20mg/ml)",
        totalDose: "Total dose:",
        // Artesun 特有
        bicarbonateVolume: "Bicarbonate Volume:",
        salineVolume: "Saline Volume:",
        ivConcentration: "IV Concentration: 10 mg/ml",
        imConcentration: "IM Concentration: 20 mg/ml",
        ivCalculation: "IV Calculation:",
        imCalculation: "IM Calculation:",
        roundUp: "Round up to nearest ml",
        example: "Example:",
        reconstitutionNote: "Reconstitution Note:",
        useAllBicarbonate: "Use all content of bicarbonate ampoule",
        diluteNote: "Dilution Note:",
        removeAir: "Remove air from ampoule before saline injection",
        patientInjection: "Patient Final Injection Volume",
        finalConcentration: "Final Concentration",
        // 新增
        alternativeOptions: "Alternative Options:",
        optimalSelection: "Optimal Selection"
    },
    zh: {
        appTitle: "医疗剂量计算器",
        navCalculator: "计算器",
        navMedications: "药品信息",
        selectProduct: "选择产品",
        selectProductDesc: "请选择您需要计算剂量的产品",
        darteppDesc: "抗疟疾药物剂量计算器",
        artesunDesc: "注射用青蒿琥酯",
        argesunDesc: "注射用青蒿琥酯剂量计算器",
        recommended: "推荐产品",
        comingSoon: "即将推出",
        // D-Artepp
        darteppCalculatorTitle: "D-Artepp® 剂量计算",
        darteppCalculatorDesc: "选择患者体重，系统将计算推荐的D-Artepp®剂量",
        // Argesun
        argesunCalculatorTitle: "Argesun® 剂量计算",
        argesunCalculatorDesc: "选择患者体重，系统将计算推荐的Argesun®注射剂量",
        // Artesun
        artesunCalculatorTitle: "Artesun® 剂量计算",
        artesunCalculatorDesc: "选择患者体重和注射途径，系统将计算推荐的Artesun®注射剂量",
        routeSelectionInstruction: "选择IV进行缓慢静脉注射或选择IM进行肌肉注射",
        // 通用
        weightSelector: "体重选择器",
        manualInput: "或直接输入体重",
        weightRange: "范围: 0-100kg",
        weightRangeDartepp: "范围: 5-100kg", // D-Artepp专用
        dosagePlan: "推荐剂量方案",
        selectWeight: "请选择体重",
        selectWeightDesc: "滑动左侧刻度盘来设置患者体重",
        backToProducts: "返回产品选择",
        footerCopyright: "© 2025 医疗剂量计算器. 专业医疗工具，确保用药安全.",
        footerDisclaimer: "本工具仅供参考，实际用药请遵循医嘱",
        // D-Artepp 结果
        darteppDosageResultTitle: "基于体重 {weight}kg 的D-Artepp®剂量",
        darteppDosageResultSubtitle: "D-Artepp® - 三日疗程方案",
        // Argesun 结果
        argesunDosageResultTitle: "基于体重 {weight}kg 的Argesun®剂量",
        argesunDosageResultSubtitle: "Argesun® - 注射用青蒿琥酯 (单一溶剂)",
        // Artesun 结果
        artesunDosageResultTitle: "基于体重 {weight}kg 的Artesun®剂量",
        artesunDosageResultSubtitle: "Artesun® - 注射用青蒿琥酯 (双溶剂)",
        // 通用结果
        patientWeight: "患者体重",
        recommendedMedication: "推荐用药方案：",
        dosageInstruction: "推荐用量：",
        medicationInstructions: "用药说明：",
        takeDaily: "每日",
        forDays: "连续3日",
        pleaseFollow: "请严格遵医嘱使用，如出现不良反应请及时就医。",
        weightOutOfRange: "体重超出范围",
        checkWeight: "请检查体重输入是否正确 (0-100kg)",
        checkWeightDartepp: "请检查体重输入是否正确 (5-100kg)", // D-Artepp专用
        selectProductAlert: "请先选择产品",
        // 注射途径选择
        injectionRoute: "注射途径",
        selectRoute: "选择注射途径",
        ivRoute: "静脉注射 (IV)",
        imRoute: "肌肉注射 (IM)",
        ivRouteDesc: "10 mg/ml · 缓慢注射1-2分钟",
        imRouteDesc: "20 mg/ml · 大腿前部注射",
        finalInjectionVolume: "最终注射体积",
        reconstitutionGuide: "配制指南",
        vial: "瓶",
        concentration: "浓度",
        // Argesun 特有
        dosageFormula: "剂量公式：",
        dosagePerKg: "每公斤剂量：",
        forAdults: "适用于≥20kg患者",
        forChildren: "适用于<20kg儿童",
        reconstitutionSteps: "配制步骤：",
        administrationMethod: "给药方法：",
        singleSolvent: "单一溶剂系统",
        dualSolvent: "双溶剂系统",
        immediateUse: "配制后1小时内必须使用",
        availableStrengths: "可用规格：",
        reconstitutionVolume: "配制体积：",
        injectionVolume: "注射体积：",
        selectStrength: "选择规格组合",
        ivImNote: "注意：静脉和肌肉注射使用相同体积（20mg/ml）",
        totalDose: "总剂量：",
        // Artesun 特有
        bicarbonateVolume: "碳酸氢钠体积：",
        salineVolume: "氯化钠体积：",
        ivConcentration: "静脉浓度：10 mg/ml",
        imConcentration: "肌肉浓度：20 mg/ml",
        ivCalculation: "静脉计算：",
        imCalculation: "肌肉计算：",
        roundUp: "向上取整到最近的毫升",
        example: "示例：",
        reconstitutionNote: "配制说明：",
        useAllBicarbonate: "使用全部碳酸氢钠安瓿内容物",
        diluteNote: "稀释说明：",
        removeAir: "注射氯化钠前排出安瓿中的空气",
        patientInjection: "患者最终注射体积",
        finalConcentration: "最终浓度",
        // 新增
        alternativeOptions: "替代方案：",
        optimalSelection: "最优选择"
    },
    fr: {
        appTitle: "Calculateur de Dosage Médical",
        navCalculator: "Calculateur",
        navMedications: "Médicaments",
        selectProduct: "Sélectionner le Produit",
        selectProductDesc: "Veuillez sélectionner le produit pour le calcul de dosage",
        darteppDesc: "Calculateur de Dosage Antipaludique",
        artesunDesc: "Artesunate pour Injection",
        argesunDesc: "Calculateur de Dosage Artesunate Injectible",
        recommended: "Recommandé",
        comingSoon: "Prochainement",
        // D-Artepp
        darteppCalculatorTitle: "Calcul de Dosage D-Artepp®",
        darteppCalculatorDesc: "Sélectionnez le poids du patient en faisant glisser le cadran, le système calculera le dosage recommandé D-Artepp®",
        // Argesun
        argesunCalculatorTitle: "Calcul de Dosage Argesun®",
        argesunCalculatorDesc: "Sélectionnez le poids du patient, le système calculera le dosage recommandé d'Argesun® par injection",
        // Artesun
        artesunCalculatorTitle: "Calcul de Dosage Artesun®",
        artesunCalculatorDesc: "Sélectionnez le poids du patient et la voie d'injection, le système calculera le dosage recommandé d'Artesun® par injection",
        routeSelectionInstruction: "Sélectionnez IV pour injection intraveineuse lente ou IM pour injection intramusculaire",
        // 通用
        weightSelector: "Sélecteur de Poids",
        manualInput: "Ou saisir manuellement le poids",
        weightRange: "Plage: 0-100kg",
        weightRangeDartepp: "Plage: 5-100kg", // D-Artepp专用
        dosagePlan: "Plan de Dosage Recommandé",
        selectWeight: "Veuillez sélectionner le poids",
        selectWeightDesc: "Faites glisser le cadran à gauche pour définir le poids du patient",
        backToProducts: "Retour aux Produits",
        footerCopyright: "© 2025 Calculateur de Dosage Médical. Outil médical professionnel pour une médication sûre.",
        footerDisclaimer: "Cet outil est à titre indicatif seulement, suivez les conseils médicaux pour la médication réelle.",
        // D-Artepp 结果
        darteppDosageResultTitle: "Dosage D-Artepp® basé sur le poids",
        darteppDosageResultSubtitle: "D-Artepp® - Plan de traitement de trois jours",
        // Argesun 结果
        argesunDosageResultTitle: "Dosage Argesun® basé sur le poids",
        argesunDosageResultSubtitle: "Argesun® - Artesunate Injectible (Solvant Unique)",
        // Artesun 结果
        artesunDosageResultTitle: "Dosage Artesun® basé sur le poids {weight}kg",
        artesunDosageResultSubtitle: "Artesun® - Artesunate Injectible (Double Solvant)",
        // 通用结果
        patientWeight: "Poids du Patient",
        recommendedMedication: "Plan de Médication Recommandé:",
        dosageInstruction: "Dosage recommandé:",
        medicationInstructions: "Instructions de Médication:",
        takeDaily: "Prendre quotidiennement",
        forDays: "pendant 3 jours",
        pleaseFollow: "Veuillez suivre strictement les conseils médicaux. Consultez immédiatement un médecin en cas de réactions indésirables.",
        weightOutOfRange: "Poids hors limites",
        checkWeight: "Veuillez vérifier si la saisie du poids est correcte (0-100kg)",
        checkWeightDartepp: "Veuillez vérifier si la saisie du poids est correcte (5-100kg)", // D-Artepp专用
        selectProductAlert: "Veuillez d'abord sélectionner un produit",
        // 注射途径选择
        injectionRoute: "Voie d'Injection",
        selectRoute: "Sélectionner la Voie d'Injection",
        ivRoute: "Intraveineuse (IV)",
        imRoute: "Intramusculaire (IM)",
        ivRouteDesc: "10 mg/ml · Injection lente sur 1-2 minutes",
        imRouteDesc: "20 mg/ml · Injection dans la cuisse antérieure",
        finalInjectionVolume: "Volume d'Injection Final",
        reconstitutionGuide: "Guide de Reconstitution",
        vial: "flacon",
        concentration: "Concentration",
        // Argesun 特有
        dosageFormula: "Formule de dosage:",
        dosagePerKg: "Dosage par kg:",
        forAdults: "pour patients ≥20kg",
        forChildren: "pour enfants <20kg",
        reconstitutionSteps: "Étapes de reconstitution:",
        administrationMethod: "Méthode d'administration:",
        singleSolvent: "Système à solvant unique",
        dualSolvent: "Système à double solvant",
        immediateUse: "Doit être utilisé dans l'heure suivant la reconstitution",
        availableStrengths: "Forces disponibles:",
        reconstitutionVolume: "Volume de reconstitution:",
        injectionVolume: "Volume d'injection:",
        selectStrength: "Sélectionner la combinaison de forces",
        ivImNote: "Note: Même volume pour injection IV et IM (20mg/ml)",
        totalDose: "Dose totale:",
        // Artesun 特有
        bicarbonateVolume: "Volume Bicarbonate:",
        salineVolume: "Volume Saline:",
        ivConcentration: "Concentration IV: 10 mg/ml",
        imConcentration: "Concentration IM: 20 mg/ml",
        ivCalculation: "Calcul IV:",
        imCalculation: "Calcul IM:",
        roundUp: "Arrondir au ml supérieur",
        example: "Exemple:",
        reconstitutionNote: "Note de reconstitution:",
        useAllBicarbonate: "Utiliser tout le contenu de l'ampoule de bicarbonate",
        diluteNote: "Note de dilution:",
        removeAir: "Retirer l'air de l'ampoule avant l'injection de saline",
        patientInjection: "Volume d'injection final pour le patient",
        finalConcentration: "Concentration finale",
        // 新增
        alternativeOptions: "Options Alternatives:",
        optimalSelection: "Sélection Optimale"
    }
};

// D-Artepp 产品数据
const darteppData = {
    id: 'dartepp',
    name: 'D-Artepp®',
    description: {
        en: 'Antimalarial Dosage Calculator',
        zh: '抗疟疾药物剂量计算器',
        fr: 'Calculateur de Dosage Antipaludique'
    },
    types: [
        {
            name: {
                en: 'D-ARTEPP Dispersible',
                zh: 'D-ARTEPP 分散片',
                fr: 'D-ARTEPP Dispersible'
            },
            specifications: [
                { 
                    dosage: '20mg/160mg', 
                    weightRanges: [
                        { min: 5, max: 8, count: 1 },
                        { min: 11, max: 17, count: 2 }
                    ]
                },
                { 
                    dosage: '30mg/240mg', 
                    weightRanges: [
                        { min: 8, max: 11, count: 1 },
                        { min: 17, max: 25, count: 2 }
                    ]
                },
                { 
                    dosage: '40mg/320mg', 
                    weightRanges: [
                        { min: 25, max: 36, count: 2 }
                    ]
                }
            ]
        },
        {
            name: {
                en: 'D-ARTEPP',
                zh: 'D-ARTEPP',
                fr: 'D-ARTEPP'
            },
            specifications: [
                { 
                    dosage: '60mg/480mg', 
                    weightRanges: [
                        { min: 36, max: 60, count: 2 }
                    ]
                },
                { 
                    dosage: '80mg/640mg', 
                    weightRanges: [
                        { min: 60, max: 80, count: 2 },
                        { min: 80, max: 200, count: 2.5 }
                    ]
                }
            ]
        }
    ]
};

// Argesun 产品数据 - 基于你提供的剂量信息
const argesunData = {
    id: 'argesun',
    name: 'Argesun®',
    description: {
        en: 'Artesunate Injection Dosage Calculator',
        zh: '注射用青蒿琥酯剂量计算器',
        fr: 'Calculateur de Dosage Artesunate Injectible'
    },
    // 剂量计算公式
    dosageFormula: {
        adult: 2.4, // mg/kg for ≥20kg
        child: 3.0  // mg/kg for <20kg
    },
    // 可用规格
    strengths: [
        { 
            mg: 30, 
            solventVolume: 1.5, // ml
            vialSize: "5ml",
            ampouleSize: "3ml"
        },
        { 
            mg: 60, 
            solventVolume: 3.0,
            vialSize: "5ml",
            ampouleSize: "3ml"
        },
        { 
            mg: 120, 
            solventVolume: 6.0,
            vialSize: "7ml",
            ampouleSize: "6ml"
        },
        { 
            mg: 180, 
            solventVolume: 9.0,
            vialSize: "10ml",
            ampouleSize: "10ml"
        }
    ]
};

// Artesun 产品数据 - 基于你提供的法语文件
const artesunData = {
    id: 'artesun',
    name: 'Artesun®',
    description: {
        en: 'Artesunate for Injection',
        zh: '注射用青蒿琥酯',
        fr: 'Artesunate pour Injection'
    },
    // 剂量计算公式
    dosageFormula: {
        adult: 2.4, // mg/kg for ≥20kg
        child: 3.0  // mg/kg for <20kg
    },
    // 可用规格（双溶剂系统）
    strengths: [
        { 
            mg: 30, 
            bicarbonateVolume: 0.5, // ml (碳酸氢钠)
            salineVolume: 2.5,       // ml (氯化钠) - IV用量
            imSalineVolume: 1.0,     // ml (氯化钠) - IM估算用量
            afterReconstitution: 0.5, // 配制后体积
            afterDilutionIV: 6.0,     // 静脉稀释后总体积
            afterDilutionIM: 3.0      // 肌肉稀释后总体积
        },
        { 
            mg: 60, 
            bicarbonateVolume: 1.0,
            salineVolume: 5.0,
            imSalineVolume: 2.0,
            afterReconstitution: 1.0,
            afterDilutionIV: 6.0,
            afterDilutionIM: 3.0
        },
        { 
            mg: 120, 
            bicarbonateVolume: 2.0,
            salineVolume: 10.0,
            imSalineVolume: 4.0,
            afterReconstitution: 2.0,
            afterDilutionIV: 6.0,
            afterDilutionIM: 3.0
        }
    ],
    // 浓度
    concentrations: {
        iv: 10, // mg/ml 静脉注射
        im: 20  // mg/ml 肌肉注射
    }
};

// ==================== 多语言功能 ====================

// 更新页面文本
function updatePageText() {
    // 更新所有带有data-i18n属性的元素
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });
    
    // 更新"即将推出"的伪元素内容
    updateComingSoonLabels();
    
    // 更新剂量显示（如果已选择）
    if (selectedProduct) {
        updateDosageDisplay();
        
        // 更新计算器标题和描述
        updateCalculatorTitleAndDesc();
    }
    
    // 更新体重范围提示
    updateWeightRangeHint();
}

// 更新计算器标题和描述
function updateCalculatorTitleAndDesc() {
    if (!selectedProduct) return;
    
    const calculatorTitle = document.querySelector('#calculatorInterface .text-3xl');
    const calculatorDesc = document.querySelector('#calculatorInterface .text-gray-600');
    
    if (!calculatorTitle || !calculatorDesc) return;
    
    if (selectedProduct.id === 'dartepp') {
        calculatorTitle.textContent = translations[currentLanguage].darteppCalculatorTitle || 'D-Artepp® Dosage Calculation';
        calculatorDesc.textContent = translations[currentLanguage].darteppCalculatorDesc || 'Select patient weight by sliding the dial, system will calculate recommended D-Artepp® dosage';
    } else if (selectedProduct.id === 'argesun') {
        calculatorTitle.textContent = translations[currentLanguage].argesunCalculatorTitle || 'Argesun® Dosage Calculation';
        calculatorDesc.textContent = translations[currentLanguage].argesunCalculatorDesc || 'Select patient weight, system will calculate recommended Argesun® dosage';
    } else if (selectedProduct.id === 'artesun') {
        calculatorTitle.textContent = translations[currentLanguage].artesunCalculatorTitle || 'Artesun® Dosage Calculation';
        calculatorDesc.textContent = translations[currentLanguage].artesunCalculatorDesc || 'Select patient weight and injection route, system will calculate recommended Artesun® dosage';
    }
}

// 更新"即将推出"标签
function updateComingSoonLabels() {
    const comingSoonDivs = document.querySelectorAll('.coming-soon .text-sm.text-gray-500.font-medium');
    comingSoonDivs.forEach(div => {
        if (div.hasAttribute('data-i18n')) {
            const key = div.getAttribute('data-i18n');
            if (translations[currentLanguage] && translations[currentLanguage][key]) {
                div.textContent = translations[currentLanguage][key];
            }
        }
    });
}

// 切换语言
function changeLanguage(lang) {
    if (translations[lang]) {
        currentLanguage = lang;
        
        // 保存语言选择到本地存储
        localStorage.setItem('preferredLanguage', lang);
        
        // 更新页面文本
        updatePageText();
        
        // 更新语言切换器UI
        updateLanguageSwitcherUI();
        
        // 强制更新注射途径按钮
        updateRouteButtons();
        
        console.log(`Language changed to: ${lang}`);
    }
}

// 更新语言切换器UI
function updateLanguageSwitcherUI() {
    const currentLangDisplay = document.getElementById('currentLangDisplay');
    const languageOptions = document.querySelectorAll('.language-option');
    
    if (currentLangDisplay) {
        // 更新按钮文本
        const langText = {
            en: 'EN',
            zh: '中文',
            fr: 'FR'
        };
        currentLangDisplay.textContent = langText[currentLanguage] || 'EN';
    }
    
    // 更新选项激活状态
    languageOptions.forEach(option => {
        const lang = option.getAttribute('data-lang');
        if (lang === currentLanguage) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

// 初始化语言 - 检查是否是第一次访问
function initializeLanguage() {
    console.log('Initializing language...');
    
    // 检查是否是第一次访问
    const isFirstVisit = !localStorage.getItem('hasVisitedBefore');
    
    if (isFirstVisit) {
        // 第一次访问，总是显示英文
        currentLanguage = 'en';
        console.log('First visit - showing English');
        
        // 标记已经访问过
        localStorage.setItem('hasVisitedBefore', 'true');
    } else {
        // 不是第一次访问，使用用户保存的语言
        const savedLanguage = localStorage.getItem('preferredLanguage');
        
        if (savedLanguage && translations[savedLanguage]) {
            currentLanguage = savedLanguage;
            console.log('Returning visitor - using saved language:', currentLanguage);
        } else {
            // 没有保存的语言，但也不是第一次访问，使用浏览器语言检测
            const browserLanguage = navigator.language.split('-')[0];
            
            if (browserLanguage === 'zh' && translations['zh']) {
                currentLanguage = 'zh';
            } else if (browserLanguage === 'fr' && translations['fr']) {
                currentLanguage = 'fr';
            } else {
                currentLanguage = 'en';
            }
            console.log('Returning visitor - using browser language:', currentLanguage);
        }
    }
    
    // 更新页面
    updatePageText();
    updateLanguageSwitcherUI();
    
    console.log('Language initialized to:', currentLanguage);
}

// ==================== 注射途径选择功能 ====================

// 设置注射途径
function setInjectionRoute(route) {
    injectionRoute = route;
    updateRouteButtons();
    updateDosageDisplay();
}

// 更新注射途径按钮状态
function updateRouteButtons() {
    const ivBtn = document.getElementById('ivRouteBtn');
    const imBtn = document.getElementById('imRouteBtn');
    
    if (!ivBtn || !imBtn) return;
    
    // 更新按钮样式
    if (injectionRoute === 'iv') {
        ivBtn.className = 'route-btn bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex-1';
        imBtn.className = 'route-btn bg-white border-2 border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex-1';
    } else {
        ivBtn.className = 'route-btn bg-white border-2 border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex-1';
        imBtn.className = 'route-btn bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors flex-1';
    }
    
    // 获取当前语言的翻译
    const ivText = translations[currentLanguage].ivRoute || 'IV';
    const imText = translations[currentLanguage].imRoute || 'IM';
    const ivDesc = translations[currentLanguage].ivRouteDesc || '10 mg/ml · Slow injection over 1-2 minutes';
    const imDesc = translations[currentLanguage].imRouteDesc || '20 mg/ml · Anterior thigh injection';
    
    // 更新按钮文本
    ivBtn.innerHTML = `
        <div class="font-bold">${ivText}</div>
        <div class="text-xs mt-1">${ivDesc}</div>
    `;
    imBtn.innerHTML = `
        <div class="font-bold">${imText}</div>
        <div class="text-xs mt-1">${imDesc}</div>
    `;
}

// ==================== 核心初始化 ====================

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('Medical Dosage Calculator loaded');
    
    // 初始化语言
    initializeLanguage();
    
    // 初始化刻度盘（只在计算器界面显示时）
    const calculatorInterface = document.getElementById('calculatorInterface');
    if (calculatorInterface && !calculatorInterface.classList.contains('hidden')) {
        initializeScale();
        updateWeightDisplay();
    }
    
    // 设置事件监听器
    setupEventListeners();
});

// ==================== 刻度盘功能（新增专用函数） ====================

// 主刻度盘初始化函数
function initializeScale() {
    if (selectedProduct && selectedProduct.id === 'dartepp') {
        initializeDarteppScale();
    } else {
        initializeGeneralScale();
    }
}

// ==================== 通用刻度盘函数 ====================

// 通用刻度盘初始化
function initializeGeneralScale() {
    const scaleContainer = document.getElementById('scaleContainer');
    if (!scaleContainer) return;
    
    scaleContainer.innerHTML = '';
    
    // 通用刻度范围: 0-100kg
    const minWeight = 0;
    const maxWeight = 100;
    const step = 1;
    const majorStep = 10;
    
    // 创建刻度线和数字
    for (let kg = minWeight; kg <= maxWeight; kg += step) {
        const angle = mapGeneralWeightToAngle(kg);
        
        // 创建刻度线
        const line = document.createElement('div');
        line.className = kg % majorStep === 0 ? 'scale-line major' : 'scale-line minor';
        line.style.transform = `translateX(-50%) rotate(${angle}deg)`;
        scaleContainer.appendChild(line);
        
        // 创建数字标签
        if (kg % majorStep === 0) {
            const number = document.createElement('div');
            number.className = 'scale-number';
            number.textContent = kg;
            number.style.transform = `translateX(-50%) rotate(${angle}deg)`;
            scaleContainer.appendChild(number);
        }
    }
}

// 通用体重→角度映射
function mapGeneralWeightToAngle(weight) {
    // 通用: 0kg=135°，100kg=45°
    return 0 + weight * (180 / 100);
}

// 通用角度→体重映射
function mapAngleToGeneralWeight(angle) {
    let weight = angle * (100 / 180);
    weight = Math.max(0, Math.min(100, weight));
    
    if (weight <= 0.05) {
        weight = 0.1;
    }
    
    return weight;
}

// 通用体重设置
function setGeneralWeight(weight) {
    weight = parseFloat(weight);
    if (isNaN(weight)) return;
    
    if (weight < 0.1) {
        weight = 0.1;
    } else if (weight > 100) {
        weight = 100;
    }
    
    currentWeight = weight;
    
    const originalAngle = mapGeneralWeightToAngle(currentWeight);
    currentRotation = 0 - originalAngle;
    currentRotation = Math.max(-180, Math.min(0, currentRotation));
    
    updateDialRotation();
}

// ==================== D-ARTEPP专用刻度盘函数 ====================

// D-Artepp专用刻度盘初始化
function initializeDarteppScale() {
    const scaleContainer = document.getElementById('scaleContainer');
    if (!scaleContainer) return;
    
    scaleContainer.innerHTML = '';
    
    // D-Artepp刻度范围: 5-100kg
    const minWeight = 5;
    const maxWeight = 100;
    const step = 1;
    const majorStep = 5;
    
    // 创建刻度线和数字
    for (let kg = minWeight; kg <= maxWeight; kg += step) {
        const angle = mapDarteppWeightToAngle(kg);
        
        // 创建刻度线
        const line = document.createElement('div');
        line.className = kg % majorStep === 0 ? 'scale-line major' : 'scale-line minor';
        line.style.transform = `translateX(-50%) rotate(${angle}deg)`;
        scaleContainer.appendChild(line);
        
        // 创建数字标签（每10kg一个数字，加上5kg）
        if (kg % 10 === 0 || kg === 5) {
            const number = document.createElement('div');
            number.className = 'scale-number';
            number.textContent = kg;
            number.style.transform = `translateX(-50%) rotate(${angle}deg)`;
            scaleContainer.appendChild(number);
        }
    }
}

// D-Artepp专用体重→角度映射
function mapDarteppWeightToAngle(weight) {
    // D-Artepp: 5kg=135°，100kg=45°
    return 0 + (weight) * (171 / 95);
}

// D-Artepp专用角度→体重映射
function mapAngleToDarteppWeight(angle) {
    let weight = angle * (95 / 171);
    weight = Math.max(5, Math.min(100, weight));
    
    return weight;
}

// D-Artepp专用体重设置
function setDarteppWeight(weight) {
    weight = parseFloat(weight);
    if (isNaN(weight)) return;
    
    if (weight < 5) {
        weight = 5;
    } else if (weight > 100) {
        weight = 100;
    }
    
    currentWeight = weight;
    
    const originalAngle = mapDarteppWeightToAngle(currentWeight);
    currentRotation = 0 - originalAngle;
    currentRotation = Math.max(-180, Math.min(-9, currentRotation));
    
    updateDialRotation();
}

// D-Artepp专用快速选择按钮设置
function setupDarteppQuickSelectButtons() {
    // 隐藏小于5kg的按钮
    document.querySelectorAll('.quick-select-button').forEach(button => {
        const weightText = button.textContent.replace('kg', '').trim();
        const weight = parseInt(weightText);
        if (weight < 5) {
            button.style.display = 'none';
        } else {
            button.style.display = 'inline-flex';
        }
    });
}

// 恢复通用快速选择按钮
function setupGeneralQuickSelectButtons() {
    document.querySelectorAll('.quick-select-button').forEach(button => {
        button.style.display = 'inline-flex';
    });
}

// ==================== 拖拽处理函数 ====================

// D-Artepp专用拖拽处理
function handleDarteppDialDrag(e, isTouch = false) {
    if (!isDragging) return;
    
    const semicircleDial = document.getElementById('semicircleDial');
    const rect = semicircleDial.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    let clientX, clientY;
    if (isTouch) {
        const touch = e.touches[0];
        clientX = touch.clientX;
        clientY = touch.clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    
    const currentAngle = Math.atan2(clientY - centerY, clientX - centerX) * 180 / Math.PI;
    const deltaAngle = currentAngle - startAngle;
    
    currentRotation += deltaAngle * 0.5;
    currentRotation = Math.max(-180, Math.min(-9, currentRotation));
    
    semicircleDial.style.transform = `rotate(${currentRotation}deg)`;
    
    const originalAngle = 0 - currentRotation;
    let calculatedWeight = mapAngleToDarteppWeight(originalAngle);
    
    
    currentWeight = calculatedWeight;
    startAngle = currentAngle;
    updateWeightDisplay();
}

// 通用拖拽处理
function handleGeneralDialDrag(e, isTouch = false) {
    if (!isDragging) return;
    
    const semicircleDial = document.getElementById('semicircleDial');
    const rect = semicircleDial.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    let clientX, clientY;
    if (isTouch) {
        const touch = e.touches[0];
        clientX = touch.clientX;
        clientY = touch.clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    
    const currentAngle = Math.atan2(clientY - centerY, clientX - centerX) * 180 / Math.PI;
    const deltaAngle = currentAngle - startAngle;
    
    currentRotation += deltaAngle * 0.5;
    currentRotation = Math.max(-180, Math.min(0, currentRotation));
    
    semicircleDial.style.transform = `rotate(${currentRotation}deg)`;
    
    const originalAngle = 0 - currentRotation;
    let calculatedWeight = mapAngleToGeneralWeight(originalAngle);
    
    if (calculatedWeight <= 0.05) {
        calculatedWeight = 0.1;
    }
    
    currentWeight = calculatedWeight;
    startAngle = currentAngle;
    updateWeightDisplay();
}

// ==================== 工具函数 ====================

// 体重→角度：5kg=135°，100kg=45°，顺时针增大
function mapWeightToAngle(weight) {
    return 0 + (weight) * (180/ 100);
}

// 角度→体重：0°=0kg，180°=100kg，顺时针增大
function mapAngleToWeight(angle) {
    const weight = angle * (100 / 180);
    let result = Math.max(0, Math.min(100, weight));
    
    // 如果计算出的体重为0或接近0，设为0.1
    if (result <= 0.05) {
        result = 0.1;
    }
    
    return result;
}

// 更新刻度盘旋转
function updateDialRotation() {
    const semicircleDial = document.getElementById('semicircleDial');
    if (!semicircleDial) return;
    
    semicircleDial.style.transform = `rotate(${currentRotation}deg)`;
    
    // 旋转后，指针指向的刻度原始角度 = 90° - currentRotation
    const originalAngle = 0 - currentRotation;
    
    // 根据产品选择对应的映射函数
    if (selectedProduct && selectedProduct.id === 'dartepp') {
        currentWeight = mapAngleToDarteppWeight(originalAngle);
    } else {
        currentWeight = mapAngleToGeneralWeight(originalAngle);
    }
    
    // 更新显示
    updateWeightDisplay();
}

// 更新体重范围提示
function updateWeightRangeHint() {
    const weightRangeHint = document.getElementById('weightRangeHint');
    if (!weightRangeHint) return;
    
    // 根据产品和语言更新范围提示
    if (selectedProduct && selectedProduct.id === 'dartepp') {
        // D-Artepp: 5-100kg
        weightRangeHint.textContent = translations[currentLanguage].weightRangeDartepp || 'Range: 5-100kg';
        weightRangeHint.style.color = '#ef4444';
        weightRangeHint.style.fontWeight = '500';
    } else {
        // 其他产品: 0-100kg
        weightRangeHint.textContent = translations[currentLanguage].weightRange || 'Range: 0-100kg';
        weightRangeHint.style.color = '#6b7280';
        weightRangeHint.style.fontWeight = 'normal';
    }
}

// 更新体重显示
function updateWeightDisplay() {
    const currentWeightDisplay = document.getElementById('currentWeight');
    const manualWeightInput = document.getElementById('manualWeight');
    
    // 检查体重是否在有效范围内
    if (selectedProduct && selectedProduct.id === 'dartepp') {
        if (currentWeight < 5) {
            currentWeight = 5;
            const originalAngle = mapDarteppWeightToAngle(currentWeight);
            currentRotation = 0 - originalAngle;
            updateDialRotation();
        }
    } else {
        if (currentWeight < 0.1) {
            currentWeight = 0.1;
            const originalAngle = mapGeneralWeightToAngle(currentWeight);
            currentRotation = 0 - originalAngle;
            updateDialRotation();
        }
    }
    
    if (currentWeightDisplay) {
        currentWeightDisplay.textContent = currentWeight.toFixed(1);
    }
    
    if (manualWeightInput) {
        manualWeightInput.value = currentWeight.toFixed(1);
        // 设置最小输入值
        manualWeightInput.min = selectedProduct?.id === 'dartepp' ? '5' : '0.1';
    }
    
    // 更新体重范围提示
    updateWeightRangeHint();
    
    // 如果已选择产品，自动更新剂量显示
    if (selectedProduct) {
        updateDosageDisplay();
    }
}

// 设置体重 - 这个函数会被HTML中的onclick调用
function setWeight(weight) {
    weight = parseFloat(weight);
    if (isNaN(weight)) return;
    
    // 根据产品选择对应的设置函数
    if (selectedProduct && selectedProduct.id === 'dartepp') {
        setDarteppWeight(weight);
    } else {
        setGeneralWeight(weight);
    }
}

// ==================== 事件处理 ====================

// 设置事件监听器
function setupEventListeners() {
    // 手动体重输入
    const manualWeightInput = document.getElementById('manualWeight');
    if (manualWeightInput) {
        manualWeightInput.addEventListener('blur', handleManualWeightInput);
        manualWeightInput.addEventListener('keydown', handleManualWeightKeyDown);
    }
    
    // 返回产品选择按钮
    const backButton = document.getElementById('backToProduct');
    if (backButton) {
        backButton.addEventListener('click', showProductSelection);
    }
    
    // 快速选择按钮事件
    document.querySelectorAll('button[onclick^="setWeight"]').forEach(button => {
        button.addEventListener('click', function() {
            const weightText = this.textContent.replace('kg', '').trim();
            const weight = parseInt(weightText);
            if (!isNaN(weight)) {
                setWeight(weight);
            }
        });
    });
    
    // 语言切换器事件
    setupLanguageSwitcher();
    
    // 设置刻度盘拖拽事件
    setupDialEvents();
}

// 设置语言切换器事件
function setupLanguageSwitcher() {
    const languageToggle = document.getElementById('languageToggle');
    const languageDropdown = document.getElementById('languageDropdown');
    const languageOptions = document.querySelectorAll('.language-option');
    
    if (languageToggle && languageDropdown) {
        // 切换下拉菜单显示
        languageToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            languageDropdown.classList.toggle('show');
        });
        
        // 点击选项切换语言
        languageOptions.forEach(option => {
            option.addEventListener('click', function() {
                const lang = this.getAttribute('data-lang');
                changeLanguage(lang);
                languageDropdown.classList.remove('show');
            });
        });
        
        // 点击页面其他地方关闭下拉菜单
        document.addEventListener('click', function() {
            languageDropdown.classList.remove('show');
        });
        
        // 阻止下拉菜单内的点击事件冒泡
        languageDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
}

// 设置刻度盘拖拽事件
function setupDialEvents() {
    const semicircleDial = document.getElementById('semicircleDial');
    if (!semicircleDial) return;
    
    // 鼠标事件
    semicircleDial.addEventListener('mousedown', function(e) {
        isDragging = true;
        const rect = this.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI;
        document.body.style.cursor = 'grabbing';
        this.style.transition = 'none';
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        
        if (selectedProduct && selectedProduct.id === 'dartepp') {
            handleDarteppDialDrag(e, false);
        } else {
            handleGeneralDialDrag(e, false);
        }
    });
    
    document.addEventListener('mouseup', function() {
        if (!isDragging) return;
        
        isDragging = false;
        document.body.style.cursor = 'default';
        
        const semicircleDial = document.getElementById('semicircleDial');
        if (semicircleDial) {
            semicircleDial.style.transition = 'transform 0.2s ease';
        }
        
        // 检查体重最小值
        if (selectedProduct && selectedProduct.id === 'dartepp') {
            if (currentWeight <= 5) {
                setWeight(5);
            }
        } else {
            if (currentWeight <= 0.05) {
                setWeight(0.1);
            }
        }
    });

    // 触摸事件
    semicircleDial.addEventListener('touchstart', function(e) {
        isDragging = true;
        const touch = e.touches[0];
        const rect = this.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        startAngle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX) * 180 / Math.PI;
        this.style.transition = 'none';
    });

    document.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        e.preventDefault();
        
        if (selectedProduct && selectedProduct.id === 'dartepp') {
            handleDarteppDialDrag(e, true);
        } else {
            handleGeneralDialDrag(e, true);
        }
    });

    document.addEventListener('touchend', function() {
        if (!isDragging) return;
        
        isDragging = false;
        const semicircleDial = document.getElementById('semicircleDial');
        if (semicircleDial) {
            semicircleDial.style.transition = 'transform 0.2s ease';
        }
        
        // 检查体重最小值
        if (selectedProduct && selectedProduct.id === 'dartepp') {
            if (currentWeight <= 5) {
                setWeight(5);
            }
        } else {
            if (currentWeight <= 0.05) {
                setWeight(0.1);
            }
        }
    });
}

// 处理手动体重输入
function handleManualWeightInput(event) {
    const input = event.target;
    const weight = parseFloat(input.value);
    
    if (!isNaN(weight)) {
        // 根据产品设置最小值
        const minWeight = selectedProduct?.id === 'dartepp' ? 5 : 0.1;
        
        if (weight < minWeight) {
            setWeight(minWeight);
        } else if (weight >= minWeight && weight <= 100) {
            setWeight(weight);
        } else {
            input.value = currentWeight.toFixed(1);
        }
    } else {
        input.value = currentWeight.toFixed(1);
    }
}

function handleManualWeightKeyDown(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const input = event.target;
        const weight = parseFloat(input.value);
        
        if (!isNaN(weight)) {
            const minWeight = selectedProduct?.id === 'dartepp' ? 5 : 0.1;
            
            if (weight < minWeight) {
                setWeight(minWeight);
            } else if (weight >= minWeight && weight <= 100) {
                setWeight(weight);
            } else {
                input.value = currentWeight.toFixed(1);
            }
        } else {
            input.value = currentWeight.toFixed(1);
        }
        
        input.blur();
    }
}

// 产品选择功能 - 这个函数会被HTML中的onclick调用
function selectProduct(product) {
    if (product === 'dartepp') {
        selectedProduct = darteppData;
        showCalculatorInterface();
    } else if (product === 'argesun') {
        selectedProduct = argesunData;
        showCalculatorInterface();
    } else if (product === 'artesun') {
        selectedProduct = artesunData;
        showCalculatorInterface();
    }
}

// 显示计算器界面
function showCalculatorInterface() {
    const productSelection = document.getElementById('productSelection');
    const calculatorInterface = document.getElementById('calculatorInterface');
    
    if (productSelection && calculatorInterface) {
        productSelection.classList.add('hidden');
        calculatorInterface.classList.remove('hidden');
        
        // 初始化对应的刻度盘
        initializeScale();
        
        // 设置初始体重
        if (selectedProduct.id === 'dartepp') {
            setWeight(35); // D-Artepp最小5kg，35kg是安全的初始值
            setupDarteppQuickSelectButtons();
        } else {
            setWeight(35); // 其他产品从0开始
            setupGeneralQuickSelectButtons();
        }
        
        // 更新计算器标题和描述
        updateCalculatorTitleAndDesc();
        
        // 更新体重范围提示
        updateWeightRangeHint();
        
        // 如果是Artesun，显示注射途径选择
        const routeSelector = document.getElementById('injectionRouteSelector');
        if (selectedProduct.id === 'artesun' && routeSelector) {
            routeSelector.classList.remove('hidden');
            updateRouteButtons();
        } else if (routeSelector) {
            routeSelector.classList.add('hidden');
        }
        
        // 添加选中效果
        document.querySelectorAll('.product-card').forEach(card => {
            card.classList.remove('selected');
            const title = card.querySelector('h3');
            if (title && title.textContent === selectedProduct.name) {
                card.classList.add('selected');
            }
        });
    }
}

// 显示产品选择界面
function showProductSelection() {
    const productSelection = document.getElementById('productSelection');
    const calculatorInterface = document.getElementById('calculatorInterface');
    
    if (productSelection && calculatorInterface) {
        productSelection.classList.remove('hidden');
        calculatorInterface.classList.add('hidden');
        selectedProduct = null;
        
        // 移除选中效果
        document.querySelectorAll('.product-card').forEach(card => {
            card.classList.remove('selected');
        });
    }
}

// ==================== 剂量计算 ====================

// 辅助函数：处理剂量标题中的占位符
function getDosageResultTitle(weight) {
    let titleTemplate;
    
    if (selectedProduct.id === 'dartepp') {
        titleTemplate = translations[currentLanguage].darteppDosageResultTitle || 'D-Artepp® dosage based on weight';
    } else if (selectedProduct.id === 'argesun') {
        titleTemplate = translations[currentLanguage].argesunDosageResultTitle || 'Argesun® dosage based on weight';
    } else if (selectedProduct.id === 'artesun') {
        titleTemplate = translations[currentLanguage].artesunDosageResultTitle || 'Artesun® dosage based on weight {weight}kg';
    } else {
        titleTemplate = 'Recommended dosage based on weight';
    }
    
    // 检查标题模板中是否包含 {weight} 占位符
    if (titleTemplate.includes('{weight}')) {
        // 替换占位符为实际体重
        return titleTemplate.replace('{weight}', weight.toFixed(1));
    } else {
        // 没有占位符，直接返回标题
        return titleTemplate;
    }
}

// 获取产品副标题
function getProductSubtitle() {
    if (selectedProduct.id === 'dartepp') {
        return translations[currentLanguage].darteppDosageResultSubtitle || 'D-Artepp® - Three-day treatment plan';
    } else if (selectedProduct.id === 'argesun') {
        return translations[currentLanguage].argesunDosageResultSubtitle || 'Argesun® - Injectable Artesunate (Single Solvent)';
    } else if (selectedProduct.id === 'artesun') {
        return translations[currentLanguage].artesunDosageResultSubtitle || 'Artesun® - Injectable Artesunate (Dual Solvent)';
    }
    return '';
}

// 显示选择体重提示
function showSelectWeightPrompt(container) {
    container.innerHTML = `
        <div class="text-center text-gray-500 py-8">
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
            <p class="text-lg font-medium mb-2">${translations[currentLanguage].selectWeight || 'Please select weight'}</p>
            <p class="text-sm">${translations[currentLanguage].selectWeightDesc || 'Slide the dial on the left to set patient weight'}</p>
        </div>
    `;
}

// 显示体重超出范围错误
function showWeightOutOfRangeError(container) {
    // 根据产品显示不同的范围提示
    const checkWeightText = selectedProduct?.id === 'dartepp' ? 
        translations[currentLanguage].checkWeightDartepp || 'Please check if weight input is correct (5-100kg)' :
        translations[currentLanguage].checkWeight || 'Please check if weight input is correct (0-100kg)';
    
    container.innerHTML = `
        <div class="text-center text-red-500 py-8">
            <svg class="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <p class="font-medium">${translations[currentLanguage].weightOutOfRange || 'Weight out of range'}</p>
            <p class="text-sm">${checkWeightText}</p>
        </div>
    `;
}

// 更新剂量显示
function updateDosageDisplay() {
    const dosageResult = document.getElementById('dosageResult');
    if (!dosageResult) return;
    
    // 如果没有选择产品，显示默认提示
    if (!selectedProduct) {
        showSelectWeightPrompt(dosageResult);
        return;
    }
    
    // 检查体重是否在有效范围内
    const minWeight = selectedProduct.id === 'dartepp' ? 5 : 0;
    if (currentWeight < minWeight || currentWeight > 100) {
        showWeightOutOfRangeError(dosageResult);
        return;
    }
    
    // 根据产品类型选择不同的计算和显示方式
    if (selectedProduct.id === 'dartepp') {
        displayDarteppResult(dosageResult);
    } else if (selectedProduct.id === 'argesun') {
        displayArgesunResult(dosageResult);
    } else if (selectedProduct.id === 'artesun') {
        displayArtesunResult(dosageResult);
    }
}

// 显示D-Artepp结果
function displayDarteppResult(container) {
    const result = findDosageRecommendation(currentWeight);
    
    if (!result) {
        showWeightOutOfRangeError(container);
        return;
    }
    
    // 根据当前语言获取药品名称
    const medicationType = dosage => {
        if (typeof dosage.type === 'object') {
            return dosage.type[currentLanguage] || dosage.type.en;
        }
        return dosage.type;
    };
    
    // 获取药品单位的翻译
    const getTabletText = () => {
        switch(currentLanguage) {
            case 'zh': return '片';
            case 'fr': return 'comprimés';
            default: return 'tablets';
        }
    };
    
    const tabletText = getTabletText();
    
    const dosageHtml = result.dosages.map(dosage => `
        <div class="bg-white rounded-lg p-4 mb-3 border border-gray-200 hover:shadow-md transition-shadow">
            <div class="flex justify-between items-center mb-2">
                <div>
                    <span class="font-semibold text-gray-800">${medicationType(dosage)}</span>
                    <span class="ml-2 text-sm text-gray-600">${dosage.specification}</span>
                </div>
                <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-bold">${dosage.count} ${tabletText}</span>
            </div>
            <div class="text-sm text-gray-600">
                ${translations[currentLanguage].dosageInstruction || 'Recommended dosage:'} ${translations[currentLanguage].takeDaily || 'Take daily'} ${dosage.count} ${tabletText} ${translations[currentLanguage].forDays || 'for 3 days'}
            </div>
        </div>
    `).join('');
    
    // 使用辅助函数获取处理后的标题
    const dosageTitle = getDosageResultTitle(currentWeight);
    const productSubtitle = getProductSubtitle();
    
    container.innerHTML = `
        <div class="dosage-result p-6 rounded-lg">
            <div class="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div class="mb-4 md:mb-0">
                    <h4 class="text-lg font-semibold text-gray-800">${dosageTitle}</h4>
                    <p class="text-sm text-gray-600 mt-1">${productSubtitle}</p>
                </div>
                <div class="text-center md:text-right">
                    <div class="text-2xl font-bold number-display text-blue-600">${currentWeight.toFixed(1)} kg</div>
                    <div class="text-sm text-gray-500">${translations[currentLanguage].patientWeight || 'Patient Weight'}</div>
                </div>
            </div>
            
            <div class="space-y-3 mb-6">
                <h5 class="font-medium text-gray-700">${translations[currentLanguage].recommendedMedication || 'Recommended Medication Plan:'}</h5>
                ${dosageHtml}
            </div>
            
            <div class="mt-6 p-4 bg-blue-50 rounded-lg">
                <div class="flex items-start">
                    <svg class="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div>
                        <p class="text-sm text-blue-800">
                            <strong>${translations[currentLanguage].medicationInstructions || 'Medication Instructions:'}</strong> 
                            ${translations[currentLanguage].pleaseFollow || 'Please strictly follow medical advice. Seek medical attention immediately if adverse reactions occur.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 显示Argesun结果
function displayArgesunResult(container) {
    const result = findArgesunDosage(currentWeight);
    
    if (!result) {
        showWeightOutOfRangeError(container);
        return;
    }
    
    // 根据当前语言获取药品单位的翻译
    const getVialText = () => {
        switch(currentLanguage) {
            case 'zh': return '瓶';
            case 'fr': return 'flacon';
            default: return 'vial';
        }
    };
    
    const vialText = getVialText();
    const mlText = currentLanguage === 'zh' ? '毫升' : 'ml';
    
    // 获取替代方案
    const alternatives = getArgesunAlternatives(result.combination);
    
    // 构建规格显示HTML
    const strengthsHtml = Object.entries(result.recommendedStrengths).map(([strength, count]) => {
        const strengthInfo = argesunData.strengths.find(s => s.mg === parseInt(strength));
        
        // 查找此规格的替代方案
        const strengthAlternatives = alternatives.filter(alt => {
            const altStrength = parseInt(Object.keys(alt.recommendedStrengths)[0]);
            return altStrength !== parseInt(strength) && 
                   alt.totalMg >= result.totalDose * 0.95 && 
                   alt.totalMg <= result.totalDose * 1.1;
        });
        
        let alternativesHtml = '';
        if (strengthAlternatives.length > 0) {
            const altText = strengthAlternatives.map(alt => {
                const altStrength = Object.keys(alt.recommendedStrengths)[0];
                const altCount = alt.recommendedStrengths[altStrength];
                return `${altCount} × ${altStrength}mg`;
            }).join(', ');
            
            alternativesHtml = `
                <div class="mt-2 text-xs text-gray-500">
                    <span class="font-medium">${translations[currentLanguage].alternativeOptions || 'Alternative Options:'}</span> ${altText}
                </div>
            `;
        }
        
        return `
            <div class="bg-white rounded-lg p-4 mb-3 border border-gray-200 hover:shadow transition-shadow">
                <div class="flex justify-between items-center">
                    <div class="flex items-center">
                        <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <span class="font-bold text-blue-700">${strength}</span>
                        </div>
                        <div>
                            <div class="font-semibold text-gray-800">Argesun® ${strength}mg</div>
                            <div class="text-sm text-gray-600">
                                ${translations[currentLanguage].reconstitutionVolume || 'Reconstitution volume'}: ${strengthInfo.solventVolume}${mlText}
                            </div>
                            ${alternativesHtml}
                        </div>
                    </div>
                    <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full font-bold">
                        ${count} ${vialText}${currentLanguage === 'zh' ? '' : (count > 1 ? 's' : '')}
                    </span>
                </div>
            </div>
        `;
    }).join('');
    
    // 使用辅助函数获取处理后的标题
    const dosageTitle = getDosageResultTitle(currentWeight);
    const productSubtitle = getProductSubtitle();
    
    container.innerHTML = `
        <div class="dosage-result p-6 rounded-lg">
            <div class="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div class="mb-4 md:mb-0">
                    <h4 class="text-lg font-semibold text-gray-800">${dosageTitle}</h4>
                    <p class="text-sm text-gray-600 mt-1">${productSubtitle}</p>
                </div>
                <div class="text-center md:text-right">
                    <div class="text-2xl font-bold number-display text-blue-600">${currentWeight.toFixed(1)} kg</div>
                    <div class="text-sm text-gray-500">${translations[currentLanguage].patientWeight || 'Patient Weight'}</div>
                </div>
            </div>
            
            <!-- 剂量公式 -->
            <div class="mb-6 p-4 bg-blue-50 rounded-lg">
                <div class="font-medium text-blue-800 mb-2">${translations[currentLanguage].dosageFormula || 'Dosage formula:'}</div>
                <div class="text-sm text-blue-700">
                    ${result.isChild ? 
                        `• ${translations[currentLanguage].forChildren || 'for children <20kg'}: ${argesunData.dosageFormula.child} mg/kg` :
                        `• ${translations[currentLanguage].forAdults || 'for patients ≥20kg'}: ${argesunData.dosageFormula.adult} mg/kg`
                    }
                </div>
                <div class="mt-2 text-lg font-bold text-blue-800">
                    ${translations[currentLanguage].totalDose || 'Total dose'}: <span class="number-display">${result.totalDose.toFixed(1)} mg</span>
                </div>
                <div class="mt-1 text-sm text-blue-600">
                    ${translations[currentLanguage].optimalSelection || 'Optimal Selection'}: ${result.combination.map(mg => `${mg}mg`).join(' + ')}
                </div>
            </div>
            
            <!-- 推荐规格 -->
            <div class="space-y-3 mb-6">
                <h5 class="font-medium text-gray-700">${translations[currentLanguage].selectStrength || 'Select Strength Combination'}:</h5>
                ${strengthsHtml}
            </div>
            
            <!-- 配制和注射信息 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div class="bg-white p-4 rounded-lg border border-gray-200">
                    <div class="font-medium text-gray-700 mb-2">${translations[currentLanguage].reconstitutionVolume || 'Reconstitution Volume'}</div>
                    <div class="text-2xl font-bold text-green-600 number-display">${result.reconstitutionVolume} ${mlText}</div>
                    <div class="text-sm text-gray-500 mt-1">${translations[currentLanguage].singleSolvent || 'Single-solvent system'}</div>
                </div>
                <div class="bg-white p-4 rounded-lg border border-gray-200">
                    <div class="font-medium text-gray-700 mb-2">${translations[currentLanguage].injectionVolume || 'Injection Volume'}</div>
                    <div class="text-2xl font-bold text-purple-600 number-display">${result.injectionVolume.toFixed(1)} ${mlText}</div>
                    <div class="text-sm text-gray-500 mt-1">Concentration: ${result.concentration}</div>
                </div>
            </div>
            
            <!-- 重要提示 -->
            <div class="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div class="flex items-start">
                    <svg class="w-5 h-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                    <div>
                        <p class="text-sm text-amber-800 font-medium mb-1">
                            ${translations[currentLanguage].ivImNote || 'Note: Same volume for IV and IM injection (20mg/ml)'}
                        </p>
                        <p class="text-sm text-amber-700">
                            <strong>${translations[currentLanguage].administrationMethod || 'Administration Method:'}</strong> 
                            ${translations[currentLanguage].immediateUse || 'Must be used within 1 hour after reconstitution'}
                        </p>
                    </div>
                </div>
            </div>
            
            <!-- 用药说明 -->
            <div class="mt-6 p-4 bg-blue-50 rounded-lg">
                <div class="flex items-start">
                    <svg class="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div>
                        <p class="text-sm text-blue-800">
                            <strong>${translations[currentLanguage].medicationInstructions || 'Medication Instructions:'}</strong> 
                            ${translations[currentLanguage].pleaseFollow || 'Please strictly follow medical advice. Seek medical attention immediately if adverse reactions occur.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 显示Artesun结果 - 已优化，智能选择规格组合
function displayArtesunResult(container) {
    const result = findArtesunDosage(currentWeight);
    
    if (!result) {
        showWeightOutOfRangeError(container);
        return;
    }
    
    const isIV = result.route === 'iv';
    const mlText = currentLanguage === 'zh' ? '毫升' : 'ml';
    const mgText = currentLanguage === 'zh' ? '毫克' : 'mg';
    
    // 获取替代方案
    const alternatives = getArtesunAlternatives(result.combination);
    
    // 构建规格显示HTML
    const strengthsHtml = Object.entries(result.recommendedStrengths).map(([strength, count]) => {
        const strengthInfo = artesunData.strengths.find(s => s.mg === parseInt(strength));
        
        // 查找此规格的替代方案
        const strengthAlternatives = alternatives.filter(alt => {
            const altStrength = parseInt(Object.keys(alt.recommendedStrengths)[0]);
            return altStrength !== parseInt(strength) && 
                   alt.totalMg >= result.totalDose * 0.95 && 
                   alt.totalMg <= result.totalDose * 1.1;
        });
        
        let alternativesHtml = '';
        if (strengthAlternatives.length > 0) {
            const altText = strengthAlternatives.map(alt => {
                const altStrength = Object.keys(alt.recommendedStrengths)[0];
                const altCount = alt.recommendedStrengths[altStrength];
                return `${altCount} × ${altStrength}mg`;
            }).join(', ');
            
            alternativesHtml = `
                <div class="mt-2 text-xs text-gray-500">
                    <span class="font-medium">${translations[currentLanguage].alternativeOptions || 'Alternative Options:'}</span> ${altText}
                </div>
            `;
        }
        
        return `
            <div class="bg-white rounded-lg p-4 mb-3 border border-gray-200 hover:shadow transition-shadow">
                <div class="flex justify-between items-center">
                    <div class="flex items-center">
                        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                            <span class="font-bold text-blue-700 text-lg">${strength}</span>
                        </div>
                        <div>
                            <div class="font-semibold text-gray-800">Artesun® ${strength}${mgText}</div>
                            <div class="text-sm text-gray-600 space-y-1">
                                <div>${translations[currentLanguage].bicarbonateVolume || 'Bicarbonate'}: ${strengthInfo.bicarbonateVolume}${mlText}</div>
                                <div>${translations[currentLanguage].salineVolume || 'Saline'}: ${isIV ? strengthInfo.salineVolume : strengthInfo.imSalineVolume}${mlText}</div>
                            </div>
                            ${alternativesHtml}
                        </div>
                    </div>
                    <span class="px-3 py-2 bg-green-100 text-green-800 rounded-full font-bold">
                        ${count} ${translations[currentLanguage].vial || 'vial'}${currentLanguage === 'zh' ? '' : (count > 1 ? 's' : '')}
                    </span>
                </div>
            </div>
        `;
    }).join('');
    
    // 核心信息卡片 - 修改后去掉总剂量
    const coreInfoCards = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <!-- 碳酸氢钠体积 -->
            <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-sm text-green-600 mb-1">${translations[currentLanguage].bicarbonateVolume || 'Bicarbonate Volume'}</div>
                        <div class="text-2xl font-bold text-green-700">${result.totalBicarbonateVolume} ${mlText}</div>
                    </div>
                    <div class="bg-green-100 p-2 rounded-lg">
                        <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                        </svg>
                    </div>
                </div>
                <div class="text-xs text-green-600 mt-2">
                    <div class="font-medium">${translations[currentLanguage].reconstitutionNote || 'Reconstitution Note'}:</div>
                    <div>${translations[currentLanguage].useAllBicarbonate || 'Use all content of bicarbonate ampoule'}</div>
                </div>
            </div>
            
            <!-- 氯化钠体积 -->
            <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-sm text-purple-600 mb-1">${translations[currentLanguage].salineVolume || 'Saline Volume'}</div>
                        <div class="text-2xl font-bold text-purple-700">${result.totalSalineVolume} ${mlText}</div>
                    </div>
                    <div class="bg-purple-100 p-2 rounded-lg">
                        <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
                        </svg>
                    </div>
                </div>
                <div class="text-xs text-purple-600 mt-2">
                    <div class="font-medium">${translations[currentLanguage].diluteNote || 'Dilution Note'}:</div>
                    <div>${translations[currentLanguage].removeAir || 'Remove air from ampoule before saline injection'}</div>
                </div>
            </div>
        </div>
    `;
    
    // 患者最终用量信息
    const patientInjectionInfo = `
    <div class="mb-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
        <div class="flex items-center justify-between mb-2">
            <div>
                <h5 class="font-bold text-lg text-blue-800">${translations[currentLanguage].patientInjection || 'Patient Final Injection'}</h5>
                <p class="text-sm text-blue-600">${isIV ? translations[currentLanguage].ivRouteDesc || 'Slow IV injection' : translations[currentLanguage].imRouteDesc || 'IM injection'}</p>
            </div>
            <div class="text-right">
                <div class="text-3xl font-bold text-green-700">${result.roundedInjectionVolume} ${mlText}</div>
                <div class="text-sm text-gray-600">${translations[currentLanguage].finalInjectionVolume || 'Final volume'}</div>
            </div>
        </div>
    </div>
`;
    
    container.innerHTML = `
        <div class="dosage-result p-6 rounded-lg bg-white">
            <!-- 顶部信息栏 -->
            <div class="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div class="mb-4 md:mb-0">
                    <h4 class="text-lg font-semibold text-gray-800">${getDosageResultTitle(currentWeight)}</h4>
                    <p class="text-sm text-gray-600 mt-1">${getProductSubtitle()}</p>
                </div>
                <div class="text-center md:text-right">
                    <div class="inline-flex items-center px-3 py-1 rounded-full ${isIV ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'} mb-2">
                        <span class="font-bold">${isIV ? translations[currentLanguage].ivRoute || 'IV' : translations[currentLanguage].imRoute || 'IM'}</span>
                    </div>
                    <div class="text-2xl font-bold text-blue-600">${result.weight.toFixed(1)} kg</div>
                    <div class="text-sm text-gray-500">${translations[currentLanguage].patientWeight || 'Patient Weight'}</div>
                </div>
            </div>
            
            ${coreInfoCards}
            
            <!-- 患者最终用量信息 -->
            ${patientInjectionInfo}
            
            <!-- 规格选择 -->
            <div class="mb-6">
                <h5 class="font-medium text-gray-700 mb-3">${translations[currentLanguage].selectStrength || 'Select Strength'}:</h5>
                <div class="mb-2 text-sm text-blue-600">
                    ${translations[currentLanguage].optimalSelection || 'Optimal Selection'}: ${result.combination.map(mg => `${mg}mg`).join(' + ')}
                </div>
                ${strengthsHtml}
            </div>
            
            <!-- 重要警告 -->
            <div class="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <div class="flex items-start">
                    <svg class="w-5 h-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                    <div>
                        <p class="text-sm text-red-800 font-medium mb-2">
                            ${translations[currentLanguage].reconstitutionNote || 'Important Notes'}
                        </p>
                        <ul class="text-sm text-red-700 space-y-1">
                            <li>• ${translations[currentLanguage].useAllBicarbonate || 'Use all bicarbonate'}</li>
                            <li>• ${translations[currentLanguage].removeAir || 'Remove air before injection'}</li>
                            <li>• ${translations[currentLanguage].immediateUse || 'Use within 1 hour'}</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <!-- 用药说明 -->
            <div class="mt-6 p-4 bg-blue-50 rounded-lg">
                <div class="flex items-start">
                    <svg class="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div>
                        <p class="text-sm text-blue-800">
                            <strong>${translations[currentLanguage].medicationInstructions || 'Medication Instructions:'}</strong> 
                            ${translations[currentLanguage].pleaseFollow || 'Please strictly follow medical advice. Seek medical attention immediately if adverse reactions occur.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ==================== 剂量计算核心算法 ====================

// 查找D-Artepp剂量推荐
function findDosageRecommendation(weight) {
    if (weight < 5 || weight > 100) return null;
    
    const dosages = [];
    
    // 检查 D-ARTEPP Dispersible
    const dispersible = darteppData.types[0];
    for (const spec of dispersible.specifications) {
        for (const range of spec.weightRanges) {
            if (weight >= range.min && weight < range.max) {
                dosages.push({
                    type: dispersible.name,
                    specification: spec.dosage,
                    count: range.count
                });
                break;
            }
        }
    }
    
    // 检查 D-ARTEPP
    const regular = darteppData.types[1];
    for (const spec of regular.specifications) {
        for (const range of spec.weightRanges) {
            if (weight >= range.min && weight < range.max) {
                dosages.push({
                    type: regular.name,
                    specification: spec.dosage,
                    count: range.count
                });
                break;
            }
        }
    }
    
    if (dosages.length === 0) return null;
    
    return {
        weight: weight,
        dosages: dosages
    };
}

// 查找Argesun剂量推荐 - 智能选择最佳规格组合
function findArgesunDosage(weight) {
    if (weight < 0 || weight > 100) return null;
    
    // 计算总剂量 (mg)
    const dosagePerKg = weight < 20 ? argesunData.dosageFormula.child : argesunData.dosageFormula.adult;
    const totalDose = weight * dosagePerKg;
    
    // 智能选择最佳规格组合
    const bestCombination = findBestArgesunStrengthCombination(totalDose);
    
    if (!bestCombination) return null;
    
    const { combination, totalMg } = bestCombination;
    
    // 计算每种规格需要多少瓶
    const strengthCounts = {};
    combination.forEach(strength => {
        strengthCounts[strength] = (strengthCounts[strength] || 0) + 1;
    });
    
    // 计算配制后的总体积 (ml) 和注射体积 (ml)
    // 配制后浓度均为 20mg/ml
    const reconstitutionVolume = combination.reduce((total, strength) => {
        const strengthInfo = argesunData.strengths.find(s => s.mg === strength);
        return total + (strengthInfo ? strengthInfo.solventVolume : 0);
    }, 0);
    
    const injectionVolume = totalDose / 20; // 20mg/ml
    
    return {
        weight: weight,
        totalDose: totalDose,
        dosagePerKg: dosagePerKg,
        isChild: weight < 20,
        recommendedStrengths: strengthCounts,
        combination: combination, // 保存实际的组合数组
        totalMg: totalMg, // 实际使用的总毫克数
        reconstitutionVolume: reconstitutionVolume,
        injectionVolume: injectionVolume,
        concentration: "20 mg/ml",
        route: "both" // IV和IM使用相同体积
    };
}

// Argesun的智能组合选择算法
function findBestArgesunStrengthCombination(totalDose) {
    const strengths = argesunData.strengths.map(s => s.mg).sort((a, b) => b - a); // 从大到小排序
    
    // 简单的贪心算法：优先使用大规格
    let combination = [];
    let remaining = totalDose;
    
    for (const strength of strengths) {
        const count = Math.floor(remaining / strength);
        if (count > 0) {
            for (let i = 0; i < count; i++) {
                combination.push(strength);
            }
            remaining -= count * strength;
        }
    }
    
    // 如果还有剩余，添加一个最小规格
    if (remaining > 0) {
        combination.push(strengths[strengths.length - 1]);
    }
    
    const totalMg = combination.reduce((sum, mg) => sum + mg, 0);
    
    // 优化：尝试用更少的瓶数达到相同或相近的剂量
    const optimizedCombination = optimizeArgesunCombination(combination, totalDose);
    
    if (optimizedCombination && optimizedCombination.length < combination.length) {
        const optimizedMg = optimizedCombination.reduce((sum, mg) => sum + mg, 0);
        if (optimizedMg >= totalDose * 0.95) {
            return {
                combination: optimizedCombination,
                totalMg: optimizedMg
            };
        }
    }
    
    return {
        combination: combination,
        totalMg: totalMg
    };
}

// 优化Argesun组合：减少瓶数
function optimizeArgesunCombination(combination, totalDose) {
    const strengths = argesunData.strengths.map(s => s.mg).sort((a, b) => b - a);
    const currentCombination = [...combination];
    
    // 统计各规格数量
    const counts = {};
    currentCombination.forEach(mg => {
        counts[mg] = (counts[mg] || 0) + 1;
    });
    
    // 尝试用大规格替换多个小规格
    // 4个30mg可以用1个120mg替换
    if (counts[30] >= 4) {
        const newCombination = currentCombination.filter(mg => mg !== 30);
        const thirtyCount = counts[30] || 0;
        const replacements = Math.floor(thirtyCount / 4);
        for (let i = 0; i < replacements; i++) {
            newCombination.push(120);
        }
        for (let i = 0; i < thirtyCount % 4; i++) {
            newCombination.push(30);
        }
        return newCombination.sort((a, b) => b - a);
    }
    
    // 2个30mg可以用1个60mg替换
    if (counts[30] >= 2) {
        const newCombination = currentCombination.filter(mg => mg !== 30);
        const thirtyCount = counts[30] || 0;
        const replacements = Math.floor(thirtyCount / 2);
        for (let i = 0; i < replacements; i++) {
            newCombination.push(60);
        }
        for (let i = 0; i < thirtyCount % 2; i++) {
            newCombination.push(30);
        }
        return newCombination.sort((a, b) => b - a);
    }
    
    // 2个60mg可以用1个120mg替换
    if (counts[60] >= 2) {
        const newCombination = currentCombination.filter(mg => mg !== 60);
        const sixtyCount = counts[60] || 0;
        const replacements = Math.floor(sixtyCount / 2);
        for (let i = 0; i < replacements; i++) {
            newCombination.push(120);
        }
        for (let i = 0; i < sixtyCount % 2; i++) {
            newCombination.push(60);
        }
        return newCombination.sort((a, b) => b - a);
    }
    
    return null;
}

// 获取Argesun替代方案
function getArgesunAlternatives(currentCombination) {
    const strengths = argesunData.strengths.map(s => s.mg).sort((a, b) => b - a);
    const currentTotal = currentCombination.reduce((sum, mg) => sum + mg, 0);
    const alternatives = [];
    
    // 生成可能的替代组合
    for (let i = 0; i < strengths.length; i++) {
        const altCombination = [];
        const altStrength = strengths[i];
        
        // 尝试使用单一规格
        const count = Math.ceil(currentTotal / altStrength);
        for (let j = 0; j < count; j++) {
            altCombination.push(altStrength);
        }
        
        const altTotal = altCombination.reduce((sum, mg) => sum + mg, 0);
        
        // 只添加合理的替代方案（不超过当前总剂量的±10%）
        if (altTotal >= currentTotal * 0.95 && altTotal <= currentTotal * 1.1) {
            const strengthCounts = {};
            altCombination.forEach(mg => {
                strengthCounts[mg] = (strengthCounts[mg] || 0) + 1;
            });
            
            alternatives.push({
                combination: altCombination,
                totalMg: altTotal,
                recommendedStrengths: strengthCounts
            });
        }
    }
    
    return alternatives;
}

// 查找Artesun剂量推荐 - 智能选择最佳规格组合
function findArtesunDosage(weight) {
    if (weight < 0 || weight > 100) return null;
    
    // 计算总剂量 (mg)
    const dosagePerKg = weight < 20 ? artesunData.dosageFormula.child : artesunData.dosageFormula.adult;
    const totalDose = weight * dosagePerKg;
    
    // 智能选择最佳规格组合
    const bestCombination = findBestArtesunStrengthCombination(totalDose);
    
    if (!bestCombination) return null;
    
    const { combination, totalMg } = bestCombination;
    
    // 计算每种规格需要多少瓶
    const strengthCounts = {};
    combination.forEach(strength => {
        strengthCounts[strength] = (strengthCounts[strength] || 0) + 1;
    });
    
    // 计算碳酸氢钠和氯化钠总体积
    let totalBicarbonateVolume = 0;
    let totalSalineVolume = 0;
    
    combination.forEach(strength => {
        const strengthInfo = artesunData.strengths.find(s => s.mg === strength);
        if (strengthInfo) {
            totalBicarbonateVolume += strengthInfo.bicarbonateVolume;
            // 根据注射途径决定氯化钠用量
            if (injectionRoute === 'iv') {
                totalSalineVolume += strengthInfo.salineVolume; // IV用量
            } else {
                totalSalineVolume += strengthInfo.imSalineVolume; // IM用量
            }
        }
    });
    
    // 计算最终注射体积 - 根据你的新规则
    const concentration = injectionRoute === 'iv' ? artesunData.concentrations.iv : artesunData.concentrations.im;
    const exactInjectionVolume = totalDose / concentration;
    
    // 应用新的归类规则
    let roundedInjectionVolume;
    const isChild = weight <= 20;
    
    if (injectionRoute === 'iv') {
        // IV规则
        if (isChild) {
            // 儿童（<20kg）：小于等于2ml自动归类到2ml
            roundedInjectionVolume = exactInjectionVolume <= 2 ? 2 : exactInjectionVolume;
        } else {
            // 成人（≥20kg）：自动归类到7ml
            roundedInjectionVolume = exactInjectionVolume <= 7 ? 7 : exactInjectionVolume;
        }
    } else {
        // IM规则
        if (isChild) {
            // 儿童（<20kg）：小于1ml自动归类到1ml
            roundedInjectionVolume = exactInjectionVolume < 1 ? 1 : exactInjectionVolume;
        } else {
            // 成人（≥20kg）：自动归类到4ml
            roundedInjectionVolume = exactInjectionVolume <= 4 ? 4 : exactInjectionVolume;
        }
    }
    
    // 确保体积是合理的数值
    roundedInjectionVolume = parseFloat(roundedInjectionVolume.toFixed(2));
    
    return {
        weight: weight,
        totalDose: totalDose,
        dosagePerKg: dosagePerKg,
        isChild: isChild,
        recommendedStrengths: strengthCounts,
        combination: combination, // 保存实际的组合数组
        totalMg: totalMg, // 实际使用的总毫克数
        totalBicarbonateVolume: parseFloat(totalBicarbonateVolume.toFixed(1)),
        totalSalineVolume: parseFloat(totalSalineVolume.toFixed(1)),
        exactInjectionVolume: parseFloat(exactInjectionVolume.toFixed(2)),
        roundedInjectionVolume: roundedInjectionVolume,
        concentration: concentration,
        route: injectionRoute,
    };
}

// Artesun的智能组合选择算法
function findBestArtesunStrengthCombination(totalDose) {
    const strengths = artesunData.strengths.map(s => s.mg).sort((a, b) => b - a); // 从大到小排序
    
    // 简单的贪心算法：优先使用大规格
    let combination = [];
    let remaining = totalDose;
    
    for (const strength of strengths) {
        const count = Math.floor(remaining / strength);
        if (count > 0) {
            for (let i = 0; i < count; i++) {
                combination.push(strength);
            }
            remaining -= count * strength;
        }
    }
    
    // 如果还有剩余，添加一个最小规格
    if (remaining > 0) {
        combination.push(strengths[strengths.length - 1]);
    }
    
    const totalMg = combination.reduce((sum, mg) => sum + mg, 0);
    
    // 优化：尝试用更少的瓶数达到相同或相近的剂量
    const optimizedCombination = optimizeArtesunCombination(combination, totalDose);
    
    if (optimizedCombination && optimizedCombination.length < combination.length) {
        const optimizedMg = optimizedCombination.reduce((sum, mg) => sum + mg, 0);
        if (optimizedMg >= totalDose * 0.95) {
            return {
                combination: optimizedCombination,
                totalMg: optimizedMg
            };
        }
    }
    
    return {
        combination: combination,
        totalMg: totalMg
    };
}

// 优化Artesun组合：减少瓶数
function optimizeArtesunCombination(combination, totalDose) {
    const strengths = artesunData.strengths.map(s => s.mg).sort((a, b) => b - a);
    const currentCombination = [...combination];
    
    // 统计各规格数量
    const counts = {};
    currentCombination.forEach(mg => {
        counts[mg] = (counts[mg] || 0) + 1;
    });
    
    // 尝试用大规格替换多个小规格
    // 4个30mg可以用1个120mg替换
    if (counts[30] >= 4) {
        const newCombination = currentCombination.filter(mg => mg !== 30);
        const thirtyCount = counts[30] || 0;
        const replacements = Math.floor(thirtyCount / 4);
        for (let i = 0; i < replacements; i++) {
            newCombination.push(120);
        }
        for (let i = 0; i < thirtyCount % 4; i++) {
            newCombination.push(30);
        }
        return newCombination.sort((a, b) => b - a);
    }
    
    // 2个30mg可以用1个60mg替换
    if (counts[30] >= 2) {
        const newCombination = currentCombination.filter(mg => mg !== 30);
        const thirtyCount = counts[30] || 0;
        const replacements = Math.floor(thirtyCount / 2);
        for (let i = 0; i < replacements; i++) {
            newCombination.push(60);
        }
        for (let i = 0; i < thirtyCount % 2; i++) {
            newCombination.push(30);
        }
        return newCombination.sort((a, b) => b - a);
    }
    
    // 2个60mg可以用1个120mg替换
    if (counts[60] >= 2) {
        const newCombination = currentCombination.filter(mg => mg !== 60);
        const sixtyCount = counts[60] || 0;
        const replacements = Math.floor(sixtyCount / 2);
        for (let i = 0; i < replacements; i++) {
            newCombination.push(120);
        }
        for (let i = 0; i < sixtyCount % 2; i++) {
            newCombination.push(60);
        }
        return newCombination.sort((a, b) => b - a);
    }
    
    return null;
}

// 获取Artesun替代方案
function getArtesunAlternatives(currentCombination) {
    const strengths = artesunData.strengths.map(s => s.mg).sort((a, b) => b - a);
    const currentTotal = currentCombination.reduce((sum, mg) => sum + mg, 0);
    const alternatives = [];
    
    // 生成可能的替代组合
    for (let i = 0; i < strengths.length; i++) {
        const altCombination = [];
        const altStrength = strengths[i];
        
        // 尝试使用单一规格
        const count = Math.ceil(currentTotal / altStrength);
        for (let j = 0; j < count; j++) {
            altCombination.push(altStrength);
        }
        
        const altTotal = altCombination.reduce((sum, mg) => sum + mg, 0);
        
        // 只添加合理的替代方案（不超过当前总剂量的±10%）
        if (altTotal >= currentTotal * 0.95 && altTotal <= currentTotal * 1.1) {
            const strengthCounts = {};
            altCombination.forEach(mg => {
                strengthCounts[mg] = (strengthCounts[mg] || 0) + 1;
            });
            
            alternatives.push({
                combination: altCombination,
                totalMg: altTotal,
                recommendedStrengths: strengthCounts
            });
        }
    }
    
    return alternatives;
}

// ==================== 辅助函数 ====================

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function roundToDecimal(num, decimals) {
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

// ==================== 全局导出 ====================
// 重要：这些函数必须导出到window对象，才能被HTML中的onclick调用

window.selectProduct = selectProduct;
window.setWeight = setWeight;
window.changeLanguage = changeLanguage;
window.setInjectionRoute = setInjectionRoute; // 新增：导出注射途径设置函数

console.log('Medical Dosage Calculator脚本已加载');