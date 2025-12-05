// D-Arteapp 医疗剂量计算器 - 主要JavaScript逻辑
// 版本：v5.2 - 修复占位符问题版

// 全局变量
let currentWeight = 35.0;
let selectedProduct = null;
let isDragging = false;
let startAngle = 0;
let currentRotation = 0;
let currentLanguage = 'en'; // 默认语言为英语

// 多语言翻译数据
const translations = {
    en: {
        appTitle: "Medical Dosage Calculator",
        navCalculator: "Calculator",
        navHistory: "History",
        navMedications: "Medications",
        selectProduct: "Select Product",
        selectProductDesc: "Please select the product for dosage calculation",
        darteappDesc: "Antimalarial Dosage Calculator",
        artesunDesc: "Artesunate for Injection",
        argesunDesc: "Compound Artemisinin Preparation",
        recommended: "Recommended",
        comingSoon: "Coming Soon",
        calculatorTitle: "D-Arteapp Dosage Calculation",
        calculatorDesc: "Select patient weight by sliding the dial, system will automatically calculate recommended dosage",
        weightSelector: "Weight Selector",
        manualInput: "Or enter weight manually",
        weightRange: "Range: 5-100kg",
        dosagePlan: "Recommended Dosage Plan",
        selectWeight: "Please select weight",
        selectWeightDesc: "Slide the dial on the left to set patient weight",
        calculateDosage: "Calculate Dosage",
        backToProducts: "Back to Products",
        footerCopyright: "© 2025 D-Arteapp Medical Dosage Calculator. Professional medical tool for safe medication.",
        footerDisclaimer: "This tool is for reference only, please follow medical advice for actual medication.",
        dosageResultTitle: "Recommended dosage based on weight",
        dosageResultSubtitle: "D-Arteapp - Three-day treatment plan",
        patientWeight: "Patient Weight",
        recommendedMedication: "Recommended Medication Plan:",
        dosageInstruction: "Recommended dosage:",
        medicationInstructions: "Medication Instructions:",
        takeDaily: "Take daily",
        forDays: "for 3 days",
        pleaseFollow: "Please strictly follow medical advice. Seek medical attention immediately if adverse reactions occur.",
        weightOutOfRange: "Weight out of range",
        checkWeight: "Please check if weight input is correct (5-100kg)",
        calculationComplete: "Calculation Complete ✓",
        selectProductAlert: "Please select a product first"
    },
    zh: {
        appTitle: "医疗剂量计算器",
        navCalculator: "计算器",
        navHistory: "历史记录",
        navMedications: "药品信息",
        selectProduct: "选择产品",
        selectProductDesc: "请选择您需要计算剂量的产品",
        darteappDesc: "抗疟疾药物剂量计算器",
        artesunDesc: "注射用青蒿琥酯",
        argesunDesc: "复方青蒿素制剂",
        recommended: "推荐产品",
        comingSoon: "即将推出",
        calculatorTitle: "D-Arteapp 剂量计算",
        calculatorDesc: "通过滑动刻度盘选择患者体重，系统将自动计算推荐剂量",
        weightSelector: "体重选择器",
        manualInput: "或直接输入体重",
        weightRange: "范围: 5-100kg",
        dosagePlan: "推荐剂量方案",
        selectWeight: "请选择体重",
        selectWeightDesc: "滑动左侧刻度盘来设置患者体重",
        calculateDosage: "计算剂量",
        backToProducts: "返回产品选择",
        footerCopyright: "© 2025 D-Arteapp 医疗剂量计算器. 专业医疗工具，确保用药安全.",
        footerDisclaimer: "本工具仅供参考，实际用药请遵循医嘱",
        dosageResultTitle: "基于体重 {weight}kg 的推荐剂量",
        dosageResultSubtitle: "D-Arteapp - 三日疗程方案",
        patientWeight: "患者体重",
        recommendedMedication: "推荐用药方案：",
        dosageInstruction: "推荐用量：",
        medicationInstructions: "用药说明：",
        takeDaily: "每日",
        forDays: "连续3日",
        pleaseFollow: "请严格遵医嘱使用，如出现不良反应请及时就医。",
        weightOutOfRange: "体重超出范围",
        checkWeight: "请检查体重输入是否正确 (5-100kg)",
        calculationComplete: "计算完成 ✓",
        selectProductAlert: "请先选择产品"
    },
    fr: {
        appTitle: "Calculateur de Dosage Médical",
        navCalculator: "Calculateur",
        navHistory: "Historique",
        navMedications: "Médicaments",
        selectProduct: "Sélectionner le Produit",
        selectProductDesc: "Veuillez sélectionner le produit pour le calcul de dosage",
        darteappDesc: "Calculateur de Dosage Antipaludique",
        artesunDesc: "Artesunate pour Injection",
        argesunDesc: "Préparation d'Artémisinine Composée",
        recommended: "Recommandé",
        comingSoon: "Prochainement",
        calculatorTitle: "Calcul de Dosage D-Arteapp",
        calculatorDesc: "Sélectionnez le poids du patient en faisant glisser le cadran, le système calculera automatiquement le dosage recommandé",
        weightSelector: "Sélecteur de Poids",
        manualInput: "Ou saisir manuellement le poids",
        weightRange: "Plage: 5-100kg",
        dosagePlan: "Plan de Dosage Recommandé",
        selectWeight: "Veuillez sélectionner le poids",
        selectWeightDesc: "Faites glisser le cadran à gauche pour définir le poids du patient",
        calculateDosage: "Calculer le Dosage",
        backToProducts: "Retour aux Produits",
        footerCopyright: "© 2025 D-Arteapp Calculateur de Dosage Médical. Outil médical professionnel pour une médication sûre.",
        footerDisclaimer: "Cet outil est à titre indicatif seulement, suivez les conseils médicaux pour la médication réelle.",
        dosageResultTitle: "Dosage recommandé basé sur le poids",
        dosageResultSubtitle: "D-Arteapp - Plan de traitement de trois jours",
        patientWeight: "Poids du Patient",
        recommendedMedication: "Plan de Médication Recommandé:",
        dosageInstruction: "Dosage recommandé:",
        medicationInstructions: "Instructions de Médication:",
        takeDaily: "Prendre quotidiennement",
        forDays: "pendant 3 jours",
        pleaseFollow: "Veuillez suivre strictement les conseils médicaux. Consultez immédiatement un médecin en cas de réactions indésirables.",
        weightOutOfRange: "Poids hors limites",
        checkWeight: "Veuillez vérifier si la saisie du poids est correcte (5-100kg)",
        calculationComplete: "Calcul Terminé ✓",
        selectProductAlert: "Veuillez d'abord sélectionner un produit"
    }
};

