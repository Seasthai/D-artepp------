// D-Arteapp 医疗剂量计算器 - 主要JavaScript逻辑

// 全局变量
let currentWeight = 25.0;
let selectedProduct = null;
let isDragging = false;
let lastAngle = 0;
let wheelRotation = 0;

// D-Arteapp 产品数据
const darteappData = {
    id: 'darteapp',
    name: 'D-Arteapp',
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

// 初始化应用
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    createWeightScale();
    animatePageLoad();
});

// 初始化应用
function initializeApp() {
    console.log('D-Arteapp 剂量计算器初始化...');
    updateWeightDisplay();
}

// 设置事件监听器
function setupEventListeners() {
    // 产品选择
    document.getElementById('backToProduct').addEventListener('click', showProductSelection);
    document.getElementById('calculateBtn').addEventListener('click', calculateDosage);
    
    // 手动体重输入
    document.getElementById('manualWeight').addEventListener('input', handleManualWeightInput);
    
    // 剂量盘事件 - 使用passive: false来允许preventDefault
    const doseWheel = document.getElementById('doseWheel');
    
    // 鼠标事件
    doseWheel.addEventListener('mousedown', startDrag, { passive: false });
    document.addEventListener('mousemove', drag, { passive: false });
    document.addEventListener('mouseup', endDrag);
    
    // 触摸事件
    doseWheel.addEventListener('touchstart', startDrag, { passive: false });
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('touchend', endDrag);
    
    // 滚轮事件
    doseWheel.addEventListener('wheel', handleWheel, { passive: false });
}

// 产品选择
function selectProduct(productId) {
    if (productId === 'darteapp') {
        selectedProduct = darteappData;
        showCalculatorInterface();
    }
}

// 显示产品选择界面
function showProductSelection() {
    document.getElementById('productSelection').classList.remove('hidden');
    document.getElementById('calculatorInterface').classList.add('hidden');
    selectedProduct = null;
}

// 显示计算器界面
function showCalculatorInterface() {
    document.getElementById('productSelection').classList.add('hidden');
    document.getElementById('calculatorInterface').classList.remove('hidden');
    
    // 界面切换动画
    anime({
        targets: '#calculatorInterface',
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 600,
        easing: 'easeOutQuad'
    });
    
    // 自动计算初始体重
    calculateDosage();
}

// 创建体重刻度盘 - 修复刻度和转盘脱离问题
function createWeightScale() {
    const scale = document.getElementById('weightScale');
    const maxWeight = 100;
    const minWeight = 5;
    const majorStep = 5;
    const minorStep = 1;
    
    // 清除现有刻度
    scale.innerHTML = '';
    
    // 创建主刻度和数字
    for (let weight = minWeight; weight <= maxWeight; weight += majorStep) {
        const angle = ((weight - minWeight) / (maxWeight - minWeight)) * 180; // 半圆180度
        
        // 创建主刻度线
        const mark = document.createElement('div');
        mark.className = 'scale-mark major';
        mark.style.transform = `rotate(${angle}deg)`;
        scale.appendChild(mark);
        
        // 创建刻度数字
        const number = document.createElement('div');
        number.className = 'scale-number';
        number.textContent = weight;
        number.style.transform = `rotate(${angle}deg) translate(0, -120px) rotate(${-angle}deg)`;
        scale.appendChild(number);
        
        // 创建次刻度线（每1kg）
        if (weight < maxWeight) {
            for (let minor = weight + minorStep; minor < Math.min(weight + majorStep, maxWeight + 1); minor += minorStep) {
                if (minor % 5 !== 0) { // 跳过主刻度位置
                    const minorAngle = ((minor - minWeight) / (maxWeight - minWeight)) * 180;
                    const minorMark = document.createElement('div');
                    minorMark.className = 'scale-mark minor';
                    minorMark.style.transform = `rotate(${minorAngle}deg)`;
                    scale.appendChild(minorMark);
                }
            }
        }
    }
}

// 开始拖拽
function startDrag(event) {
    event.preventDefault();
    isDragging = true;
    
    const rect = document.getElementById('doseWheel').getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const clientX = event.clientX || (event.touches && event.touches[0].clientX);
    const clientY = event.clientY || (event.touches && event.touches[0].clientY);
    
    lastAngle = Math.atan2(clientY - centerY, clientX - centerX);
    
    document.getElementById('doseWheel').style.cursor = 'grabbing';
    
    // 添加活动状态视觉反馈
    document.getElementById('doseWheel').classList.add('pulse-glow');
}

