// D-Arteapp 医疗剂量计算器 - 主要JavaScript逻辑
// 版本：v2.2 - 修复onclick调用问题

// 全局变量
let currentWeight = 35.0;  // 改为25.0以匹配HTML默认值
let selectedProduct = null;
let isDragging = false;
let startAngle = 0;
let currentRotation = 0;

// D-Arteapp 产品数据
const darteappData = {
    id: 'darteapp',
    name: 'D-Arteapp',
    description: '抗疟疾药物剂量计算器',
    types: [
        {
            name: 'D-ARTEPP Dispersible',
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
            name: 'D-ARTEPP',
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

// ==================== 核心初始化 ====================

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('D-Arteapp 剂量计算器加载完成');
    
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

// 初始化刻度盘
// 初始化刻度盘
function initializeScale() {
    const scaleContainer = document.getElementById('scaleContainer');
    if (!scaleContainer) return;
    
    scaleContainer.innerHTML = '';
    
    // 创建刻度线和数字（从右到左：5-100kg）
    for (let kg = 5; kg <= 100; kg += 2.5) {
        // === 修改这里：顺时针增大，5kg在右端(45°)，100kg在左端(135°) ===
        const angle = 45 + (kg - 5) * (90 / 95); // 5kg->45°, 100kg->135°
        
        // 创建刻度线
        const line = document.createElement('div');
        line.className = kg % 10 === 0 ? 'scale-line major' : 'scale-line minor';
        line.style.transform = `translateX(-50%) rotate(${angle}deg)`;
        scaleContainer.appendChild(line);
        
        // 创建数字标签（每5kg显示一个数字）
        if (kg % 5 === 0) {
            const number = document.createElement('div');
            number.className = 'scale-number';
            number.textContent = kg;
            number.style.transform = `translateX(-50%) rotate(${angle}deg)`;
            scaleContainer.appendChild(number);
        }
    }
}

// ==================== 工具函数 ====================

// 将体重映射到角度（5kg对应右端135度，100kg对应左端45度）
// 将体重映射到角度 - 顺时针增大
function mapWeightToAngle(weight) {
    // 5kg -> 45度（右端），100kg -> 135度（左端）
    return 45 + (weight - 5) * (90 / 95);
}
// 将角度映射到体重
// 将角度映射到体重 - 顺时针增大
function mapAngleToWeight(angle) {
    // 45度 -> 5kg，135度 -> 100kg
    const weight = 5 + (angle - 45) * (95 / 90);
    return Math.max(5, Math.min(100, weight));
}

// 更新刻度盘旋转
// 更新刻度盘旋转
function updateDialRotation() {
    const semicircleDial = document.getElementById('semicircleDial');
    if (!semicircleDial) return;
    
    semicircleDial.style.transform = `rotate(${currentRotation}deg)`;
    
    // 计算当前体重对应的角度
    const targetAngle = mapWeightToAngle(currentWeight);
    
    // 让该角度对准正北（90度）
    // 旋转 = 目标位置(90°) - 当前角度
    currentRotation = 90 - targetAngle;
    
    // 更新显示
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
// 设置体重
// 设置体重
function setWeight(weight) {
    weight = parseFloat(weight);
    if (isNaN(weight)) return;
    
    currentWeight = Math.max(5, Math.min(100, weight));
    
    // 计算当前体重对应的角度
    const targetAngle = mapWeightToAngle(currentWeight);
    
    // 让该角度对准正北（90度）
    currentRotation = 90 - targetAngle;
    
    // 更新刻度盘
    const semicircleDial = document.getElementById('semicircleDial');
    if (semicircleDial) {
        semicircleDial.style.transform = `rotate(${currentRotation}deg)`;
    }
    
    // 更新显示
    updateWeightDisplay();
}

// ==================== 事件处理 ====================

// 设置事件监听器
function setupEventListeners() {
    // 手动体重输入
    const manualWeightInput = document.getElementById('manualWeight');
    if (manualWeightInput) {
        manualWeightInput.addEventListener('input', handleManualWeightInput);
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
    
    // 设置刻度盘拖拽事件
    setupDialEvents();
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
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        
        const semicircleDial = document.getElementById('semicircleDial');
        const rect = semicircleDial.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI;
        const deltaAngle = currentAngle - startAngle;
        
        currentRotation += deltaAngle * 0.5;
        currentRotation = Math.max(-45, Math.min(45, currentRotation));
        
        startAngle = currentAngle;
        updateDialRotation();
    });
    
    document.addEventListener('mouseup', function() {
        isDragging = false;
        document.body.style.cursor = 'default';
    });
    
    // 触摸事件
    semicircleDial.addEventListener('touchstart', function(e) {
        isDragging = true;
        const touch = e.touches[0];
        const rect = this.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        startAngle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX) * 180 / Math.PI;
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
        currentRotation = Math.max(-45, Math.min(45, currentRotation));
        
        startAngle = currentAngle;
        updateDialRotation();
    });
    
    document.addEventListener('touchend', function() {
        isDragging = false;
    });
}

// 处理手动体重输入
function handleManualWeightInput(event) {
    const weight = parseFloat(event.target.value);
    if (!isNaN(weight) && weight >= 5 && weight <= 100) {
        setWeight(weight);
    } else {
        event.target.value = currentWeight.toFixed(1);
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
        alert('请先选择产品');
        return;
    }
    
    updateDosageDisplay();
    
    // 计算按钮动画效果
    const btn = document.getElementById('calculateBtn');
    if (btn) {
        const originalText = btn.textContent;
        
        btn.textContent = '计算完成 ✓';
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
                <p class="text-lg font-medium mb-2">请选择体重</p>
                <p class="text-sm">滑动左侧刻度盘来设置患者体重</p>
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
                <p class="font-medium">体重超出范围</p>
                <p class="text-sm">请检查体重输入是否正确 (5-100kg)</p>
            </div>
        `;
        return;
    }
    
    const dosageHtml = result.dosages.map(dosage => `
        <div class="bg-white rounded-lg p-4 mb-3 border border-gray-200 hover:shadow-md transition-shadow">
            <div class="flex justify-between items-center mb-2">
                <div>
                    <span class="font-semibold text-gray-800">${dosage.type}</span>
                    <span class="ml-2 text-sm text-gray-600">${dosage.specification}</span>
                </div>
                <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-bold">${dosage.count} 片</span>
            </div>
            <div class="text-sm text-gray-600">
                推荐用量：每次 ${dosage.count} 片，每日2次，连续3日
            </div>
        </div>
    `).join('');
    
    dosageResult.innerHTML = `
        <div class="dosage-result p-6 rounded-lg">
            <div class="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div class="mb-4 md:mb-0">
                    <h4 class="text-lg font-semibold text-gray-800">基于体重 ${currentWeight.toFixed(1)}kg 的推荐剂量</h4>
                    <p class="text-sm text-gray-600 mt-1">${selectedProduct.name} - 三日疗程方案</p>
                </div>
                <div class="text-center md:text-right">
                    <div class="text-2xl font-bold number-display text-blue-600">${currentWeight.toFixed(1)} kg</div>
                    <div class="text-sm text-gray-500">患者体重</div>
                </div>
            </div>
            
            <div class="space-y-3 mb-6">
                <h5 class="font-medium text-gray-700">推荐用药方案：</h5>
                ${dosageHtml}
            </div>
            
            <div class="mt-6 p-4 bg-blue-50 rounded-lg">
                <div class="flex items-start">
                    <svg class="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div>
                        <p class="text-sm text-blue-800">
                            <strong>用药说明：</strong> 
                            首次给药后，每12小时给药一次，连续3日。
                            请严格遵医嘱使用，如出现不良反应请及时就医。
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
        dosages: result.dosages
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

console.log('D-Arteapp计算器脚本已加载');