<!-- 音乐播放组件 -->
<template>
  <ClientOnly>
    <div id="aplayer" style="display:none;"></div>
  </ClientOnly>
</template>

<script setup>
import {onMounted, onBeforeUnmount, nextTick} from "vue";
import { audio } from '$internal/music-data'; // 导入虚拟模块中的数据
// .vitepress/theme/index.js
import 'aplayer/dist/APlayer.min.css';

let player = null;

// 动态导入 APlayer（只在浏览器环境中执行）
const initAPlayer = async () => {
  // 确保在浏览器环境中
  if (typeof window === 'undefined') return;

  // 动态导入 APlayer 和样式
  const {default: APlayer} = await import('aplayer');
  //import('aplayer/dist/APlayer.min.css');

  // 等待 DOM 更新完成
  //await nextTick();

  //const {audio} = await import('../../config/musicData');
  console.log("audio", audio)
  if (audio.length === 0){
    return;
  }

  player = new APlayer({
    container: document.getElementById('aplayer'),
    audio: audio,
    fixed: true,
    mini: true,
    autoplay: true,
    theme: '#b7daff',
    loop: 'all',
    order: 'random', // 启用随机播放
    preload: 'auto',
    volume: 0.1, // 设置初始音量
    storageName: 'aplayer-setting',

  });

  // 当 APlayer 初始化完成后显示播放器
  player.on('canplay', function() {
    document.getElementById('aplayer').style.display = 'block';
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
