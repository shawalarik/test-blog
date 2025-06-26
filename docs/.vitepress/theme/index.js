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

// 引入Demo\docs-base\.vitepress\theme\style\index.scss全局样式
import "./style/index.scss";
import "virtual:group-icons.css"; //代码组图标样式

import MNavLinks from "./components/MNavLinks.vue"; // 引入导航组件
import confetti from "./components/Confetti.vue"; //导入五彩纸屑组件
import NavIcon from "./components/NavIcon.vue"; //导入导航栏图标
import TitleChange from "./components/TitleChange.vue";
import TeekLayoutProvider from "./components/TeekLayoutProvider.vue"; //导入导航栏图标

export default {
    extends: Teek,
    Layout: defineComponent({
        name: "LayoutProvider",
        setup() {
            const props = {};
            const { frontmatter } = useData();

            // 添加自定义 class 逻辑
            if (frontmatter.value?.layoutClass) {
                props.class = frontmatter.value.layoutClass;
            }

            return () => h(TeekLayoutProvider, props);
        },
    }),
    //Layout: '',
    async enhanceApp({ app, router }) {
        // 注册组件
        app.component("MNavLinks", MNavLinks); // 注册导航组件
        app.component("confetti", confetti); // 注册五彩纸屑组件
        app.component("NavIcon", NavIcon); //导航栏图标
        app.component("TitleChange", TitleChange); //导航栏图标
    },
};
