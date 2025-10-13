<template>
  <div class="sort-visualizer-container">
    <!-- 头部标题与算法选择 -->
    <header class="sort-header">
      <h1>排序算法可视化</h1>
      <div class="algorithm-selector">
        <label>选择算法：</label>
        <select v-model="selectedAlgorithm" @change="handleAlgorithmChange" :disabled="isSorting">
          <option v-for="(alg, key) in supportedAlgorithms" :key="key" :value="key">
            {{ alg.name }}
          </option>
        </select>
      </div>
    </header>

    <!-- 可视化核心区域 -->
    <main class="sort-main">
      <!-- 柱状图渲染区 -->
      <div class="visualization-panel">
        <div ref="barsContainer" class="bars-container"></div>
      </div>

      <!-- 控制面板（通用交互） -->
      <div class="control-panel">
        <button @click="generateRandomArray" :disabled="isSorting" class="control-btn primary">
          <i class="icon refresh"></i>
          生成新数组
        </button>
        <button @click="startSorting" :disabled="isSorting" class="control-btn success">
          <i class="icon play"></i>
          开始排序
        </button>
        <button @click="togglePause" :disabled="!isSorting" class="control-btn">
          <i class="icon" :class="isPaused ? 'play' : 'pause'"></i>
          {{ isPaused ? "继续" : "暂停" }}
        </button>
        <button @click="resetSorting" :disabled="!isSorting && currentStep === 0" class="control-btn">
          <i class="icon reset"></i>
          重置
        </button>

        <!-- 数组大小调节 -->
        <div class="array-size-control">
          <label for="arraySize">数组大小:</label>
          <input
            type="range"
            id="arraySize"
            min="5"
            max="50"
            v-model="arraySize"
            @input="handleArraySizeChange"
            :disabled="isSorting"
          />
          <span>{{ arraySize }}</span>
        </div>

        <!-- 速度调节 -->
        <div class="speed-control">
          <label for="speed">排序速度:</label>
          <input type="range" id="speed" min="10" max="500" v-model="animationSpeed" @input="updateSpeedText" />
          <span>{{ speedText }}</span>
        </div>
      </div>

      <!-- 统计信息（通用数据） -->
      <div class="stats-panel">
        <div class="stat-card">
          <div class="stat-value">{{ comparisons }}</div>
          <div class="stat-label">比较次数</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ swaps }}</div>
          <div class="stat-label">交换次数</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ currentStep }}</div>
          <div class="stat-label">当前步骤</div>
        </div>
      </div>

      <!-- 算法详情（动态切换） -->
      <div class="algorithm-detail">
        <h3>{{ currentAlgorithmConfig.name }} 详情</h3>
        <p class="algorithm-desc">{{ currentAlgorithmConfig.description }}</p>

        <h4>算法步骤：</h4>
        <ol class="algorithm-steps">
          <li v-for="(step, idx) in currentAlgorithmConfig.steps" :key="idx">
            {{ step }}
          </li>
        </ol>

        <div class="code-block">
          <pre>{{ currentAlgorithmConfig.code }}</pre>
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="sort-footer">
      <p>通用排序算法可视化框架 &copy; 2025 | 支持动态扩展算法</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, onUnmounted, computed } from "vue";
import { supportedAlgorithms } from "./AlgorithmConfig.js";

// ========================= 1. 通用状态管理 =========================
// DOM引用
const barsContainer = ref(null);

// 核心状态
const array = ref([]); // 当前数组
const arraySize = ref(20); // 数组大小
const animationSpeed = ref(200); // 动画速度（毫秒）
const speedText = ref("200ms"); // 速度显示文本
const isSorting = ref(false); // 是否正在排序
const isPaused = ref(false); // 是否暂停
const animationSteps = ref([]); // 排序步骤队列（通用格式）
const currentStep = ref(0); // 当前执行步骤
const comparisons = ref(0); // 比较次数
const swaps = ref(0); // 交换次数
const currentMarks = ref({ comparing: [], sorted: [], pivot: [] }); // 当前标记（比较中/已排序/基准值）
let animationId = null; // 动画定时器ID

// ========================= 2. 算法配置（核心：新增算法只需扩展此处） =========================

// 当前选中的算法（默认冒泡排序）
const selectedAlgorithm = ref("bubbleSort");
// 当前算法配置（计算属性，自动切换）
const currentAlgorithmConfig = computed(() => {
  return supportedAlgorithms.value[selectedAlgorithm.value];
});

// ========================= 3. 通用工具函数 =========================
/**
 * 生成随机数组
 */
const generateRandomArray = () => {
  stopSorting(); // 停止当前排序
  const newArray = [];
  for (let i = 0; i < arraySize.value; i++) {
    newArray.push(Math.floor(Math.random() * 90) + 10); // 生成10-99的随机数
  }
  array.value = newArray;
  resetMarks(); // 重置标记
  renderBars(); // 重新渲染
  // 重置统计数据
  comparisons.value = 0;
  swaps.value = 0;
  currentStep.value = 0;
  animationSteps.value = [];
};