// D-Arteapp 产品数据（已添加多语言支持）
const darteappData = {
    id: 'darteapp',
    name: 'D-Arteapp',
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
    }
}

// 更新"即将推出"标签
function updateComingSoonLabels() {
    // 由于伪元素不能直接通过JS修改，我们使用不同的方法
    // 我们已经将文本移到单独的div中，所以只需更新那些div
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

// 初始化语言 - 修复版：优先英文，保留浏览器检测
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

// ==================== 核心初始化 ====================

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('D-Arteapp 剂量计算器加载完成');
    
    // 初始化语言
    initializeLanguage();
    
    // 初始化刻度盘（只在计算器界面显示时）
    const calculatorInterface = document.getElementById('calculatorInterface');
    if (!calculatorInterface.classList.contains('hidden')) {
        initializeScale();
        selectedProduct = darteappData;
        updateWeightDisplay();
    }
    
    // 设置事件监听器
    setupEventListeners();
});

// 初始化刻度盘 - 顺时针增大：5kg在135°，100kg在45°
function initializeScale() {
    const scaleContainer = document.getElementById('scaleContainer');
    if (!scaleContainer) return;
    
    scaleContainer.innerHTML = '';
    
    // 创建刻度线和数字（顺时针增大：5kg在左端135°，100kg在右端45°）
    for (let kg = 5; kg <= 100; kg += 1) {
        const angle = mapWeightToAngle(kg);
        
        // 创建刻度线
        const line = document.createElement('div');
        line.className = kg % 5 === 0 ? 'scale-line major' : 'scale-line minor';
        line.style.transform = `translateX(-50%) rotate(${angle}deg)`;
        scaleContainer.appendChild(line);
        
        // 创建数字标签（每5kg显示一个数字）
        if (kg % 10 === 0 || kg === 5) {
            const number = document.createElement('div');
            number.className = 'scale-number';
            number.textContent = kg;
            number.style.transform = `translateX(-50%) rotate(${angle}deg)`;
            scaleContainer.appendChild(number);
        }
    }
}

