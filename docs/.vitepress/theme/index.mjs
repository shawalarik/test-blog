import Teek from "vitepress-theme-teek";
import "vitepress-theme-teek/index.css";
import {defineComponent, h, nextTick, onMounted, provide, ref} from "vue";
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

// 进度条
import NProgress from 'nprogress'
// 样式
import 'nprogress/nprogress.css'

// 引入全局样式
import "./style/index.scss";
import "virtual:group-icons.css"; //代码组图标样式

import TeekLayoutProvider from "./components/TeekLayoutProvider.vue"; // 布局组件
import Confetti from "./components/Confetti.vue"; //导入五彩纸屑组件
import sendVisitStatistics from './utils/statistics.mjs' // 信息统计

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
        app.component("Confetti", Confetti); // 注册五彩纸屑组件

        if (!import.meta.env.SSR) {
            const fingerprintID = await getFingerprint()

            // 创建过渡状态
            const isTransitioning = ref(false)
            let transitionStart = 0
            // 通过 app.provide 提供状态（替代 provide()）
            app.provide('isTransitioning', isTransitioning)

            // 配置进度条
            NProgress.configure({ showSpinner: false })

            // 重写路由钩子
            router.onBeforeRouteChange = (to) => {
                console.log("onBeforeRouteChange", to)
                transitionStart = Date.now() // 更新 ref 值
                isTransitioning.value = true
                NProgress.start() // 开始进度条
            }

            router.onAfterRouteChange = (to) => {
                console.log("onAfterRouteChange", to)
                sendVisitStatistics(router, siteData, fingerprintID)

                const elapsed = Date.now() - transitionStart
                console.log(`路由切换消耗时间：${elapsed} ms`)
                // 确保过渡动画至少显示 300ms，避免过快消失
                const delay = Math.max(0, 300 - elapsed)
                setTimeout(() => {
                    isTransitioning.value = false
                    NProgress.done() // 停止进度条
                }, delay)
            }
            return NProgress
        }
    },
};

async function getFingerprint() {
    const FingerprintJS = (await import('@fingerprintjs/fingerprintjs')).default;
    // 加载并初始化指纹生成器
    const fpPromise = FingerprintJS.load({
        // 配置项
        debug: false,                  // 启用调试模式，输出详细日志
        delayFallback: 500,            // 异步指纹源的超时时间（毫秒）
        cacheTime: 99999999,      // 指纹缓存时间（毫秒），避免重复计算。设置为 0 可禁用缓存
        preload: true,                 // 页面加载时预加载指纹（提高首次获取速度）
        fallbackCanvas: true,          // 降级使用Canvas指纹（v3默认关闭）
        /*    storageKey: 'my_custom_key',  // 可选：自定义存储键名
            persistence: 'localStorage',*/
        persistence: {
            type: 'localStorage',
            prefix: 'myapp_',
            expiresInDays: 60,
            blocking: true
        },
        components: {                  // 自定义要收集的组件
            userAgent: true,           // 用户代理字符串
            language: true,            // 浏览器语言
            colorDepth: true,          // 屏幕颜色深度
            deviceMemory: true,        // 设备内存（如果可用）
            screenResolution: true,    // 屏幕分辨率
            availableScreenResolution: true, // 可用屏幕分辨率
            timezoneOffset: true,      // 时区偏移
            timezone: true,            // 时区名称
            hardwareConcurrency: true, // CPU核心数
            sessionStorage: true,      // sessionStorage支持
            localStorage: true,        // localStorage支持
            indexedDb: true,           // IndexedDB支持
            addBehavior: true,         // 添加行为分析（专业版）
            fonts: {                   // 字体检测（专业版）
                extendedJsFonts: true,
                canvasFonts: true
            },
            canvas: true,              // Canvas指纹
            webgl: true,               // WebGL指纹
            webglVendorAndRenderer: true, // WebGL供应商和渲染器信息
            adBlock: false,            // 广告拦截器检测
            hasLiedLanguages: false,   // 是否伪造语言设置
            hasLiedResolution: false,  // 是否伪造分辨率
            hasLiedOs: false,          // 是否伪造操作系统
            hasLiedBrowser: false,     // 是否伪造浏览器
            touchSupport: true,        // 触摸支持
            plugins: true,             // 浏览器插件
            audio: true,               // 音频指纹（专业版）
            webRTC: true,              // WebRTC本地IP（专业版）
        }
    })

    const fp = await fpPromise
    const result = await fp.get()
    console.log("您的浏览器指纹是：", result.visitorId);
    return result.visitorId
}