// 拖拽中
function drag(event) {
    if (!isDragging) return;
    event.preventDefault();
    
    const rect = document.getElementById('doseWheel').getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const clientX = event.clientX || (event.touches && event.touches[0].clientX);
    const clientY = event.clientY || (event.touches && event.touches[0].clientY);
    
    const currentAngle = Math.atan2(clientY - centerY, clientX - centerX);
    const angleDiff = currentAngle - lastAngle;
    
    // 更新旋转角度
    wheelRotation += angleDiff * (180 / Math.PI);
    
    // 更新体重值 - 半圆范围0-180度对应5-100kg
    const weightRange = 100 - 5; // 5-100kg
    const normalizedRotation = ((wheelRotation % 180) + 180) % 180; // 限制在0-180度
    currentWeight = 5 + (normalizedRotation / 180) * weightRange;
    
    // 限制体重范围
    currentWeight = Math.max(5, Math.min(100, currentWeight));
    
    updateWeightDisplay();
    updateDosageDisplay();
    
    lastAngle = currentAngle;
}

// 结束拖拽
function endDrag(event) {
    if (!isDragging) return;
    
    isDragging = false;
    document.getElementById('doseWheel').style.cursor = 'grab';
    document.getElementById('doseWheel').classList.remove('pulse-glow');
    
    // 添加惯性效果
    addInertia();
}

// 处理滚轮
function handleWheel(event) {
    event.preventDefault();
    
    const delta = event.deltaY > 0 ? 1 : -1;
    currentWeight += delta * 0.5;
    
    // 限制体重范围
    currentWeight = Math.max(5, Math.min(100, currentWeight));
    
    updateWeightDisplay();
    updateDosageDisplay();
    
    // 更新旋转角度 - 半圆范围
    const weightRange = 100 - 5;
    const normalizedWeight = (currentWeight - 5) / weightRange;
    wheelRotation = normalizedWeight * 180; // 半圆180度
}

// 添加惯性效果
function addInertia() {
    let velocity = 0.5; // 惯性速度
    const friction = 0.95; // 摩擦系数
    
    function animate() {
        if (Math.abs(velocity) > 0.01) {
            wheelRotation += velocity;
            velocity *= friction;
            
            // 更新体重值 - 半圆范围
            const weightRange = 100 - 5;
            const normalizedRotation = ((wheelRotation % 180) + 180) % 180;
            currentWeight = 5 + (normalizedRotation / 180) * weightRange;
            currentWeight = Math.max(5, Math.min(100, currentWeight));
            
            updateWeightDisplay();
            updateDosageDisplay();
            
            requestAnimationFrame(animate);
        }
    }
    
    animate();
}

// 处理手动体重输入
function handleManualWeightInput(event) {
    const value = parseFloat(event.target.value);
    if (!isNaN(value) && value >= 5 && value <= 100) {
        currentWeight = value;
        updateWeightDisplay();
        updateDosageDisplay();
        
        // 更新旋转角度 - 半圆范围
        const weightRange = 100 - 5;
        const normalizedWeight = (currentWeight - 5) / weightRange;
        wheelRotation = normalizedWeight * 180; // 半圆180度
    }
}

// 设置体重
function setWeight(weight) {
    currentWeight = weight;
    updateWeightDisplay();
    updateDosageDisplay();
    
    // 更新旋转角度 - 半圆范围
    const weightRange = 100 - 5;
    const normalizedWeight = (currentWeight - 5) / weightRange;
    wheelRotation = normalizedWeight * 180; // 半圆180度
    
    document.getElementById('manualWeight').value = weight;
    
    // 添加设置动画
    anime({
        targets: '#doseWheel',
        rotate: wheelRotation,
        duration: 300,
        easing: 'easeOutQuad'
    });
}

// 更新体重显示
function updateWeightDisplay() {
    document.getElementById('currentWeight').textContent = currentWeight.toFixed(1);
    document.getElementById('manualWeight').value = currentWeight.toFixed(1);
    
    // 更新剂量盘旋转 - 确保刻度跟随转盘
    const wheel = document.getElementById('doseWheel');
    wheel.style.transform = `rotate(${wheelRotation}deg)`;
    
    // 同时更新刻度容器
    const scale = document.getElementById('weightScale');
    scale.style.transform = `rotate(${wheelRotation}deg)`;
}