// ==================== 工具函数 ====================

// 体重→角度：5kg=135°，100kg=45°，顺时针增大
function mapWeightToAngle(weight) {
    return 0 + (weight) * (171 / 95);
}

// 角度→体重：135°=5kg，45°=100kg，顺时针增大
function mapAngleToWeight(angle) {
    const weight = (angle - 0) * (95 / 171);
    return Math.max(5, Math.min(100, weight));
}

// 更新刻度盘旋转
function updateDialRotation() {
    const semicircleDial = document.getElementById('semicircleDial');
    if (!semicircleDial) return;
    
    semicircleDial.style.transform = `rotate(${currentRotation}deg)`;
    
    // 旋转后，指针指向的刻度原始角度 = 90° - currentRotation
    const originalAngle = 0 - currentRotation;
    currentWeight = mapAngleToWeight(originalAngle);
    
    // 更新显示
    updateWeightDisplay();
}

// 更新体重显示
function updateWeightDisplay() {
    const currentWeightDisplay = document.getElementById('currentWeight');
    const manualWeightInput = document.getElementById('manualWeight');
    
    if (currentWeightDisplay) {
        currentWeightDisplay.textContent = currentWeight.toFixed(1);
    }
    
    if (manualWeightInput) {
        manualWeightInput.value = currentWeight.toFixed(1);
    }
    
    // 如果已选择产品，自动更新剂量显示
    if (selectedProduct) {
        updateDosageDisplay();
    }
}

