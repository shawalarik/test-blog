<!-- 首页banner箭头 -->
<script setup lang="ts" name="BannerImgArrow">
import { TkIcon } from "vitepress-theme-teek";
// 将资源引入为字符串
import ArrowSvg from "/svg/arrow.svg?raw";

import { ref } from "vue";

const namespace = "banner";

const handleClickArrow = () => {
  // 获取窗口高度
  const windowH = document.getElementsByClassName("tk-banner")[0].clientHeight;
  window.scrollTo({
    top: windowH - 20,
    behavior: "smooth",
  });
};

const isMobile = ref(false);
</script>

<template>
  <div v-if="!isMobile" :class="`${namespace}-arrow tk-wallpaper-outside`">
    <TkIcon
      :icon="ArrowSvg"
      size="50px"
      color="#ffffff"
      :class="`${namespace}-arrow__icon`"
      @click="handleClickArrow"
    />
  </div>
</template>

<style lang="scss" scoped>
$namespace: banner;

.#{$namespace}-arrow {
  position: absolute;
  bottom: 120px;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0.6;
  transition: opacity 0.3s;

  &__icon {
    cursor: pointer;
    animation: bounce-in 3s 2s infinite;
  }
}

.#{$namespace}-arrow:hover {
  opacity: 1;
}

@keyframes bounce-in {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(20px);
  }

  100% {
    transform: translateY(0);
  }
}
</style>
