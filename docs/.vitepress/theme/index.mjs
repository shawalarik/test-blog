import Teek from "vitepress-theme-teek";
import "vitepress-theme-teek/index.css";
import { defineComponent, h } from "vue";
import { useData } from "vitepress";

// Teek 在线主题包引用（需安装 Teek 在线版本）
import "vitepress-theme-teek/index.css"; // 引入主题样式
import "vitepress-theme-teek/theme-chalk/tk-code-block-mobile.css"; // 引入移动端代码块样式
import "vitepress-theme-teek/theme-chalk/tk-sidebar.css"; // 引入侧边栏样式
import "vitepress-theme-teek/theme-chalk/tk-nav.css"; // 引入导航栏样式
import "vitepress-theme-teek/theme-chalk/tk-aside.css"; // 文章目录样式
import "vitepress-theme-teek/theme-chalk/tk-doc-h1-gradient.css"; // 文档以及标题样式
import "vitepress-theme-teek/theme-chalk/tk-table.css"; // 表格样式
import "vitepress-theme-teek/theme-chalk/tk-mark.css"; // 文章 mark 标签样式
import "vitepress-theme-teek/theme-chalk/tk-blockquote.css"; //引用样式
import "vitepress-theme-teek/theme-chalk/tk-index-rainbow.css"; // Vitepress 首页彩虹渐变样式
import "vitepress-theme-teek/theme-chalk/tk-doc-fade-in.css"; // 文档淡入效果样式
import "vitepress-theme-teek/theme-chalk/tk-banner-desc-gradient.css"; // Banner 描述渐变样式

// 主题增强样式
import "vitepress-theme-teek/theme-chalk/tk-nav-blur.css"; // 导航栏毛玻璃样式
import "vitepress-theme-teek/tk-plus/banner-full-img-scale.scss"; // Banner 全屏图片放大样式
//import "vitepress-theme-teek/vp-plus/container-flow.scss"; // Markdown 容器流体样式

// 引入全局样式
import "./style/index.scss";
import "virtual:group-icons.css"; //代码组图标样式

import TeekLayoutProvider from "./components/TeekLayoutProvider.vue"; // 布局组件
import Confetti from "./components/Confetti.vue"; //导入五彩纸屑组件

export default {
    /**
     * 扩展另一个主题，在我们的主题之前调用它的 `enhanceApp`
     * @optional
     */
    extends: Teek,
    /**
     * 每个页面的根布局组件
     * @required
     */
    //Layout: TeekLayoutProvider,
    Layout: defineComponent({
        name: "LayoutProvider",
        setup() {
            const props = {};
            const { frontmatter } = useData();

            // 根据元数据动态应用 CSS 类，实现页面级样式定制
            if (frontmatter.value?.layoutClass) {
                props.class = frontmatter.value.layoutClass;
            }

            return () => h(TeekLayoutProvider, props);
        },
    }),
    /**
     * 增强 Vue 应用实例
     *  app: App // Vue 应用实例
     *  router: Router // VitePress 路由实例
     *  siteData: Ref<SiteData> // 站点级元数据
     * @optional
     */
    async enhanceApp({ app, router, siteData }) {
        // 注册组件
        app.component("Confetti", Confetti); // 注册五彩纸屑组件
    },
};
