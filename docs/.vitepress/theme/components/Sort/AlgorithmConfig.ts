// 算法配置接口（统一格式）
import { ref } from "vue";

export interface AlgorithmConfig {
  name: string; // 算法名称
  description: string; // 算法描述
  steps: string[]; // 算法步骤说明
  code: string; // 算法代码示例
  generateSteps: (arr: number[]) => {
    // 生成排序步骤的函数（统一返回格式）
    steps: Array<{
      type: "compare" | "swap" | "markSorted" | "markPivot" | "complete";
      array: number[];
      comparing?: number[]; // 正在比较的索引
      sorted?: number[]; // 已排序的索引
      pivot?: number[]; // 基准值索引（如快速排序）
      comparisons: number;
      swaps: number;
    }>;
  };
}

// 支持的算法列表，新增算法只需按上述格式添加（如插入排序、快速排序）
export const supportedAlgorithms = ref<Record<string, AlgorithmConfig>>({
  // 1. 冒泡排序
  bubbleSort: {
    name: "冒泡排序",
    description:
      "通过重复走访待排序数组，每次比较相邻元素并交换顺序错误的元素，直到无交换为止。适合小规模数据，时间复杂度O(n²)。",
    steps: [
      "比较相邻的两个元素，若前者大于后者则交换位置",
      "从数组起始遍历到末尾，完成后最大元素会“冒泡”到末尾",
      "排除已排序的末尾元素，重复上述步骤",
      "直到所有元素排序完成"
    ],
    code: `function bubbleSort(arr) {
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      if (arr[j] > arr[j + 1]) {
        // 交换元素
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swaps++;
      }
    }
  }
  return { sortedArr: arr, comparisons, swaps };
}`,
    generateSteps: arr => {
      const steps = [];
      const arrCopy = [...arr];
      const n = arrCopy.length;
      let localComparisons = 0;
      let localSwaps = 0;
      const sortedIndices = [];

      for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          // 记录比较步骤
          steps.push({
            type: "compare",
            array: [...arrCopy],
            comparing: [j, j + 1],
            sorted: [...sortedIndices],
            comparisons: ++localComparisons,
            swaps: localSwaps
          });

          // 交换逻辑
          if (arrCopy[j] > arrCopy[j + 1]) {
            [arrCopy[j], arrCopy[j + 1]] = [arrCopy[j + 1], arrCopy[j]];
            localSwaps++;
            // 记录交换步骤
            steps.push({
              type: "swap",
              array: [...arrCopy],
              comparing: [j, j + 1],
              sorted: [...sortedIndices],
              comparisons: localComparisons,
              swaps: localSwaps
            });
          }
        }

        // 标记当前轮已排序的元素（末尾）
        const newSortedIndex = n - i - 1;
        sortedIndices.unshift(newSortedIndex);
        steps.push({
          type: "markSorted",
          array: [...arrCopy],
          sorted: [...sortedIndices],
          comparisons: localComparisons,
          swaps: localSwaps
        });
      }

      // 排序完成（标记所有元素）
      steps.push({
        type: "complete",
        array: [...arrCopy],
        sorted: Array.from({ length: n }, (_, idx) => idx),
        comparisons: localComparisons,
        swaps: localSwaps
      });

      return { steps };
    }
  },

  // 2. 选择排序
  selectionSort: {
    name: "选择排序",
    description:
      "每次从待排序区间找到最小元素，与区间起始位置交换，逐步缩小待排序区间。时间复杂度O(n²)，交换次数少于冒泡排序。",
    steps: [
      "从待排序区间中找到最小元素的索引",
      "将最小元素与待排序区间的第一个元素交换位置",
      "将待排序区间起始位置后移一位",
      "重复上述步骤直到整个数组排序完成"
    ],
    code: `function selectionSort(arr) {
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    // 找到最小元素索引
    for (let j = i + 1; j < n; j++) {
      comparisons++;
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    // 交换最小元素与当前起始位置
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      swaps++;
    }
  }
  return { sortedArr: arr, comparisons, swaps };
}`,
    generateSteps: arr => {
      const steps = [];
      const arrCopy = [...arr];
      const n = arrCopy.length;
      let localComparisons = 0;
      let localSwaps = 0;
      const sortedIndices = [];

      for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        // 标记当前待排序起始位置
        steps.push({
          type: "markPivot",
          array: [...arrCopy],
          pivot: [i],
          sorted: [...sortedIndices],
          comparisons: localComparisons,
          swaps: localSwaps
        });

        // 查找最小元素
        for (let j = i + 1; j < n; j++) {
          steps.push({
            type: "compare",
            array: [...arrCopy],
            comparing: [j, minIndex],
            pivot: [i],
            sorted: [...sortedIndices],
            comparisons: ++localComparisons,
            swaps: localSwaps
          });

          if (arrCopy[j] < arrCopy[minIndex]) {
            minIndex = j;
          }
        }

        // 交换最小元素与起始位置
        if (minIndex !== i) {
          [arrCopy[i], arrCopy[minIndex]] = [arrCopy[minIndex], arrCopy[i]];
          localSwaps++;
          steps.push({
            type: "swap",
            array: [...arrCopy],
            comparing: [i, minIndex],
            sorted: [...sortedIndices],
            comparisons: localComparisons,
            swaps: localSwaps
          });
        }

        // 标记当前已排序的元素（起始位置）
        sortedIndices.push(i);
        steps.push({
          type: "markSorted",
          array: [...arrCopy],
          sorted: [...sortedIndices],
          comparisons: localComparisons,
          swaps: localSwaps
        });
      }

      // 最后一个元素自动排序完成
      sortedIndices.push(n - 1);
      steps.push({
        type: "complete",
        array: [...arrCopy],
        sorted: [...sortedIndices],
        comparisons: localComparisons,
        swaps: localSwaps
      });

      return { steps };
    }
  },

  // 3. 快速排序
  quickSort: {
    name: "快速排序",
    description:
      "选择一个基准值，将数组分为小于和大于基准值的两部分，递归排序子数组。平均时间复杂度O(nlogn)，最坏O(n²)。",
    steps: [
      "选择数组中的一个元素作为基准值（pivot）",
      "将小于基准值的元素移到基准值左侧，大于的移到右侧（分区操作）",
      "对基准值左侧和右侧的子数组重复上述步骤",
      "递归结束后数组排序完成"
    ],
    code: `function quickSort(arr) {
  let comparisons = 0;
  let swaps = 0;

  function partition(low, high) {
    const pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      comparisons++;
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        swaps++;
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    swaps++;
    return i + 1;
  }

  function sort(low, high) {
    if (low < high) {
      const pi = partition(low, high);
      sort(low, pi - 1);
      sort(pi + 1, high);
    }
  }

  sort(0, arr.length - 1);
  return { sortedArr: arr, comparisons, swaps };
}`,
    generateSteps: arr => {
      const steps = [];
      const arrCopy = [...arr];
      const n = arrCopy.length;
      let localComparisons = 0;
      let localSwaps = 0;
      const sortedIndices = [];

      // 快速排序步骤生成逻辑（实现partition和递归排序，记录每步状态）
      function partition(low, high) {
        const pivot = arrCopy[high];
        // 标记基准值
        steps.push({
          type: "markPivot",
          array: [...arrCopy],
          pivot: [high],
          sorted: [...sortedIndices],
          comparisons: localComparisons,
          swaps: localSwaps
        });

        let i = low - 1;
        for (let j = low; j < high; j++) {
          // 标记比较中的元素
          steps.push({
            type: "compare",
            array: [...arrCopy],
            comparing: [j, high],
            pivot: [high],
            sorted: [...sortedIndices],
            comparisons: ++localComparisons,
            swaps: localSwaps
          });

          if (arrCopy[j] < pivot) {
            i++;
            [arrCopy[i], arrCopy[j]] = [arrCopy[j], arrCopy[i]];
            localSwaps++;
            // 标记交换后的状态
            steps.push({
              type: "swap",
              array: [...arrCopy],
              comparing: [i, j],
              pivot: [high],
              sorted: [...sortedIndices],
              comparisons: localComparisons,
              swaps: localSwaps
            });
          }
        }

        // 交换基准值到最终位置
        [arrCopy[i + 1], arrCopy[high]] = [arrCopy[high], arrCopy[i + 1]];
        localSwaps++;
        steps.push({
          type: "swap",
          array: [...arrCopy],
          comparing: [i + 1, high],
          pivot: [i + 1],
          sorted: [...sortedIndices],
          comparisons: localComparisons,
          swaps: localSwaps
        });

        // 标记基准值为已排序
        sortedIndices.push(i + 1);
        steps.push({
          type: "markSorted",
          array: [...arrCopy],
          sorted: [...sortedIndices],
          comparisons: localComparisons,
          swaps: localSwaps
        });

        return i + 1;
      }

      // 递归排序
      function quickSortRecursive(low, high) {
        if (low < high) {
          const pi = partition(low, high);
          quickSortRecursive(low, pi - 1);
          quickSortRecursive(pi + 1, high);
        } else if (low === high) {
          // 单个元素自动排序
          sortedIndices.push(low);
          steps.push({
            type: "markSorted",
            array: [...arrCopy],
            sorted: [...sortedIndices],
            comparisons: localComparisons,
            swaps: localSwaps
          });
        }
      }

      // 执行快速排序并生成步骤
      quickSortRecursive(0, n - 1);

      // 排序完成
      steps.push({
        type: "complete",
        array: [...arrCopy],
        sorted: Array.from({ length: n }, (_, idx) => idx),
        comparisons: localComparisons,
        swaps: localSwaps
      });

      return { steps };
    }
  },

  // 4. 插入排序
  insertionSort: {
    name: "插入排序",
    description:
      "将数组分为已排序和未排序两部分，每次从无序列表中取出元素插入到有序列表的正确位置。适合近乎有序的数据，时间复杂度O(n²)。",
    steps: [
      "将数组第一个元素视为有序列表，其余元素视为无序列表",
      "从无序列表中取出第一个元素，与有序列表元素从后往前比较",
      "找到合适位置插入该元素，有序列表长度加一",
      "重复上述步骤直到无序列表为空"
    ],
    code: `function insertionSort(arr) {
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  
  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    
    while (j >= 0 && arr[j] > key) {
      comparisons++;
      arr[j + 1] = arr[j];
      swaps++;
      j--;
    }
    if (j >= 0) comparisons++;
    arr[j + 1] = key;
  }
  
  return { sortedArr: arr, comparisons, swaps };
}`,
    generateSteps: arr => {
      const steps = [];
      const arrCopy = [...arr];
      const n = arrCopy.length;
      let localComparisons = 0;
      let localSwaps = 0;
      const sortedIndices = [0]; // 初始第一个元素为有序

      for (let i = 1; i < n; i++) {
        const key = arrCopy[i];
        let j = i - 1;

        // 标记当前待插入元素
        steps.push({
          type: "markPivot",
          array: [...arrCopy],
          pivot: [i],
          sorted: [...sortedIndices],
          comparisons: localComparisons,
          swaps: localSwaps
        });

        // 寻找插入位置
        while (j >= 0 && arrCopy[j] > key) {
          steps.push({
            type: "compare",
            array: [...arrCopy],
            comparing: [j, i],
            pivot: [i],
            sorted: [...sortedIndices],
            comparisons: ++localComparisons,
            swaps: localSwaps
          });

          // 元素后移
          arrCopy[j + 1] = arrCopy[j];
          localSwaps++;
          steps.push({
            type: "swap",
            array: [...arrCopy],
            comparing: [j, j + 1],
            pivot: [i],
            sorted: [...sortedIndices],
            comparisons: localComparisons,
            swaps: localSwaps
          });

          j--;
        }

        // 最后一次比较（不满足循环条件时）
        if (j >= 0) {
          steps.push({
            type: "compare",
            array: [...arrCopy],
            comparing: [j, i],
            pivot: [i],
            sorted: [...sortedIndices],
            comparisons: ++localComparisons,
            swaps: localSwaps
          });
        }

        // 插入元素
        arrCopy[j + 1] = key;
        steps.push({
          type: "swap",
          array: [...arrCopy],
          pivot: [j + 1],
          sorted: [...sortedIndices, i],
          comparisons: localComparisons,
          swaps: localSwaps
        });

        // 更新有序列表
        sortedIndices.push(i);
        steps.push({
          type: "markSorted",
          array: [...arrCopy],
          sorted: [...sortedIndices],
          comparisons: localComparisons,
          swaps: localSwaps
        });
      }

      steps.push({
        type: "complete",
        array: [...arrCopy],
        sorted: Array.from({ length: n }, (_, idx) => idx),
        comparisons: localComparisons,
        swaps: localSwaps
      });

      return { steps };
    }
  },

  // 5. 归并排序
  mergeSort: {
    name: "归并排序",
    description:
      "采用分治策略，将数组递归分为两个子数组，排序后合并。稳定排序算法，时间复杂度O(nlogn)，空间复杂度O(n)。",
    steps: [
      "将数组递归分为两个长度大致相等的子数组",
      "对子数组继续递归分割，直到子数组长度为1（天然有序）",
      "合并两个有序子数组为一个更大的有序数组",
      "重复合并过程，最终得到完整的有序数组"
    ],
    code: `function mergeSort(arr) {
  let comparisons = 0;
  let swaps = 0;
  
  function merge(left, right) {
    const result = [];
    let i = 0, j = 0;
    
    while (i < left.length && j < right.length) {
      comparisons++;
      if (left[i] <= right[j]) {
        result.push(left[i++]);
      } else {
        result.push(right[j++]);
        swaps++;
      }
    }
    
    return result.concat(left.slice(i)).concat(right.slice(j));
  }
  
  function sort(arr) {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = sort(arr.slice(0, mid));
    const right = sort(arr.slice(mid));
    return merge(left, right);
  }
  
  const sortedArr = sort(arr);
  return { sortedArr, comparisons, swaps };
}`,
    generateSteps: arr => {
      const steps = [];
      const arrCopy = [...arr];
      const n = arrCopy.length;
      let localComparisons = 0;
      let localSwaps = 0;
      const currentArray = [...arrCopy];

      // 记录步骤的辅助函数
      const recordStep = (type, data = {}) => {
        steps.push({
          type,
          array: [...currentArray],
          comparisons: localComparisons,
          swaps: localSwaps,
          ...data
        });
      };

      // 归并排序实现（带步骤记录）
      function merge(left, leftStart, right, rightStart) {
        const result = [];
        let i = 0,
          j = 0;
        const leftIndices = left.map((_, idx) => leftStart + idx);
        const rightIndices = right.map((_, idx) => rightStart + idx);

        // 标记当前合并的两个子数组
        recordStep("markPivot", {
          pivot: [...leftIndices, ...rightIndices]
        });

        while (i < left.length && j < right.length) {
          // 记录比较步骤
          recordStep("compare", {
            comparing: [leftStart + i, rightStart + j],
            pivot: [...leftIndices, ...rightIndices]
          });
          localComparisons++;

          if (left[i] <= right[j]) {
            result.push(left[i++]);
          } else {
            result.push(right[j++]);
            localSwaps++;
          }
        }

        // 合并剩余元素
        const merged = result.concat(left.slice(i)).concat(right.slice(j));
        // 更新当前数组状态
        merged.forEach((val, idx) => {
          currentArray[leftStart + idx] = val;
        });

        // 记录合并结果
        recordStep("swap", {
          pivot: [...leftIndices, ...rightIndices]
        });
        return merged;
      }

      function mergeSortRecursive(arr, startIndex) {
        if (arr.length <= 1) {
          if (arr.length === 1) {
            recordStep("markSorted", { sorted: [startIndex] });
          }
          return arr;
        }

        const mid = Math.floor(arr.length / 2);
        const left = arr.slice(0, mid);
        const right = arr.slice(mid);
        const leftStart = startIndex;
        const rightStart = startIndex + mid;

        // 递归排序左右子数组
        const sortedLeft = mergeSortRecursive(left, leftStart);
        const sortedRight = mergeSortRecursive(right, rightStart);

        // 合并排序后的子数组
        return merge(sortedLeft, leftStart, sortedRight, rightStart);
      }

      // 执行归并排序
      mergeSortRecursive([...arrCopy], 0);

      // 标记排序完成
      recordStep("complete", {
        sorted: Array.from({ length: n }, (_, idx) => idx)
      });

      return { steps };
    }
  },

  // 6. 堆排序
  heapSort: {
    name: "堆排序",
    description:
      "利用堆（完全二叉树）的数据结构特性，先构建最大堆，再反复提取堆顶元素并调整堆。时间复杂度O(nlogn)，不稳定排序。",
    steps: [
      "将无序数组构建成最大堆（父节点大于子节点）",
      "将堆顶元素（最大值）与堆尾元素交换，堆大小减一",
      "对新的堆顶元素执行堆调整，维持最大堆特性",
      "重复步骤2-3，直到堆大小为1，数组排序完成"
    ],
    code: `function heapSort(arr) {
  let comparisons = 0;
  let swaps = 0;
  const n = arr.length;

  // 构建最大堆
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }

  // 提取堆顶元素
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    swaps++;
    heapify(arr, i, 0);
  }

  function heapify(arr, heapSize, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < heapSize) {
      comparisons++;
      if (arr[left] > arr[largest]) largest = left;
    }
    
    if (right < heapSize) {
      comparisons++;
      if (arr[right] > arr[largest]) largest = right;
    }

    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      swaps++;
      heapify(arr, heapSize, largest);
    }
  }

  return { sortedArr: arr, comparisons, swaps };
}`,
    generateSteps: arr => {
      const steps = [];
      const arrCopy = [...arr];
      const n = arrCopy.length;
      let localComparisons = 0;
      let localSwaps = 0;
      let heapSize = n;
      const sortedIndices = [];

      // 记录步骤的辅助函数
      const recordStep = (type, data = {}) => {
        steps.push({
          type,
          array: [...arrCopy],
          comparisons: localComparisons,
          swaps: localSwaps,
          sorted: [...sortedIndices],
          ...data
        });
      };

      // 堆调整函数（带步骤记录）
      function heapify(i) {
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;

        // 标记当前堆节点
        recordStep("markPivot", { pivot: [i] });

        // 比较左子节点
        if (left < heapSize) {
          recordStep("compare", {
            comparing: [i, left],
            pivot: [i]
          });
          localComparisons++;
          if (arrCopy[left] > arrCopy[largest]) {
            largest = left;
          }
        }

        // 比较右子节点
        if (right < heapSize) {
          recordStep("compare", {
            comparing: [largest, right],
            pivot: [i]
          });
          localComparisons++;
          if (arrCopy[right] > arrCopy[largest]) {
            largest = right;
          }
        }

        // 交换并递归调整
        if (largest !== i) {
          [arrCopy[i], arrCopy[largest]] = [arrCopy[largest], arrCopy[i]];
          localSwaps++;
          recordStep("swap", {
            comparing: [i, largest],
            pivot: [largest]
          });
          heapify(largest);
        }
      }

      // 1. 构建最大堆
      recordStep("markPivot", { pivot: [] }); // 初始标记
      for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(i);
      }

      // 2. 提取堆顶元素并调整
      for (let i = n - 1; i > 0; i--) {
        // 交换堆顶与当前堆尾
        [arrCopy[0], arrCopy[i]] = [arrCopy[i], arrCopy[0]];
        localSwaps++;
        sortedIndices.unshift(i); // 标记当前堆尾为已排序
        recordStep("swap", {
          comparing: [0, i],
          sorted: [...sortedIndices]
        });

        // 缩小堆大小并调整
        heapSize--;
        heapify(0);
      }

      // 最后一个元素自动排序
      sortedIndices.unshift(0);
      recordStep("markSorted", { sorted: [...sortedIndices] });

      // 排序完成
      recordStep("complete", {
        sorted: Array.from({ length: n }, (_, idx) => idx)
      });

      return { steps };
    }
  }
});
