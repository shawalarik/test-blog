<template>
  <div class="under-construction-container">
    <!-- 装饰性图形元素 -->
    <div class="decorative-element top-left"></div>
    <div class="decorative-element bottom-right"></div>

    <div class="content-wrapper">
      <!-- 主标题 -->
      <h1 class="title">页面正在完善中</h1>

      <!-- 装饰性分隔线 -->
      <div class="divider"></div>

      <!-- 说明文字 -->
      <p class="message">
        感谢您的耐心等待！我们正在全力以赴完善此页面，
        以提供更优质的内容和体验。
      </p>

      <!-- 状态指示器 -->
      <div class="progress-indicator">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>

      <div class="button-container">
        <!-- 返回主页按钮 -->
        <button class="button home-button" @click="goHome">
          <i class="fa fa-home mr-2"></i> 返回主页
        </button>

        <button class="button prev-button" @click="goBack">
          <i class="fa fa-home mr-2"></i> 返回上一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {useRouter} from "vitepress";
const router = useRouter(); // 获取 VitePress 路由实例

// 控制进度条动画
const progress = ref(0);

onMounted(() => {
  // 模拟进度条加载动画
  const interval = setInterval(() => {
    progress.value += 1;
    if (progress.value >= 85) {
      clearInterval(interval);
    }
  }, 30);
});

// 返回主页的方法
const goHome = () => {
  router.go("/")
};

const goBack = () => {
  window.history.back();
};

</script>

<style scoped>
.under-construction-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.decorative-element {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  opacity: 0.1;
  z-index: 0;
}

.top-left {
  top: -150px;
  left: -150px;
  background: linear-gradient(135deg, #3b82f6 0%, #93c5fd 100%);
}

.bottom-right {
  bottom: -150px;
  right: -150px;
  background: linear-gradient(135deg, #f97316 0%, #fdba74 100%);
}

.content-wrapper {
  max-width: 600px;
  width: 100%;
  padding: 3rem;
  background: var(--oss-tabs-bg);
  border-radius: 1.5rem;
  box-shadow: 0 3px 10px 0 var(--vp-c-brand-1);
  text-align: center;
  position: relative;
  z-index: 1;
  margin-top: -20rem;
}

.title {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--oss-tabs-active-text);
  margin-bottom: 1.5rem;
  letter-spacing: -1px;
}

.divider {
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #f97316);
  margin: 0 auto 2rem;
  border-radius: 2px;
}

.message {
  font-size: 1.1rem;
  color: #64748b;
  line-height: 1.8;
  margin-bottom: 2.5rem;
}

.progress-indicator {
  height: 6px;
  background-color: #e2e8f0;
  border-radius: 3px;
  margin-bottom: 3rem;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
  transition: width 0.3s ease;
}

.button-container{
  display: flex;
  justify-content: space-evenly;
}

.button {
  color: white;
  border: none;
  padding: 0.875rem 2rem;
  border-radius: 9999px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.button:hover{
  transform: translateY(-2px);
}

.home-button{
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.4);
}

.prev-button{
  background: linear-gradient(135deg, #44e58a 0%, #25eb5d 100%);
  box-shadow: 0 10px 25px -5px rgba(77, 218, 143, 0.4);
}

/* 移动端适配 */
@media (max-width: 640px) {
  .content-wrapper {
    margin: 2rem;
    padding: 2rem;
    border-radius: 1rem;
  }

  .title {
    font-size: 2rem;
  }

/*  .home-button {
    width: 100%;
  }*/
}
</style>
