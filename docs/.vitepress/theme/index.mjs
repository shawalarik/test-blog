import Teek from "vitepress-theme-teek";
import "vitepress-theme-teek/index.css";
import {defineComponent, h} from "vue";
import { useData } from "vitepress";

// 主题增强样式
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
import "vitepress-theme-teek/theme-chalk/tk-nav-blur.css"; // 导航栏毛玻璃样式
import "vitepress-theme-teek/tk-plus/banner-full-img-scale.scss"; // Banner 全屏图片放大样式
//import "vitepress-theme-teek/vp-plus/container-flow.scss"; // Markdown 容器流体样式
import "./style/index.scss"; // 引入全局样式
import "virtual:group-icons.css"; //代码组图标样式

import TeekLayoutProvider from "./components/TeekLayoutProvider.vue"; // 布局组件
import sendVisitStatistics from './utils/statistics.mjs' // 信息统计
import NProgress from 'nprogress' // 路由进度条
import 'nprogress/nprogress.css' // 路由进度条样式

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

        // 捕获水合错误并打印详细信息
        app.config.errorHandler = (err, instance, info) => {
            if (err.message.includes('Hydration')) {
                console.log('水合错误组件:', instance);
                console.log('错误信息:', info);
            }
            throw err;
        }

        if (!import.meta.env.SSR) {

            // 开发环境禁用umami统计
            if (import.meta.env.DEV){
                console.log(import.meta.env)
                console.log("开发环境禁用umami统计")
                localStorage.setItem('umami.disabled', 1);
            }

            // 配置进度条
            NProgress.configure({ showSpinner: false })

            // 重写路由钩子
            router.onBeforeRouteChange = (to) => {
                //console.log("onBeforeRouteChange", decodeURIComponent(to))
                NProgress.start() // 开始进度条
            }

            router.onAfterRouteChange = (to) => {
                //console.log("onAfterRouteChange", decodeURIComponent(to))
                // 发送访问记录
                //sendVisitStatistics(router, siteData, fingerprintID)
                NProgress.done() // 停止进度条
            }
            return NProgress
        }
    },
};

