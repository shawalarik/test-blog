<template>
  <div class="svg-render">
    <!-- 检测是否为SVG字符串（包含<svg标签） -->
    <template v-if="isSvgString(svg)">
      <div v-html="svg"></div>
    </template>
    <!-- 否则视为图片地址 -->
    <template v-else>
      <img :src="svg" :alt="alt || '菜单图标'" class="svg-image" />
    </template>
  </div>
</template>

<script setup lang="ts">
// 定义Props类型
defineProps<{
  svg: string; // 可能是SVG字符串或图片地址
  color?: string;
  alt?: string; // 图片替代文本（可选）
}>();

// 判断是否为SVG字符串（简单检测是否包含<svg标签）
const isSvgString = (content: string) => {
  if (!content) return false;
  // 检测是否包含<svg标签（不区分大小写）
  return content.trim().startsWith("<svg");
};
</script>

<style scoped>
.svg-render {
}

/* 确保v-html插入的SVG正确显示 */
.svg-render :deep(svg) {
  width: 100%;
  height: 100%;
}
</style>
