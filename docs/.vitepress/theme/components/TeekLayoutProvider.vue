<script setup lang="ts" name="TeekLayoutProvider">
import type { TeekConfig } from "vitepress-theme-teek";
import Teek, { teekConfigContext, clockIcon } from "vitepress-theme-teek";
import { useData } from "vitepress";
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
import Clock from "./Clock.vue";

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

/*// 彩带背景
const { start: startRibbon, stop: stopRibbon } = useRibbon({ immediate: false, clickReRender: true });
// 页脚运行时间
const { start: startRuntime, stop: stopRuntime } = useRuntime("2025-03-14 00:00:00", {
  prefix: `<span style="width: 16px; display: inline-block; vertical-align: -3px; margin-right: 3px;">${clockIcon}</span>本站已在地球上苟活了`,
});*/

const watchRuntimeAndRibbon = async (layout: string, style: string) => {
  const isHome = layout === "home";
  const isDoc = [undefined, "doc"].includes(layout);
  const isBlog = style.startsWith("blog");

/*  // 博客类风格的首页显示运行时间
  await nextTick();
  if (isHome && isBlog) startRuntime();
  else stopRuntime();
  // startRuntime();

  // 博客类风格的首页显示彩带 & 设置了 pageStyle 的文章页显示彩带
  if ((isHome && isBlog && style !== "blog-body") || (isDoc && teekConfig.value.pageStyle)) startRibbon();
  else stopRibbon();*/
};

watch(frontmatter, async newVal => watchRuntimeAndRibbon(newVal.layout, currentStyle.value), { immediate: true });

const handleConfigSwitch = (config: TeekConfig, style: string) => {
  teekConfig.value = config;

  watchRuntimeAndRibbon(frontmatter.value.layout, style);
};
</script>

<template>
  <Teek.Layout>
    <template #layout-top>
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

    <!-- 布局切换组件 -->
    <template #teek-theme-enhance-top>
      <div :class="['layout-provider', 'flx-align-center']">
        <ConfigSwitch v-model="currentStyle" @switch="handleConfigSwitch" />
      </div>
    </template>

    <!--  归档页插槽  -->
    <template #teek-archives-top-before>
      <ContributeChart />
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

<!--    <template #nav-bar-title-after>
      <h1>nav-bar-title-after</h1>
    </template>-->

<!--    <template #nav-bar-content-before>
      <Clock/>
    </template>-->

    <template #nav-bar-content-after>
      <Clock/>
    </template>




    <template #teek-home-banner-after>
      <InformationCard />
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