// 设置体重 - 这个函数会被HTML中的onclick调用
function setWeight(weight) {
    weight = parseFloat(weight);
    if (isNaN(weight)) return;
    
    currentWeight = Math.max(5, Math.min(100, weight));
    
    // 旋转角度 = 90° - 体重的原始角度
    const originalAngle = mapWeightToAngle(currentWeight);
    currentRotation = 0 - originalAngle;
    
    // 限制旋转范围
    currentRotation = Math.max(-180, Math.min(-9, currentRotation));
    
    // 更新刻度盘
    updateDialRotation();
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
    
    // 计算按钮
    const calculateButton = document.getElementById('calculateBtn');
    if (calculateButton) {
        calculateButton.addEventListener('click', calculateDosage);
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
        
        // 拖拽时禁用过渡效果
        this.style.transition = 'none';
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        
        const semicircleDial = document.getElementById('semicircleDial');
        const rect = semicircleDial.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI;
        const deltaAngle = currentAngle - startAngle;
        
        // 更新旋转角度
        currentRotation += deltaAngle * 0.5;
        currentRotation = Math.max(-180, Math.min(-9, currentRotation));
        
        // 立即应用旋转
        semicircleDial.style.transform = `rotate(${currentRotation}deg)`;
        
        // 从旋转角度计算体重
        const originalAngle = 0 - currentRotation;
        currentWeight = mapAngleToWeight(originalAngle);
        
        startAngle = currentAngle;
        
        // 更新显示
        const currentWeightDisplay = document.getElementById('currentWeight');
        const manualWeightInput = document.getElementById('manualWeight');
        
        if (currentWeightDisplay) {
            currentWeightDisplay.textContent = currentWeight.toFixed(1);
        }
        
        if (manualWeightInput) {
            manualWeightInput.value = currentWeight.toFixed(1);
        }
        
        if (selectedProduct) {
            updateDosageDisplay();
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
    });
    
    // 触摸事件
    semicircleDial.addEventListener('touchstart', function(e) {
        isDragging = true;
        const touch = e.touches[0];
        const rect = this.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        startAngle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX) * 180 / Math.PI;
        
        // 拖拽时禁用过渡效果
        this.style.transition = 'none';
    });
    
    document.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        e.preventDefault();
        
        const touch = e.touches[0];
        const semicircleDial = document.getElementById('semicircleDial');
        const rect = semicircleDial.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const currentAngle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX) * 180 / Math.PI;
        const deltaAngle = currentAngle - startAngle;
        
        currentRotation += deltaAngle * 0.5;
        currentRotation = Math.max(-180, Math.min(-9, currentRotation));
        
        // 立即应用旋转
        semicircleDial.style.transform = `rotate(${currentRotation}deg)`;
        
        // 从旋转角度计算体重
        const originalAngle = 0 - currentRotation;
        currentWeight = mapAngleToWeight(originalAngle);
        
        startAngle = currentAngle;
        
        // 更新显示
        const currentWeightDisplay = document.getElementById('currentWeight');
        const manualWeightInput = document.getElementById('manualWeight');
        
        if (currentWeightDisplay) {
            currentWeightDisplay.textContent = currentWeight.toFixed(1);
        }
        
        if (manualWeightInput) {
            manualWeightInput.value = currentWeight.toFixed(1);
        }
        
        if (selectedProduct) {
            updateDosageDisplay();
        }
    });
    
    document.addEventListener('touchend', function() {
        if (!isDragging) return;
        
        isDragging = false;
        const semicircleDial = document.getElementById('semicircleDial');
        if (semicircleDial) {
            semicircleDial.style.transition = 'transform 0.2s ease';
        }
    });
}

// 处理手动体重输入
function handleManualWeightInput(event) {
    const input = event.target;
    const weight = parseFloat(input.value);
    
    if (!isNaN(weight) && weight >= 5 && weight <= 100) {
        setWeight(weight);
    } else {
        // 输入无效，恢复之前的值
        input.value = currentWeight.toFixed(1);
    }
}

function handleManualWeightKeyDown(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const input = event.target;
        const weight = parseFloat(input.value);
        
        if (!isNaN(weight) && weight >= 5 && weight <= 100) {
            setWeight(weight);
        } else {
            // 输入无效，恢复之前的值
            input.value = currentWeight.toFixed(1);
        }
        
        // 失去焦点
        input.blur();
    }
}

// 产品选择功能 - 这个函数会被HTML中的onclick调用
function selectProduct(product) {
    if (product === 'darteapp') {
        selectedProduct = darteappData;
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
        
        // 初始化刻度盘
        initializeScale();
        
        // 设置初始体重
        setWeight(35);
        
        // 添加选中效果
        document.querySelectorAll('.product-card').forEach(card => {
            card.classList.remove('selected');
            const title = card.querySelector('h3');
            if (title && title.textContent === 'D-Arteapp') {
                card.classList.add('selected');
            }
        });
        
        // 启用计算按钮
        const calculateButton = document.getElementById('calculateBtn');
        if (calculateButton) {
            calculateButton.disabled = false;
        }
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

// 计算剂量
function calculateDosage() {
    if (!selectedProduct) {
        alert(translations[currentLanguage].selectProductAlert || 'Please select a product first');
        return;
    }
    
    updateDosageDisplay();
    
    // 计算按钮动画效果
    const btn = document.getElementById('calculateBtn');
    if (btn) {
        const originalText = btn.textContent;
        
        btn.textContent = translations[currentLanguage].calculationComplete || 'Calculation Complete ✓';
        btn.classList.remove('medical-gradient');
        btn.classList.add('bg-green-600');
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove('bg-green-600');
            btn.classList.add('medical-gradient');
        }, 1500);
    }
    
    // 保存计算历史
    saveCalculationHistory();
}

