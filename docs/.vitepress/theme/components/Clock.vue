<template>
  <div id="clock" class="flex items-center">
    <!--    <span class="date mr-2">{{ date }}</span>
        <span class="time">:</span>-->
    <span class="time font-bold">{{ time }}</span>
  </div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue";

// 日期时间状态
const time = ref<string>('00:00:00');
const date = ref<string>('2023-01-01 星期日');
const week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

// 定时器管理
const timerID = ref<number | null>(null);

// 初始化时钟
const initClock = () => {
  if (timerID.value !== null) {
    cancelAnimationFrame(timerID.value);
  }
  timerID.value = requestAnimationFrame(animateClock);
};

// 动画循环函数
function animateClock(timestamp: number) {
  const cd = new Date();
  time.value = zeroPadding(cd.getHours(), 2) + ':' +
      zeroPadding(cd.getMinutes(), 2) + ':' +
      zeroPadding(cd.getSeconds(), 2);

  date.value = zeroPadding(cd.getFullYear(), 4) + '-' +
      zeroPadding(cd.getMonth() + 1, 2) + '-' +
      zeroPadding(cd.getDate(), 2) + ' ' +
      week[cd.getDay()];

  if (timerID.value !== null) {
    timerID.value = requestAnimationFrame(animateClock);
  }
}

// 数字补零函数
function zeroPadding(num: number, digit: number): string {
  return String(num).padStart(digit, '0');
}

onMounted(()=>{
  // 组件挂载时初始化
  initClock();
})

// 组件卸载时清理
onUnmounted(() => {
  if (timerID.value !== null) {
    cancelAnimationFrame(timerID.value);
  }
});
</script>

<style scoped lang="scss">
/* 移除所有内联样式，改为通过CSS选择器控制 */
#clock {
  order: 99;
  text-align: center;
  margin-left: 15px;
  display: flex;
  align-items: center;
  //font-family: 'Share Tech Mono', monospace;

  .date {
    letter-spacing: 0.1em;
    margin-bottom: 0;
    font-size: 14px;
    white-space: nowrap;
  }

  .time {
    letter-spacing: 0.05em;
    font-size: 16px;
    font-weight: bold;
  }
}

/* 视口宽度 ≤ 767px 时生效（移动端），调整时间显示位置 */
@media (max-width: 767px) {
  // 移动端导航栏吸顶
  #clock{
    order: 0;
  }
}

/* 父级有.full-img-nav-bar类时的样式（Banner范围内） */
:deep(.full-img-nav-bar #clock) {
  color: var(--vp-c-white);
  text-shadow: 0 0 20px rgba(10, 175, 230, 1), 0 0 20px rgba(10, 175, 230, 0);

  /* 暗色模式下的样式 */
/*  :deep(html.dark .full-img-nav-bar #clock) {
    color: #b9199b;
  }*/
}

/* 父级没有.full-img-nav-bar类时的样式（滚动离开Banner后） */
:deep(:not(.full-img-nav-bar) #clock) {
  color: var(--vp-c-text-1);
  text-shadow: none;

  /* 暗色模式下的样式 */
/*  :deep(html.dark :not(.full-img-nav-bar) #clock) {
    color: #daf6ff;
  }*/
}
</style>
