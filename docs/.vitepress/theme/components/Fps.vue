<!-- fps组件 -->
<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from 'vue';

// ------------------ FPS Hook ------------------
function useFPS(enabled = true) {
  const fps = ref(0);
  let frameCount = 0;
  let lastTime = 0;
  let animationFrameId = null;

  const updateFPS = (time: number) => {
    if (!enabled) return;

    if (lastTime === 0) {
      lastTime = time;
      animationFrameId = requestAnimationFrame(updateFPS);
      return;
    }

    const delta = time - lastTime;
    frameCount += 1;

    if (delta > 1000) {
      fps.value = Math.round((frameCount * 1000) / delta);
      frameCount = 0;
      lastTime = time;
    }

    animationFrameId = requestAnimationFrame(updateFPS);
  };

  const startFPS = () => {
    if (enabled && typeof requestAnimationFrame !== 'undefined') {
      lastTime = 0;
      frameCount = 0;
      animationFrameId = requestAnimationFrame(updateFPS);
    }
  };

  const stopFPS = () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  };

  onBeforeUnmount(() => {
    // 组件销毁前停止 FPS 监控
    stopFPS();
  });

  return { fps, startFPS, stopFPS };
}

// ------------------ 使用 Hook ------------------
const showFPS = ref(true);
const {fps, startFPS} = useFPS(showFPS.value);

// ------------------ 初始化 ------------------
onMounted(async () => {
  // 在组件挂载后启动 FPS 监控
  startFPS();
});
</script>

<template>
  <div class="fps-container">
    <div v-if="showFPS" class="fps-font">
      <span class="fps-label">FPS:</span>
      <span>{{ fps }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.fps-container {
  text-align: center;
  margin-top: 10px;
}

.fps-font {
  font-size: 0.9rem;
  font-weight: bold;
}

.fps-label{
  /* 隔离重绘范围 */
  display: inline-block;
}
</style>