// 辅助函数：处理剂量标题中的占位符
function getDosageResultTitle(weight) {
    const titleTemplate = translations[currentLanguage].dosageResultTitle || 'Recommended dosage based on weight';
    
    // 检查标题模板中是否包含 {weight} 占位符
    if (titleTemplate.includes('{weight}')) {
        // 替换占位符为实际体重
        return titleTemplate.replace('{weight}', weight.toFixed(1));
    } else {
        // 没有占位符，直接返回标题
        return titleTemplate;
    }
}

// 更新剂量显示
function updateDosageDisplay() {
    const dosageResult = document.getElementById('dosageResult');
    if (!dosageResult) return;
    
    // 如果没有选择产品，显示默认提示
    if (!selectedProduct) {
        dosageResult.innerHTML = `
            <div class="text-center text-gray-500 py-8">
                <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
                <p class="text-lg font-medium mb-2">${translations[currentLanguage].selectWeight || 'Please select weight'}</p>
                <p class="text-sm">${translations[currentLanguage].selectWeightDesc || 'Slide the dial on the left to set patient weight'}</p>
            </div>
        `;
        return;
    }
    
    const result = findDosageRecommendation(currentWeight);
    
    if (!result) {
        dosageResult.innerHTML = `
            <div class="text-center text-red-500 py-8">
                <svg class="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                <p class="font-medium">${translations[currentLanguage].weightOutOfRange || 'Weight out of range'}</p>
                <p class="text-sm">${translations[currentLanguage].checkWeight || 'Please check if weight input is correct (5-100kg)'}</p>
            </div>
        `;
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
    
    dosageResult.innerHTML = `
        <div class="dosage-result p-6 rounded-lg">
            <div class="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div class="mb-4 md:mb-0">
                    <h4 class="text-lg font-semibold text-gray-800">${dosageTitle}</h4>
                    <p class="text-sm text-gray-600 mt-1">${selectedProduct.name} - ${translations[currentLanguage].dosageResultSubtitle || 'Three-day treatment plan'}</p>
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
    
    // 添加脉冲效果到计算按钮
    const calculateButton = document.getElementById('calculateBtn');
    if (calculateButton) {
        calculateButton.classList.add('pulse-glow');
    }
}

// 查找剂量推荐
function findDosageRecommendation(weight) {
    if (weight < 5 || weight > 100) return null;
    
    const dosages = [];
    
    // 检查 D-ARTEPP Dispersible
    const dispersible = darteappData.types[0];
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
    const regular = darteappData.types[1];
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

// 保存计算历史
function saveCalculationHistory() {
    const result = findDosageRecommendation(currentWeight);
    if (!result || !selectedProduct) return;
    
    const record = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        product: selectedProduct.name,
        weight: currentWeight,
        dosages: result.dosages,
        language: currentLanguage
    };
    
    // 获取现有历史
    let history = [];
    const savedHistory = localStorage.getItem('darteappCalculatorHistory');
    if (savedHistory) {
        try {
            history = JSON.parse(savedHistory);
        } catch (e) {
            console.warn('解析历史记录失败:', e);
        }
    }
    
    // 添加到历史记录开头
    history.unshift(record);
    
    // 限制历史记录数量（最多100条）
    if (history.length > 100) {
        history = history.slice(0, 100);
    }
    
    // 保存到本地存储
    try {
        localStorage.setItem('darteappCalculatorHistory', JSON.stringify(history));
    } catch (e) {
        console.warn('保存历史记录失败:', e);
    }
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

console.log('D-Arteapp计算器脚本已加载');