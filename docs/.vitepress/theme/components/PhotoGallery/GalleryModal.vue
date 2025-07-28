<template>
  <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 transition-opacity duration-300"
      @click="close"
  >
    <div class="relative max-w-5xl w-full mx-4" @click.stop>
      <!-- 关闭按钮 -->
      <button
          class="absolute -top-12 right-0 text-white text-2xl hover:text-gray-300 transition-colors"
          @click="close"
      >
        &times;
      </button>

      <!-- 图片 -->
      <img
          :src="currentImage.src"
          :alt="currentImage.alt"
          class="max-h-[80vh] mx-auto rounded-lg shadow-2xl"
      />

      <!-- 图片信息 -->
      <div class="mt-4 text-center text-white">
        <h3 class="text-xl font-semibold">{{ currentImage.title || '照片' }}</h3>
        <p class="text-gray-300 mt-1">{{ currentImage.description || '' }}</p>
      </div>

      <!-- 切换按钮 -->
      <button
          v-if="hasPrev"
          class="absolute left-[-2rem] top-1/2 -translate-y-1/2 text-white text-4xl hover:text-gray-300 transition-colors"
          @click="prev"
      >
        &lsaquo;
      </button>
      <button
          v-if="hasNext"
          class="absolute right-[-2rem] top-1/2 -translate-y-1/2 text-white text-4xl hover:text-gray-300 transition-colors"
          @click="next"
      >
        &rsaquo;
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, defineEmits, defineProps } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  images: {
    type: Array,
    required: true
  },
  currentIndex: {
    type: Number,
    default: 0
  }
});

const emits = defineEmits(['close', 'update:currentIndex']);

// 当前图片计算属性
const currentImage = computed(() => props.images[props.currentIndex] || {});

// 前后图片判断
const hasPrev = computed(() => props.currentIndex > 0);
const hasNext = computed(() => props.currentIndex < props.images.length - 1);

// 关闭模态框
const close = () => emits('close');

// 切换图片
const prev = () => emits('update:currentIndex', props.currentIndex - 1);
const next = () => emits('update:currentIndex', props.currentIndex + 1);
</script>

<style scoped>
/* 可添加组件特定样式 */
</style>
