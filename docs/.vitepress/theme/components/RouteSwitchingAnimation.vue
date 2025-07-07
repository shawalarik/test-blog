<!-- 路由切换动画组件 -->
<template>
  <div class="vp-layout">
    <!-- 主内容区域，添加过渡动画 -->
    <!-- 使用 TransitionGroup 实现滑动效果 -->
    <Transition
        name="slide"
        mode="out-in"
        appear
        v-if="!isTransitioning"
    >
      <main :key="route.path" >
        <slot />
      </main>
    </Transition>

    <!-- 过渡遮罩层（可选） -->
    <div v-else class="transition-mask">
      <div class="loader">
        <div class="spinner"></div>
        <p>Loading...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import {useRoute} from "vitepress";
const route = useRoute();

// 通过依赖注入获取路由过渡状态
const isTransitioning = inject('isTransitioning')
</script>

<style>
/* 页面过渡动画 */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}

/* 过渡遮罩层样式 */
.transition-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.loader {
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 10px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 滑动动画效果 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s ease;
  position: absolute;
  width: 100%;
}

.slide-enter-from {
  transform: translateX(20px);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}
</style>