// 计算剂量
function calculateDosage() {
    if (!selectedProduct) return;
    
    updateDosageDisplay();
    
    // 计算按钮动画
    const btn = document.getElementById('calculateBtn');
    btn.textContent = '计算完成 ✓';
    btn.classList.add('bg-green-600');
    btn.classList.remove('medical-gradient');
    
    setTimeout(() => {
        btn.textContent = '重新计算';
        btn.classList.remove('bg-green-600');
        btn.classList.add('medical-gradient');
    }, 2000);
    
    // 保存计算历史
    saveCalculationHistory();
}

// 更新剂量显示
function updateDosageDisplay() {
    const result = findDosageRecommendation(currentWeight);
    
    if (!result) {
        document.getElementById('dosageResult').innerHTML = `
            <div class="text-center text-red-500 py-8">
                <svg class="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                <p class="font-medium">体重超出范围</p>
                <p class="text-sm">请检查体重输入是否正确</p>
            </div>
        `;
        return;
    }
    
    const dosageHtml = result.dosages.map(dosage => `
        <div class="dosage-result rounded-lg p-4 mb-4">
            <div class="flex justify-between items-start mb-2">
                <h4 class="font-semibold text-gray-800">${dosage.type}</h4>
                <span class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">${dosage.specification}</span>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <div class="text-sm text-gray-600">用量</div>
                    <div class="text-lg font-bold number-display text-blue-800">${dosage.count} 粒</div>
                </div>
                <div>
                    <div class="text-sm text-gray-600">规格</div>
                    <div class="text-lg font-bold number-display text-green-800">${dosage.specification}</div>
                </div>
            </div>
        </div>
    `).join('');
    
    document.getElementById('dosageResult').innerHTML = `
        <div class="mb-4">
            <div class="bg-blue-50 rounded-lg p-4 mb-4">
                <div class="text-center">
                    <div class="text-sm text-blue-600 font-medium mb-1">患者体重</div>
                    <div class="text-3xl font-bold number-display text-blue-800">${currentWeight.toFixed(1)} kg</div>
                </div>
            </div>
            
            <div class="mb-4">
                <h4 class="font-semibold text-gray-800 mb-3">推荐用药方案（三日疗程）</h4>
                ${dosageHtml}
            </div>
            
            <div class="bg-amber-50 rounded-lg p-4">
                <div class="flex items-start">
                    <svg class="w-5 h-5 text-amber-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                    <div>
                        <div class="text-sm font-medium text-amber-800">用药提醒</div>
                        <div class="text-xs text-amber-700 mt-1">
                            请遵医嘱使用，严格按照推荐剂量服用。如出现不良反应请及时就医。
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 结果动画
    anime({
        targets: '.dosage-result',
        translateX: [-30, 0],
        opacity: [0, 1],
        delay: anime.stagger(100),
        duration: 500,
        easing: 'easeOutQuad'
    });
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
    if (!result) return;
    
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
        history = JSON.parse(savedHistory);
    }
    
    // 添加到历史记录开头
    history.unshift(record);
    
    // 限制历史记录数量（最多100条）
    if (history.length > 100) {
        history = history.slice(0, 100);
    }
    
    // 保存到本地存储
    localStorage.setItem('darteappCalculatorHistory', JSON.stringify(history));
}

// 页面加载动画
function animatePageLoad() {
    // 导航栏动画
    anime({
        targets: 'nav',
        translateY: [-50, 0],
        opacity: [0, 1],
        duration: 800,
        easing: 'easeOutQuad'
    });
    
    // 产品卡片动画
    anime({
        targets: '.product-card',
        translateY: [50, 0],
        opacity: [0, 1],
        delay: anime.stagger(200, {start: 400}),
        duration: 600,
        easing: 'easeOutQuad'
    });
    
    // 标题动画
    anime({
        targets: '.title-font',
        scale: [0.9, 1],
        opacity: [0, 1],
        delay: 200,
        duration: 800,
        easing: 'easeOutQuad'
    });
}

// 工具函数
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function roundToDecimal(num, decimals) {
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}