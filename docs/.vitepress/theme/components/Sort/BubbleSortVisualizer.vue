<template>
  <div class="bubble-sort-container">
    <header class="header">
      <h1>冒泡排序可视化演示</h1>
      <p>通过柱状图直观展示冒泡排序的工作原理，高度代表数值大小</p>
    </header>

    <main class="main-content">
      <!-- 排序可视化区域 -->
      <div class="sort-visualization">
        <div ref="barsContainer" class="bars-container"></div>
      </div>

      <!-- 控制面板 -->
      <div class="control-panel">
        <button @click="generateRandomArray" :disabled="isSorting" class="btn primary">
          <i class="icon refresh"></i>
          生成新数组
        </button>
        <button @click="startSorting" :disabled="isSorting" class="btn success">
          <i class="icon play"></i>
          开始排序
        </button>
        <button @click="togglePause" :disabled="!isSorting" class="btn">
          <i class="icon" :class="isPaused ? 'play' : 'pause'"></i>
          {{ isPaused ? "继续" : "暂停" }}
        </button>
        <button @click="resetSorting" :disabled="!isSorting && currentStep === 0" class="btn">
          <i class="icon reset"></i>
          重置
        </button>

        <div class="speed-control">
          <label for="speed">速度:</label>
          <input type="range" id="speed" min="10" max="500" v-model="animationSpeed" @input="updateSpeedText" />
          <span>{{ speedText }}</span>
        </div>
      </div>

      <!-- 统计信息 -->
      <div class="stats">
        <div class="stat-card">
          <div class="stat-value">{{ comparisons }}</div>
          <div class="stat-label">比较次数</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ swaps }}</div>
          <div class="stat-label">交换次数</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ arraySize }}</div>
          <div class="stat-label">数组大小</div>
        </div>
      </div>

      <!-- 算法说明 -->
      <div class="algorithm-info">
        <h2>冒泡排序原理</h2>
        <p>
          冒泡排序是一种简单的排序算法。它重复地走访过要排序的数列，一次比较两个元素，如果它们的顺序错误就把它们交换过来。
          走访数列的工作是重复地进行直到没有再需要交换，也就是说该数列已经排序完成。
        </p>
        <h3>算法步骤：</h3>
        <ol>
          <li>比较相邻的元素。如果第一个比第二个大，就把它们交换过来。</li>
          <li>对每一对相邻元素作同样的工作，从开始第一对到结尾的最后一对。这步做完后，最后的元素会是最大的数。</li>
          <li>针对所有的元素重复以上的步骤，除了最后一个。</li>
          <li>持续每次对越来越少的元素重复上面的步骤，直到没有任何一对数字需要比较。</li>
        </ol>
        <div class="code-block">
          <pre>
function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n-1; i++) {
    for (let j = 0; j < n-i-1; j++) {
      if (arr[j] > arr[j+1]) {
        // 交换 arr[j] 和 arr[j+1]
        let temp = arr[j];
        arr[j] = arr[j+1];
        arr[j+1] = temp;
      }
    }
  }
  return arr;
}</pre
          >
        </div>
      </div>
    </main>

    <footer class="footer">
      <p>冒泡排序可视化演示工具 &copy; 2025</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, onUnmounted } from "vue";

// 引用
const barsContainer = ref(null);

// 状态变量
const array = ref([]);
const arraySize = ref(20);
const animationSpeed = ref(200); // 毫秒
const speedText = ref("200ms");
const isSorting = ref(false);
const isPaused = ref(false);
const animationSteps = ref([]);
const currentStep = ref(0);
const comparisons = ref(0);
const swaps = ref(0);
const currentComparingIndices = ref([]);
const currentSortedIndices = ref([]);
let animationId = null;

// 初始化
onMounted(() => {
  generateRandomArray();
  window.addEventListener("resize", handleResize);
});

// 处理窗口大小变化
const handleResize = () => {
  if (!isSorting.value) {
    // 确保使用有效的数组参数
    renderBars([...currentComparingIndices.value], [...currentSortedIndices.value]);
  }
};