/**
 * 重置标记（比较中/已排序/基准值）
 */
const resetMarks = () => {
  currentMarks.value = {
    comparing: [],
    sorted: [],
    pivot: []
  };
};

/**
 * 渲染柱状图（通用渲染逻辑，适配不同标记类型）
 */
const renderBars = () => {
  if (!barsContainer.value) return;

  const container = barsContainer.value;
  container.innerHTML = "";
  const containerWidth = container.offsetWidth;
  const containerHeight = container.offsetHeight;

  // 计算柱状图宽度（避免溢出）
  const minBarWidth = 5;
  const maxPossibleBars = Math.floor(containerWidth / minBarWidth);
  const displayArray = array.value.length > maxPossibleBars ? array.value.slice(0, maxPossibleBars) : array.value;

  // 计算柱状图高度比例（适配容器高度）
  const maxValue = Math.max(...displayArray);
  const heightRatio = (containerHeight - 30) / maxValue; // 预留30px显示数值标签

  // 渲染每个柱子
  displayArray.forEach((value, idx) => {
    const bar = document.createElement("div");
    bar.className = "bar";

    // 基础样式
    const barWidth = Math.max(minBarWidth, (containerWidth - (displayArray.length - 1)) / displayArray.length);
    bar.style.width = `${barWidth}px`;
    bar.style.height = `${value * heightRatio}px`; // 按比例计算高度
    bar.style.marginRight = idx < displayArray.length - 1 ? "1px" : "0"; // 间隙

    // 根据标记添加样式类
    if (currentMarks.value.sorted.includes(idx)) {
      bar.classList.add("bar--sorted");
    } else if (currentMarks.value.pivot.includes(idx)) {
      bar.classList.add("bar--pivot");
    } else if (currentMarks.value.comparing.includes(idx)) {
      bar.classList.add("bar--comparing");
    } else {
      bar.classList.add("bar--default");
    }

    // 添加数值标签
    const label = document.createElement("div");
    label.className = "bar__label";
    label.textContent = value;
    bar.appendChild(label);

    container.appendChild(bar);
  });
};

/**
 * 生成排序步骤（调用当前算法的generateSteps方法）
 */
const generateSortSteps = () => {
  const { steps } = currentAlgorithmConfig.value.generateSteps(array.value);
  animationSteps.value = steps;
};

/**
 * 执行排序动画（通用动画逻辑，适配不同步骤类型）
 */
const animateSort = async () => {
  if (currentStep.value >= animationSteps.value.length) {
    // 排序完成
    isSorting.value = false;
    return;
  }

  // 获取当前步骤
  const step = animationSteps.value[currentStep.value];
  array.value = step.array;
  comparisons.value = step.comparisons;
  swaps.value = step.swaps;

  // 更新标记（根据步骤类型）
  currentMarks.value = {
    comparing: step.comparing || [],
    sorted: step.sorted || [],
    pivot: step.pivot || []
  };

  // 等待DOM更新后渲染
  await nextTick();
  renderBars();

  // 执行下一步
  currentStep.value++;
  animationId = setTimeout(animateSort, 510 - animationSpeed.value); // 速度反向调节（值越大越快）
};

// ========================= 4. 通用交互逻辑 =========================
/**
 * 开始排序
 */
const startSorting = () => {
  if (isSorting.value) return;

  // 若未生成步骤，先生成
  if (animationSteps.value.length === 0) {
    generateSortSteps();
  }

  isSorting.value = true;
  isPaused.value = false;
  animateSort();
};

/**
 * 暂停/继续排序
 */
const togglePause = () => {
  if (isPaused.value) {
    // 继续
    isPaused.value = false;
    animateSort();
  } else {
    // 暂停
    isPaused.value = true;
    clearTimeout(animationId);
  }
};

/**
 * 停止排序
 */
const stopSorting = () => {
  isSorting.value = false;
  isPaused.value = false;
  clearTimeout(animationId);
};

/**
 * 重置排序（回到初始状态）
 */
const resetSorting = () => {
  stopSorting();
  currentStep.value = 0;
  resetMarks();
  renderBars();
  comparisons.value = 0;
  swaps.value = 0;
};

/**
 * 更新速度显示文本
 */
const updateSpeedText = () => {
  speedText.value = `${510 - animationSpeed.value}ms`;
};

/**
 * 切换算法时的处理
 */
const handleAlgorithmChange = () => {
  generateRandomArray(); // 生成新数组
};

/**
 * 调整数组大小时的处理
 */
const handleArraySizeChange = () => {
  generateRandomArray(); // 重新生成数组
};

/**
 * 处理窗口 resize
 */
