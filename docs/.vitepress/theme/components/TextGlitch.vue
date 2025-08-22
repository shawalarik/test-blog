<!-- 首页文字特效组件（优化重绘版本） -->
<template>
  <div class="glitch-wrapper">
    <div class="glitch" :data-text="text">{{ text }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  text: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
.glitch-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.glitch {
  position: relative;
  font-family: "Fredericka the Great", Mulish, -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif;
  font-size: 4.5em;
  line-height: 1.5;
  color: white;
  cursor: url(/mouse/pointer.cur), auto !important;
  animation: glitch-skew 2s infinite linear alternate-reverse;
  text-shadow: 0 1px 0 hsl(174, 5%, 80%), 0 2px 0 hsl(174, 5%, 75%),
  0 3px 0 hsl(174, 5%, 70%), 0 4px 0 hsl(174, 5%, 66%),
  0 5px 0 hsl(174, 5%, 64%), 0 6px 0 hsl(174, 5%, 62%),
  0 7px 0 hsl(174, 5%, 61%), 0 8px 0 hsl(174, 5%, 60%),
  0 0 5px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.2),
  0 3px 5px rgba(0, 0, 0, 0.2), 0 5px 10px rgba(0, 0, 0, 0.2),
  0 10px 10px rgba(0, 0, 0, 0.2), 0 20px 20px rgba(0, 0, 0, 0.3);

  /* 优化2：提示浏览器该元素将频繁动画，提前准备复合层 */
  will-change: transform;
}

@media (max-width: 500px) {
  .glitch {
    font-size: 3em;
  }
}

.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* 优化：继承父元素的will-change，减少重复声明 */
  will-change: transform, clip-path;
}

.glitch::before {
  /* 优化3：用transform代替left偏移，利用GPU加速 */
  transform: translateX(2px);
  text-shadow: -2px 0 #ff00c1;
  /* 优化4：用clip-path代替clip（现代浏览器更高效） */
  clip-path: inset(44px 0 56px 0); /* 等价于rect(44px, 450px, 56px, 0) */
  animation: glitch-anim 10s infinite linear alternate-reverse;
}

.glitch:hover::after {
  /* 优化3：用transform代替left偏移 */
  transform: translateX(-2px);
  text-shadow: -2px 0 #00fff9, 2px 2px #ff00c1;
  clip-path: inset(24px 0 36px 0); /* 等价于rect(24px, 450px, 36px, 0) */
  animation: glitch-anim2 2s infinite linear alternate-reverse;
}

/* 优化5：减少关键帧数量（保留核心变化点），降低动画频率 */
@keyframes glitch-anim {
  0% {
    clip-path: inset(64px 0 98px 0);
    transform: translateX(2px) skew(0.85deg);
  }
  20% {
    clip-path: inset(76px 0 41px 0);
    transform: translateX(2px) skew(0.96deg);
  }
  40% {
    clip-path: inset(23px 0 25px 0);
    transform: translateX(2px) skew(0.46deg);
  }
  60% {
    clip-path: inset(57px 0 20px 0);
    transform: translateX(2px) skew(0.65deg);
  }
  80% {
    clip-path: inset(74px 0 45px 0);
    transform: translateX(2px) skew(0.62deg);
  }
  100% {
    clip-path: inset(88px 0 13px 0);
    transform: translateX(2px) skew(0.1deg);
  }
}

@keyframes glitch-anim2 {
  0% {
    clip-path: inset(43px 0 58px 0);
    transform: translateX(-2px) skew(0.59deg);
  }
  25% {
    clip-path: inset(19px 0 98px 0);
    transform: translateX(-2px) skew(0.22deg);
  }
  50% {
    clip-path: inset(22px 0 88px 0);
    transform: translateX(-2px) skew(0.36deg);
  }
  75% {
    clip-path: inset(44px 0 85px 0);
    transform: translateX(-2px) skew(0.44deg);
  }
  100% {
    clip-path: inset(14px 0 36px 0);
    transform: translateX(-2px) skew(0.93deg);
  }
}

@keyframes glitch-skew {
  0%, 20%, 50% { transform: skew(1deg); }
  30%, 60%, 80% { transform: skew(-1deg); }
  70% { transform: skew(2deg); }
  100% { transform: skew(-2deg); }
}
</style>