// 生成随机数组
const generateRandomArray = () => {
  stopSorting();
  array.value = [];
  for (let i = 0; i < arraySize.value; i++) {
    array.value.push(Math.floor(Math.random() * 90) + 10);
  }
  currentComparingIndices.value = [];
  currentSortedIndices.value = [];
  renderBars();
  comparisons.value = 0;
  swaps.value = 0;
  currentStep.value = 0;
  animationSteps.value = [];
};

// 渲染柱状图
const renderBars = (comparingIndices = [], sortedIndices = []) => {
  // 验证参数是否为数组，避免报错
  if (!Array.isArray(comparingIndices)) comparingIndices = [];
  if (!Array.isArray(sortedIndices)) sortedIndices = [];

  if (!barsContainer.value) return;

  // 保存当前状态用于窗口调整时重新渲染
  currentComparingIndices.value = comparingIndices;
  currentSortedIndices.value = sortedIndices;

  barsContainer.value.innerHTML = "";
  const containerWidth = barsContainer.value.offsetWidth;
  console.log("containerWidth", containerWidth);
  // 计算柱状图宽度，确保不会溢出容器
  const minBarWidth = 5; // 最小柱状图宽度
  const maxPossibleBars = Math.floor(containerWidth / minBarWidth);

  // 如果数组太大，限制最大显示数量
  let displayArray = array.value;
  if (array.value.length > maxPossibleBars) {
    displayArray = array.value.slice(0, maxPossibleBars);
  }

  const barWidth = Math.max(minBarWidth, containerWidth / displayArray.length);
  console.log("displayArray", displayArray.length);
  console.log("barWidth", barWidth);

  displayArray.forEach((value, index) => {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.width = `${barWidth}px`;
    bar.style.height = `${value * 3}px`;
    //bar.style.left = `${index * (barWidth / 5 + 1)}px`;

    // 设置颜色
    let bgColor = "primary";
    if (comparingIndices.includes(index)) {
      bgColor = "highlight";
    } else if (sortedIndices.includes(index)) {
      bgColor = "sorted";
    }

    bar.classList.add(bgColor);

    // 添加数值标签
    const numberLabel = document.createElement("div");
    numberLabel.className = "bar-number";
    numberLabel.textContent = value;
    bar.appendChild(numberLabel);

    barsContainer.value.appendChild(bar);
  });
};

// 生成排序步骤
const generateSortSteps = () => {
  animationSteps.value = [];
  const arrCopy = [...array.value];
  const n = arrCopy.length;
  let localComparisons = 0;
  let localSwaps = 0;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // 记录比较步骤
      animationSteps.value.push({
        type: "compare",
        indices: [j, j + 1],
        array: [...arrCopy],
        comparisons: localComparisons + 1,
        swaps: localSwaps
      });

      localComparisons++;

      if (arrCopy[j] > arrCopy[j + 1]) {
        // 交换元素
        [arrCopy[j], arrCopy[j + 1]] = [arrCopy[j + 1], arrCopy[j]];

        // 记录交换步骤
        animationSteps.value.push({
          type: "swap",
          indices: [j, j + 1],
          array: [...arrCopy],
          comparisons: localComparisons,
          swaps: localSwaps + 1
        });

        localSwaps++;
      }
    }

    // 标记已排序的元素
    animationSteps.value.push({
      type: "sorted",
      indices: [],
      sortedIndices: Array.from({ length: i + 1 }, (_, k) => n - k - 1),
      array: [...arrCopy],
      comparisons: localComparisons,
      swaps: localSwaps
    });
  }

  // 标记所有元素为已排序
  animationSteps.value.push({
    type: "complete",
    indices: [],
    sortedIndices: Array.from({ length: n }, (_, k) => k),
    array: [...arrCopy],
    comparisons: localComparisons,
    swaps: localSwaps
  });
};

// 执行排序动画
const animateSort = () => {
  if (currentStep.value >= animationSteps.value.length) {
    isSorting.value = false;
    return;
  }

  const step = animationSteps.value[currentStep.value];
  array.value = step.array;
  comparisons.value = step.comparisons;
  swaps.value = step.swaps;

  // 使用nextTick确保DOM更新后再渲染
  nextTick(() => {
    if (step.type === "compare" || step.type === "swap") {
      renderBars(step.indices || [], step.sortedIndices || []);
    } else {
      renderBars([], step.sortedIndices || []);
    }

    currentStep.value++;
    animationId = setTimeout(animateSort, 510 - animationSpeed.value); // 反转值使滑块右侧更快
  });
};

