<template>
  <div id="aplayer"></div>
</template>

<script setup>
import 'aplayer/dist/APlayer.min.css';
import APlayer from 'aplayer';
import { audio } from '../utils/musicData'; // 假设这是你的音频数据来源
import { onMounted, onBeforeUnmount } from "vue";

let player = null;

onMounted(() => {
  player = new APlayer({
    container: document.getElementById('aplayer'),
    audio: audio,
    fixed: true, // 固定播放器到底部
    mini: true, // 是否开启迷你模式，默认为false
    autoplay: true, // 自动播放（注意：自动播放可能受到浏览器策略限制）
    theme: '#b7daff', // 主题颜色
    loop: 'all', // 列表循环模式
    order: 'list', // 列表播放顺序
    preload: 'auto', // 预加载方式
    volume: 0.4, // 默认音量，范围0~1
    storageName: 'aplayer-setting', // 存储播放器设置的 localStorage key

  });
});

onBeforeUnmount(() => {
  if (player) {
    player.destroy(); // 组件销毁前清理播放器实例
  }
});
</script>

<style scoped>
/*#aplayer .aplayer-body.aplayer-fixed {
  bottom: 0; !* 确保播放器贴紧页面底部 *!
  left: 0;
  right: 0;
  z-index: 99999; !* 确保播放器显示在其他内容之上 *!
}

!* 如果你想让播放器有更多自定义样式 *!
#aplayer {
  position: fixed !important; !* 强制使用固定定位 *!
  width: 100%; !* 宽度占满整个屏幕宽度 *!
}

 #aplayer .aplayer-info {
   display: block !important;
   height: auto !important;
   opacity: 1 !important;
 }*/
</style>
