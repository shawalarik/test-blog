<script setup lang="ts" name="TeekLayoutProvider">
import {isClient, TeekConfig} from "vitepress-theme-teek";
import Teek, { teekConfigContext } from "vitepress-theme-teek";
import {useData, useRoute, useRouter} from "vitepress";
import { watch, nextTick, ref, provide } from "vue";
import { teekBlogFullConfig } from "../../config/TeekConfig";
/*import { useRibbon } from "../composables/useRibbon";
import { useRuntime } from "../composables/useRuntime";*/
// @ts-ignore
import ConfigSwitch from "./ConfigSwitch.vue";
// @ts-ignore
import ContributeChart from "./ContributeChart.vue"; // 贡献图组件
// @ts-ignore
import NoticeContent from "./NoticeContent.vue"; //导入公告组件
// @ts-ignore
import BannerImgArrow from "./BannerImgArrow.vue"; //导入横幅图片箭头组件
// @ts-ignore
import NotFound from "./NotFound.vue";//导入404组件
// @ts-ignore
import GlobalGreet from "./GlobalGreet.vue";  //导入全局问候组件
// @ts-ignore
import TitleChange from "./TitleChange.vue" //导入网页标题变化
// @ts-ignore
//import OhMyLive2D from "./OhMyLive2D.vue"  //导入看板娘组件
// @ts-ignore
import ScrollProgressBar from "./ScrollProgressBar.vue" //导入顶部滚动条组件
// @ts-ignore
import InformationCard from "./InformationCard.vue";
// 音乐组件
import APlayer from "./APlayer.vue";
// 首页文字特效组件
import TextGlitch from "./TextGlitch.vue";
// 时钟组件
import Clock from "./Clock.vue";
// 右键菜单组件
import ContextMenu from "./ContextMenu/ContextMenu.vue";
// 过渡动画
import RouteSwitchingAnimation from "./RouteSwitchingAnimation.vue";
import {useRibbon} from "../composables/useRibbon";
import {useRuntime} from "../composables/useRuntime";


/**
site: Ref<SiteData<T>> 站点级元数据
theme: Ref<T>  .vitepress/config.js 中的 themeConfig
page: Ref<PageData> 页面级元数据
frontmatter: Ref<PageData['frontmatter']>  页面 frontmatter
params: Ref<PageData['params']> 动态路由参数
title: Ref<string>
description: Ref<string>
lang: Ref<string>
isDark: Ref<boolean>
dir: Ref<string>
localeIndex: Ref<string>*/
const { frontmatter,title } = useData();

// 默认卡片风
const currentStyle = ref("blog-full");
const teekConfig = ref(teekBlogFullConfig);
provide(teekConfigContext, teekConfig);

// 彩带背景
const { start: startRibbon, stop: stopRibbon } = useRibbon({ immediate: false, clickReRender: true });
// 页脚运行时间
const { start: startRuntime, stop: stopRuntime } = useRuntime("2025-06-15 00:00:00", {});

const watchRuntimeAndRibbon = async (layout: string, style: string) => {
  if (!isClient) return;
  await nextTick();
  console.log("watchRuntimeAndRibbon", layout, style);
  //startRibbon()
  startRuntime()
};

watch(frontmatter, async newVal => watchRuntimeAndRibbon(newVal.layout, currentStyle.value), { immediate: true });

const handleConfigSwitch = (config: TeekConfig, style: string) => {
  teekConfig.value = config;

  watchRuntimeAndRibbon(frontmatter.value.layout, style);
};

// 处理菜单操作
const handleAction = (action) => {
  console.log('执行操作:', action)
}

</script>

<template>
  <Teek.Layout>
    <template #layout-top>
      <!-- 需要进行ssr优化 -->
      <ClientOnly>
        <!-- 添加全局右键菜单 -->
        <ContextMenu/>
      </ClientOnly>

      <!-- 路由切换动画组件 -->
      <RouteSwitchingAnimation/>

      <!-- 全局问候组件 -->
      <GlobalGreet />
      <!-- 看板娘组件 -->
<!--      <OhMyLive2D />-->
      <!-- 顶部滚动条组件 -->
      <ScrollProgressBar />
      <!-- 网页标题切换组件 -->
      <TitleChange />
      <!-- 音乐播放器组件 -->
      <APlayer />
    </template>

    <template #nav-bar-content-after>
      <Clock/>
    </template>

    <!-- 布局切换组件 -->
    <template #teek-theme-enhance-top>
      <ConfigSwitch v-model="currentStyle" @switch="handleConfigSwitch" />
    </template>

<!--    <template #not-found>
      <NotFound />
    </template>-->

    <template #teek-notice-content>
      <!-- 公告组件 -->
      <NoticeContent />
    </template>

    <template #teek-home-banner-feature-after>
      <!-- 横幅图片箭头组件 -->
      <BannerImgArrow v-if="frontmatter.layout === 'home'" />
    </template>

    <template #teek-home-banner-content-before>
      <TextGlitch :text=title />
    </template>

    <template #teek-home-banner-after>
      <InformationCard />
    </template>

    <!--  归档页插槽  -->
    <template #teek-archives-top-before>
      <ContributeChart />
    </template>
  </Teek.Layout>
</template>

<style lang="scss">
.tk-my.is-circle-bg {
  .tk-my__avatar.circle-rotate {
    margin-top: 200px;
  }
}
</style>
