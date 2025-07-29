<template>
  <div class="under-construction-container flex items-center justify-center relative overflow-hidden  dark:bg-gray-900">
    <!-- 装饰性图形 -->
    <div class="absolute top-[-150px] left-[-150px] w-[300px] h-[300px] rounded-full bg-gradient-to-br from-blue-500 to-sky-300 opacity-10"></div>
    <div class="absolute bottom-[-150px] right-[-150px] w-[300px] h-[300px] rounded-full bg-gradient-to-br from-orange-500 to-amber-300 opacity-10"></div>

    <!-- 主内容区 -->
    <div class="content-wrapper relative z-10 max-w-md sm:max-w-lg w-full mx-4 p-6 sm:p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
      <!-- 标题 -->
      <h1 class="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 dark:text-white mb-6 tracking-tight">
        页面正在完善中
      </h1>

      <!-- 分隔线 -->
      <div class="w-[60px] h-[4px] bg-gradient-to-r from-blue-500 to-orange-500 rounded-full mx-auto mb-6"></div>

      <!-- 说明文字 -->
      <p class="text-gray-600 dark:text-gray-300 text-center text-base sm:text-lg leading-relaxed mb-8">
        感谢您的耐心等待！我们正在全力以赴完善此页面，以提供更优质的内容和体验。
      </p>

      <!-- 进度条 -->
      <div class="h-[6px] bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-8">
        <div
            class="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 ease-out"
            :style="{ width: progress + '%' }"
        ></div>
      </div>

      <!-- 按钮组 -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button
            @click="goHome"
            class="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-full shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-1 transition-all duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <span>返回主页</span>
        </button>

        <button
            @click="goBack"
            class="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-full shadow-lg shadow-green-500/20 hover:shadow-green-500/30 hover:-translate-y-1 transition-all duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
          <span>返回上一页</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vitepress';

const router = useRouter();
const progress = ref(0);

// 模拟进度加载动画
onMounted(() => {
  const interval = setInterval(() => {
    progress.value += 1;
    if (progress.value >= 85) clearInterval(interval);
  }, 30);
});

// 返回主页
const goHome = () => {
  router.go('/');
};

// 返回上一页
const goBack = () => {
  window.history.back();
};
</script>

<style scoped>
/* 仅保留必要的自定义样式，其他通过 Tailwind 实现 */
.under-construction-container {
  min-height: calc(100vh - var(--vp-nav-height) - 1px);
}

</style>
