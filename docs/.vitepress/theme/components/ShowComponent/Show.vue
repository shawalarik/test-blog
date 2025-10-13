<template>
  <ComponentShowcase :components="componentList" />
</template>

<script setup lang="ts">
// 导入需要展示的组件
import ComponentShowcase from "./ComponentShowcase.vue";
import SortVisualizer from "../Sort/SortVisualizer.vue";

// 定义组件列表
const componentList = [
  {
    id: "SortVisualizer",
    name: "排序算法可视化",
    description: "排序算法可视化，支持多种算法切换",
    component: SortVisualizer,
    props: { initialValue: 0 },
    usage: "可以通过initialValue属性设置初始值"
  }
];
</script>

<style scoped></style>
