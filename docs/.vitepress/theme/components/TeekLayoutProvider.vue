<script setup name="TeekLayoutProvider">
import { isClient, useEventListener, useStorage } from "vitepress-theme-teek";
import Teek, { teekConfigContext } from "vitepress-theme-teek";
import { useData } from "vitepress";
import { watch, nextTick, ref, provide, onMounted } from "vue";
import {
  teekDocConfig,
  teekBlogConfig,
  teekBlogParkConfig,
  teekBlogFullConfig,
  teekBlogBodyConfig,
  teekBlogCardConfig
} from "../../config/TeekConfig";
import ConfigSwitch from "./ConfigSwitch.vue"; // 右上角布局切换组件
import ContributeChart from "./ContributeChart.vue"; // 贡献图组件
import NoticeContent from "./NoticeContent.vue"; //导入公告组件
import BannerImgArrow from "./BannerImgArrow.vue"; //导入横幅图片箭头组件
import GlobalGreet from "./GlobalGreet.vue"; //导入全局问候组件
import TitleChange from "./TitleChange.vue"; //导入网页标题变化
//import OhMyLive2D from "./OhMyLive2D.vue"  //导入看板娘组件
import ScrollProgressBar from "./ScrollProgressBar.vue"; //导入顶部滚动条组件
import InformationCard from "./InformationCard.vue"; // 主页天气组件
import APlayer from "./APlayer.vue"; // 音乐组件
import TextGlitch from "./TextGlitch.vue"; // 首页文字特效组件
import Clock from "./Clock.vue"; // 时钟组件
import ContextMenu from "./ContextMenu/ContextMenu.vue"; // 右键菜单组件
import RouteSwitchingLoading from "./RouteSwitchingLoading.vue"; // 过渡动画组件
import { useRuntime } from "../composables/useRuntime";
import { myConsoleInfo } from "../utils/WwUtils";
import NotFound from "./NotFound.vue";
import BackTop from "./BackTop.vue";
import NoticeCard from "./NoticeCard.vue";
import Fps from "./Fps.vue";

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
const { frontmatter, title } = useData();

// 后续通过 handleConfigSwitch 方法改变配置这里传递空引用给 provide 即可
const teekConfig = ref({});
provide(teekConfigContext, teekConfig);

// 页脚运行时间
const { start: startRuntime, stop: stopRuntime } = useRuntime("2025-06-15 00:00:00", {});

const watchRuntimeAndRibbon = async layout => {
  if (!isClient) return;
  await nextTick();
  startRuntime();
};

watch(frontmatter, async newVal => watchRuntimeAndRibbon(newVal.layout), { immediate: true });

const handleConfigSwitch = (config, style) => {
  console.log("handleConfigSwitch style", style);
  teekConfig.value = config;

  //watchRuntimeAndRibbon(frontmatter.value.layout, style);
};

onMounted(() => {
  myConsoleInfo(true, import.meta.env.TITLE, import.meta.env.BLOG_URL, "欢迎来访");
});
</script>

<template>
  <Teek.Layout>
    <template #layout-top>
      <!-- 全局右键菜单组件 -->
      <ContextMenu />
      <!-- 路由切换遮罩动画组件 -->
      <RouteSwitchingLoading />
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
      <!-- 扣子ai组件 -->
      <!--      <CozeAi/>-->
    </template>

    <template #nav-bar-content-after>
      <Clock />
    </template>

    <!-- 回到顶部组件插槽 -->
    <template #teek-back-top>
      <BackTop />
    </template>

    <!-- 布局切换组件 -->
    <template #teek-theme-enhance-bottom>
      <ConfigSwitch @switch="handleConfigSwitch" />
    </template>

    <!-- 布局切换组件 移动端 -->
    <template #nav-screen-content-after>
      <ConfigSwitch @switch="handleConfigSwitch" />
    </template>

    <template #not-found>
      <NotFound />
    </template>

    <template #teek-notice-content>
      <!-- 公告组件 -->
      <NoticeContent />
    </template>

    <!-- 自定义公告卡片 -->
    <template #teek-home-card-my-after>
      <NoticeCard />
    </template>

    <template #teek-home-banner-feature-after>
      <!-- 横幅图片箭头组件 -->
      <BannerImgArrow v-if="frontmatter.layout === 'home'" />
    </template>

    <template #teek-home-banner-name>
      <TextGlitch :text="title" />
    </template>

    <template #teek-home-banner-after>
      <Fps />
      <!--      <InformationCard />-->
    </template>

    <!--  归档页插槽  -->
    <template #teek-archives-top-before>
      <ContributeChart />
    </template>

    <!--    <template #teek-sidebar-trigger="{ active, icon, toggleSideBar }">
      &lt;!&ndash; 如下是 Teek 当前实现的部分内容，这些 class 会激活 Teek 的内置样式 &ndash;&gt;
      <div :class="{ active: active }" class="tk-sidebar-trigger is-active" @click="toggleSideBar">
        <div class="tk-right-bottom-button__button">
          <TkIcon :icon="icon" />
        </div>
      </div>
    </template>-->
  </Teek.Layout>
</template>

<style lang="scss"></style>