// 开始排序
const startSorting = () => {
  if (isSorting.value) return;

  if (currentStep.value === 0) {
    generateSortSteps();
  }

  isSorting.value = true;
  isPaused.value = false;
  animateSort();
};

// 暂停/继续排序
const togglePause = () => {
  if (isPaused.value) {
    // 继续排序
    isPaused.value = false;
    animateSort();
  } else {
    // 暂停排序
    isPaused.value = true;
    clearTimeout(animationId);
  }
};

// 停止排序
const stopSorting = () => {
  isSorting.value = false;
  isPaused.value = false;
  clearTimeout(animationId);
};

// 重置排序
const resetSorting = () => {
  stopSorting();
  currentStep.value = 0;
  renderBars();
  comparisons.value = 0;
  swaps.value = 0;
};

// 更新速度显示文本
const updateSpeedText = () => {
  speedText.value = `${510 - animationSpeed.value}ms`;
};

// 监听窗口大小变化，重新渲染柱状图
watch(
  () => window.innerWidth,
  () => {
    handleResize();
  }
);

// 组件卸载时清理事件监听
onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
.bubble-sort-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 10px;
}

.header p {
  color: #666;
  font-size: 1rem;
  max-width: 600px;
  margin: 0 auto;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sort-visualization {
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
  justify-content: space-around;
  gap: 1px;
  padding: 2px;
  box-sizing: border-box; /* 确保padding不会增加容器总宽度 */
}

/* 使用深度选择器穿透scoped限制，作用于动态生成的元素 */
::v-deep .bar {
  position: relative;
  background-color: #3498db;
  transition: all 0.3s ease;
  border-radius: 4px 4px 0 0;
}

::v-deep .bar.primary {
  background-color: #3498db;
}

::v-deep .bar.highlight {
  background-color: #e74c3c;
}

::v-deep .bar.sorted {
  background-color: #2ecc71;
}

::v-deep .bar-number {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  font-weight: bold;
  color: #333;
  white-space: nowrap;
}

.control-panel {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background-color: #f1f5f9;
  border-radius: 8px;
  flex-wrap: wrap;
}

.speed-control {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.speed-control input {
  width: 120px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: background-color 0.2s;
  background-color: #e2e8f0;
  color: #333;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn:hover:not(:disabled) {
  background-color: #cbd5e1;
}

.btn.primary {
  background-color: #3498db;
  color: white;
}

.btn.primary:hover:not(:disabled) {
  background-color: #2980b9;
}

.btn.success {
  background-color: #2ecc71;
  color: white;
}

.btn.success:hover:not(:disabled) {
  background-color: #27ae60;
}

.icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  position: relative;
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

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.stat-card {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

.algorithm-info {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.algorithm-info h2 {
  color: #2c3e50;
  margin-top: 0;
}

.algorithm-info h3 {
  color: #34495e;
}

.algorithm-info p {
  line-height: 1.6;
  color: #666;
}

.algorithm-info ol {
  line-height: 1.6;
  color: #666;
  padding-left: 20px;
}

.code-block {
  background-color: #f8f9fa;
  border-radius: 4px;
  padding: 15px;
  margin-top: 15px;
  overflow-x: auto;
}

.code-block pre {
  margin: 0;
  font-family: monospace;
  font-size: 0.9rem;
  color: #333;
}

.footer {
  text-align: center;
  margin-top: 40px;
  color: #7f8c8d;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .control-panel {
    flex-direction: column;
    align-items: stretch;
  }

  .speed-control {
    margin-left: 0;
    margin-top: 10px;
    justify-content: center;
  }

  .header h1 {
    font-size: 1.5rem;
  }

  /* 在小屏幕上减少数组大小，避免显示不全 */
  .bars-container {
    padding: 1px;
  }

  ::v-deep .bar-number {
    font-size: 10px;
    top: -16px;
  }
}
</style>