const handleResize = () => {
  if (!isSorting.value) {
    renderBars();
  }
};

// ========================= 5. 生命周期钩子 =========================
onMounted(() => {
  generateRandomArray(); // 初始化数组
  window.addEventListener("resize", handleResize); // 监听窗口大小变化
});

onUnmounted(() => {
  stopSorting(); // 清理动画
  window.removeEventListener("resize", handleResize); // 移除监听
});
</script>

<style scoped>
/* ========================= 通用框架样式 ========================= */
.sort-visualizer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  box-sizing: border-box;
}

/* 头部样式 */
.sort-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
}

.sort-header h1 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin: 0;
}

.algorithm-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
}

.algorithm-selector select {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
}

/* 主内容区样式 */
.sort-main {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 可视化面板 */
.visualization-panel {
  height: 400px;
  background-color: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.bars-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  display: flex;
  align-items: flex-end;
  padding: 10px;
  box-sizing: border-box;
}

/* 柱状图样式（通过深度选择器穿透scoped） */
:deep(.bar) {
  position: relative;
  border-radius: 4px 4px 0 0;
  transition: background-color 0.2s ease;
}

/* 柱状图状态样式（默认/比较中/已排序/基准值） */
:deep(.bar--default) {
  background-color: #3498db;
}

:deep(.bar--comparing) {
  background-color: #e74c3c;
}

:deep(.bar--sorted) {
  background-color: #2ecc71;
}

:deep(.bar--pivot) {
  background-color: #f39c12;
}

/* 柱状图数值标签 */
:deep(.bar__label) {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  font-weight: bold;
  color: #333;
  white-space: nowrap;
}

/* 控制面板样式 */
.control-panel {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background-color: #f1f5f9;
  border-radius: 8px;
  box-sizing: border-box;
}

.control-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: background-color 0.2s ease;
}

.control-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 按钮主题 */
.control-btn.primary {
  background-color: #3498db;
  color: white;
}

.control-btn.primary:hover:not(:disabled) {
  background-color: #2980b9;
}

.control-btn.success {
  background-color: #2ecc71;
  color: white;
}

.control-btn.success:hover:not(:disabled) {
  background-color: #27ae60;
}

.control-btn:not(.primary):not(.success) {
  background-color: #e2e8f0;
  color: #333;
}

.control-btn:not(.primary):not(.success):hover:not(:disabled) {
  background-color: #cbd5e1;
}

/* 图标样式 */
.icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  text-align: center;
}

.icon.refresh::after {
  content: "↺";
}
.icon.play::after {
  content: "▶";
}
.icon.pause::after {
  content: "⏸";
}
.icon.reset::after {
  content: "↺";
}

/* 数组大小/速度调节控件 */
.array-size-control,
.speed-control {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  white-space: nowrap;
  margin-left: auto;
}

.array-size-control input,
.speed-control input {
  width: 120px;
  cursor: pointer;
}

/* 统计面板样式 */
.stats-panel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-top: 10px;
}

.stat-card {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.9rem;
  color: #7f8c8d;
}

/* 算法详情面板 */
.algorithm-detail {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
}

.algorithm-detail h3 {
  color: #2c3e50;
  margin-top: 0;
  font-size: 1.3rem;
}

.algorithm-detail h4 {
  color: #34495e;
  font-size: 1.1rem;
  margin-bottom: 8px;
}

.algorithm-desc {
  line-height: 1.6;
  color: #666;
  margin-bottom: 15px;
}

.algorithm-steps {
  line-height: 1.6;
  color: #666;
  padding-left: 20px;
  margin-bottom: 15px;
}

.algorithm-steps li {
  margin-bottom: 5px;
}

/* 代码块样式 */
.code-block {
  background-color: #f8f9fa;
  border-radius: 4px;
  padding: 15px;
  overflow-x: auto;
}

.code-block pre {
  margin: 0;
  font-family: monospace;
  font-size: 0.9rem;
  color: #333;
  line-height: 1.5;
}

/* 页脚样式 */
.sort-footer {
  text-align: center;
  margin-top: 40px;
  color: #7f8c8d;
  font-size: 0.9rem;
}

/* ========================= 响应式适配 ========================= */
@media (max-width: 768px) {
  .sort-header h1 {
    font-size: 1.5rem;
  }

  .control-panel {
    flex-direction: column;
    align-items: stretch;
  }

  .array-size-control,
  .speed-control {
    margin-left: 0;
    margin-top: 5px;
    width: 100%;
    justify-content: center;
  }

  .visualization-panel {
    height: 300px;
  }

  :deep(.bar__label) {
    font-size: 10px;
    top: -20px;
  }

  .stat-value {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .sort-visualizer-container {
    padding: 10px;
  }

  .algorithm-selector {
    flex-direction: column;
    align-items: flex-start;
  }

  .visualization-panel {
    height: 250px;
  }

  .control-btn {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
}
</style>
