<template>
  <ComponentShowcase :components="componentList" />
</template>

<script setup lang="ts">
// 导入需要展示的组件
import ComponentShowcase from "./ComponentShowcase.vue";
import BubbleSortVisualizer from "./BubbleSortVisualizer.vue";
import QuickSortVisualizer from "./QuickSortVisualizer.vue";

// 定义组件列表
const componentList = [
  {
    id: "BubbleSortVisualizer",
    name: "冒泡排序",
    description: "冒泡排序",
    component: BubbleSortVisualizer,
    props: { initialValue: 0 },
    usage: "可以通过initialValue属性设置初始值"
  },
  {
    id: "QuickSortVisualizer",
    name: "快速排序",
    description: "快速排序",
    component: QuickSortVisualizer,
    props: { initialValue: 0 },
    usage: "可以通过initialValue属性设置初始值"
  }
];
</script>

<style scoped></style>
