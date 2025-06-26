<template>
  <div id="aplayer"></div>
</template>

<script setup>
import {onMounted, onBeforeUnmount, nextTick} from "vue";

let player = null;

// 动态导入 APlayer（只在浏览器环境中执行）
const initAPlayer = async () => {
  // 确保在浏览器环境中
  if (typeof window === 'undefined') return;

  // 动态导入 APlayer 和样式
  const {default: APlayer} = await import('aplayer');
  import('aplayer/dist/APlayer.min.css');

  // 等待 DOM 更新完成
  //await nextTick();

  // 假设这是你的音频数据来源
  const {audio} = await import('../utils/musicData');

  player = new APlayer({
    container: document.getElementById('aplayer'),
    audio: audio,
    fixed: true,
    mini: true,
    autoplay: true,
    theme: '#b7daff',
    loop: 'all',
    order: 'list',
    preload: 'auto',
    volume: 0.2,
    storageName: 'aplayer-setting',
  });
};

onMounted(() => {
  initAPlayer();
});

onBeforeUnmount(() => {
  if (player) {
    player.destroy();
  }
});
</script>

<style scoped>
/*!* 播放器样式保持不变 *!
#aplayer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99999;
}*/
</style>
