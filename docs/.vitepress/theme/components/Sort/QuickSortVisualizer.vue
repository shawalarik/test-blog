<template>
  <div class="sort-container">
    <header class="header">
      <h1>快速排序可视化演示</h1>
      <p>通过柱状图直观展示快速排序的工作原理，高度代表数值大小</p>
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
          <input type="range" id="speed" min="500" max="10" v-model="animationSpeed" @input="updateSpeedText" />
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
        <h2>快速排序原理</h2>
        <p>
          快速排序是一种分治法策略的排序算法。它选择一个"基准"元素，将数组分为两部分，
          一部分所有元素都小于基准，另一部分所有元素都大于基准。然后递归地对这两部分进行排序。
        </p>
        <h3>算法步骤：</h3>
        <ol>
          <li>从数组中选择一个元素作为"基准"(pivot)。</li>
          <li>
            重新排列数组，所有比基准值小的元素摆放在基准前面，所有比基准值大的元素摆在基准后面（相同的数可以到任一边）。这个操作称为分区(partition)。
          </li>
          <li>递归地（recursively）把小于基准值元素的子数组和大于基准值元素的子数组进行排序。</li>
        </ol>
        <div class="code-block">
          <pre>
function quickSort(arr, low, high) {
  if (low < high) {
    // pi 是分区索引
    let pi = partition(arr, low, high);

    // 递归排序分区前后的元素
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
}

function partition(arr, low, high) {
  let pivot = arr[high];
  let i = (low - 1); // 小于基准的元素索引

  for (let j = low; j <= high - 1; j++) {
    // 当前元素小于或等于基准
    if (arr[j] <= pivot) {
      i++; // 增加小于基准的元素索引
      swap(arr, i, j); // 交换元素
    }
  }
  swap(arr, i + 1, high);
  return (i + 1);
}</pre
          >
        </div>
      </div>
    </main>

    <footer class="footer">
      <p>快速排序可视化演示工具 &copy; 2025</p>
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
const currentPivotIndex = ref(-1);
const currentPartitionIndices = ref({ low: -1, high: -1 });
const sortedIndices = ref([]);
let animationId = null;

// 初始化
onMounted(() => {
  generateRandomArray();
  window.addEventListener("resize", handleResize);
});

// 处理窗口大小变化
const handleResize = () => {
  if (!isSorting.value) {
    renderBars([...currentComparingIndices.value], currentPivotIndex.value, { ...currentPartitionIndices.value }, [
      ...sortedIndices.value
    ]);
  }
};

// 生成随机数组
const generateRandomArray = () => {
  stopSorting();
  array.value = [];
  for (let i = 0; i < arraySize.value; i++) {
    array.value.push(Math.floor(Math.random() * 90) + 10);
  }
  resetVisualState();
  renderBars();
  comparisons.value = 0;
  swaps.value = 0;
  currentStep.value = 0;
  animationSteps.value = [];
};

// 重置视觉状态
const resetVisualState = () => {
  currentComparingIndices.value = [];
  currentPivotIndex.value = -1;
  currentPartitionIndices.value = { low: -1, high: -1 };
  sortedIndices.value = [];
};

// 渲染柱状图
const renderBars = (comparingIndices = [], pivotIndex = -1, partitionIndices = { low: -1, high: -1 }, sorted = []) => {
  // 验证参数
  if (!Array.isArray(comparingIndices)) comparingIndices = [];
  if (!Array.isArray(sorted)) sorted = [];

  if (!barsContainer.value) return;

  // 保存当前状态用于窗口调整时重新渲染
  currentComparingIndices.value = comparingIndices;
  currentPivotIndex.value = pivotIndex;
  currentPartitionIndices.value = partitionIndices;
  sortedIndices.value = sorted;

  barsContainer.value.innerHTML = "";
  const containerWidth = barsContainer.value.offsetWidth;
  const containerPadding = 10;
  const availableWidth = containerWidth - containerPadding * 2;
  const minBarWidth = 3;
  const maxBarWidth = 50;
  const gap = 1;

  // 计算显示的数组
  let displayArray = array.value;
  const maxPossibleBars = Math.floor(availableWidth / (minBarWidth + gap));
  if (displayArray.length > maxPossibleBars) {
    displayArray = displayArray.slice(0, maxPossibleBars);
  }

  // 计算总间隙
  const totalGap = (displayArray.length - 1) * gap;

  // 计算单个柱状图的理想宽度
  const idealBarWidth = (availableWidth - totalGap) / displayArray.length;

  // 限制在最小和最大宽度之间
  const barWidth = Math.max(minBarWidth, Math.min(maxBarWidth, idealBarWidth));

  // 计算实际总宽度和偏移量
  const totalBarWidth = barWidth * displayArray.length + totalGap;
  const offset = Math.max(0, (availableWidth - totalBarWidth) / 2) + containerPadding;

  displayArray.forEach((value, index) => {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.width = `${barWidth}px`;
    bar.style.height = `${value * 3}px`;
    bar.style.left = `${offset + index * (barWidth + gap)}px`;

    // 设置颜色
    let bgColor = "primary";
    if (sorted.includes(index)) {
      bgColor = "sorted"; // 已排序元素
    } else if (index === pivotIndex) {
      bgColor = "pivot"; // 基准元素
    } else if (comparingIndices.includes(index)) {
      bgColor = "highlight"; // 正在比较的元素
    } else if (partitionIndices.low !== -1 && index >= partitionIndices.low && index <= partitionIndices.high) {
      bgColor = "partition"; // 当前分区元素
    }

    bar.classList.add(bgColor);

    // 添加数值标签
    const numberLabel = document.createElement("div");
    numberLabel.className = "bar-number";
    numberLabel.textContent = value;
    numberLabel.style.display = barWidth < 10 ? "none" : "block";
    bar.appendChild(numberLabel);

    barsContainer.value.appendChild(bar);
  });
};

// 生成快速排序步骤
const generateQuickSortSteps = () => {
  animationSteps.value = [];
  const arrCopy = [...array.value];
  let localComparisons = 0;
  let localSwaps = 0;

  // 快速排序递归函数
  function quickSort(arr, low, high) {
    if (low < high) {
      // 添加选择分区步骤
      animationSteps.value.push({
        type: "select-partition",
        array: [...arr],
        partition: { low, high },
        comparisons: localComparisons,
        swaps: localSwaps
      });

      // 分区操作
      const pi = partition(arr, low, high);

      // 标记基准元素为已排序
      animationSteps.value.push({
        type: "pivot-sorted",
        array: [...arr],
        pivot: pi,
        comparisons: localComparisons,
        swaps: localSwaps
      });

      // 递归排序左右子数组
      quickSort(arr, low, pi - 1);
      quickSort(arr, pi + 1, high);
    }
  }

  // 分区函数
  function partition(arr, low, high) {
    const pivot = arr[high];

    // 添加选择基准步骤
    animationSteps.value.push({
      type: "select-pivot",
      array: [...arr],
      pivot: high,
      partition: { low, high },
      comparisons: localComparisons,
      swaps: localSwaps
    });

    let i = low - 1; // 小于基准的元素索引

    for (let j = low; j <= high - 1; j++) {
      // 添加比较步骤
      animationSteps.value.push({
        type: "compare",
        array: [...arr],
        indices: [j],
        pivot: high,
        partition: { low, high },
        comparisons: ++localComparisons,
        swaps: localSwaps
      });

      // 当前元素小于或等于基准
      if (arr[j] <= pivot) {
        i++; // 增加小于基准的元素索引

        // 如果i != j，添加交换步骤
        if (i !== j) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          animationSteps.value.push({
            type: "swap",
            array: [...arr],
            indices: [i, j],
            pivot: high,
            partition: { low, high },
            comparisons: localComparisons,
            swaps: ++localSwaps
          });
        }
      }
    }

    // 将基准元素放到正确位置
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    animationSteps.value.push({
      type: "final-swap",
      array: [...arr],
      indices: [i + 1, high],
      pivot: i + 1,
      partition: { low, high },
      comparisons: localComparisons,
      swaps: ++localSwaps
    });

    return i + 1;
  }

  // 开始排序
  quickSort(arrCopy, 0, arrCopy.length - 1);

  // 标记所有元素为已排序
  animationSteps.value.push({
    type: "complete",
    array: [...arrCopy],
    sortedIndices: Array.from({ length: arrCopy.length }, (_, i) => i),
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

  nextTick(() => {
    switch (step.type) {
      case "select-partition":
        renderBars([], -1, step.partition, sortedIndices.value);
        break;
      case "select-pivot":
        renderBars([], step.pivot, step.partition, sortedIndices.value);
        break;
      case "compare":
        renderBars(step.indices, step.pivot, step.partition, sortedIndices.value);
        break;
      case "swap":
      case "final-swap":
        renderBars(step.indices, step.pivot, step.partition, sortedIndices.value);
        break;
      case "pivot-sorted":
        const newSorted = [...sortedIndices.value, step.pivot];
        renderBars([], -1, { low: -1, high: -1 }, newSorted);
        sortedIndices.value = newSorted;
        break;
      case "complete":
        renderBars([], -1, { low: -1, high: -1 }, step.sortedIndices);
        break;
    }

    currentStep.value++;
    animationId = setTimeout(animateSort, animationSpeed.value);
  });
};

// 开始排序
const startSorting = () => {
  if (isSorting.value) return;

  if (currentStep.value === 0) {
    sortedIndices.value = [];
    generateQuickSortSteps();
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
  resetVisualState();
  renderBars();
  comparisons.value = 0;
  swaps.value = 0;
};

// 更新速度显示文本
const updateSpeedText = () => {
  speedText.value = `${animationSpeed.value}ms`;
};

// 监听窗口大小变化
watch(
  () => window.innerWidth,
  () => {
    handleResize();
  }
);

// 组件卸载时清理
onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
.sort-container {
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
  justify-content: center;
  padding: 2px;
  box-sizing: border-box;
}

/* 使用深度选择器作用于动态生成的元素 */
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

::v-deep .bar.pivot {
  background-color: #f39c12;
}

::v-deep .bar.partition {
  background-color: #9b59b6;
  opacity: 0.7;
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

  ::v-deep .bar-number {
    font-size: 10px;
    top: -16px;
  }
}
</style>
