import Teek, { teekConfigContext, TkCommentTwikoo, twikooContext, useTeekConfig } from "vitepress-theme-teek";
import "vitepress-theme-teek/index.css";
import { defineComponent, h, provide, watch } from "vue";
import { useData, useRouter } from "vitepress";

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
//import "vitepress-theme-teek/theme-chalk/tk-doc-fade-in.css"; // 文档淡入效果样式
import "vitepress-theme-teek/theme-chalk/tk-banner-desc-gradient.css"; // Banner 描述渐变样式
import "vitepress-theme-teek/theme-chalk/tk-nav-blur.css"; // 导航栏毛玻璃样式
import "vitepress-theme-teek/tk-plus/banner-full-img-scale.scss"; // Banner 全屏图片放大样式
import "vitepress-theme-teek/tk-plus/fade-up-animation.scss"; // Banner 描述渐变样式
//import "vitepress-theme-teek/vp-plus/container-flow.scss"; // Markdown 容器流体样式
import "./style/index.scss"; // 引入全局样式
import "virtual:group-icons.css"; //代码组图标样式

import TeekLayoutProvider from "./components/TeekLayoutProvider.vue"; // 布局组件
import sendVisitStatistics from "./utils/statistics"; // 信息统计
import NProgress from "nprogress"; // 路由进度条
import "nprogress/nprogress.css"; // 路由进度条样式
//import { useLenis } from "lenis/vue";
import FriendshipLink from "./components/FriendshipLink/index.vue";
import twikoo from "twikoo";
import PasswordProtect from "./components/PasswordProtect/PasswordProtect.vue";

// 配置需要密码保护的URL模式（支持通配符*）
const protectedRoutes = [
  "/private/*", // 保护/private下的所有页面
  "/about-me" // 保护特定页面
];

// 通配符匹配函数
const matchPattern = (path: string, pattern: string): boolean => {
  // 精确匹配
  if (pattern === path) return true;

  // 通配符匹配
  if (pattern.endsWith("*")) {
    const basePattern = pattern.slice(0, -1);
    return path.startsWith(basePattern);
  }

  return false;
};

// 检查路径是否需要密码保护
const isProtectedPath = (path: string): boolean => {
  return protectedRoutes.some(pattern => matchPattern(path, pattern));
};

// 检查页面是否已验证
const isPageVerified = (pageId: string): boolean => {
  const verifiedPages = JSON.parse(localStorage.getItem("vpVerifiedPages") || "{}");
  return !!verifiedPages[pageId];
};

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
      const props: { class?: string } = {};
      const { frontmatter } = useData();

      const router = useRouter();

      // 监听路由变化，检查密码保护
      watch(
        () => router.route.path,
        newPath => {
          checkPasswordProtection(newPath, frontmatter.password);
        },
        { immediate: true }
      );

      // 根据元数据动态应用 CSS 类，实现页面级样式定制
      if (frontmatter.value?.layoutClass) {
        props.class = frontmatter.value.layoutClass;
      }

      function checkPasswordProtection(currentPath: string, frontmatterPassword?: string) {
        // 检查是否是密码保护页面
        const requiresPassword = frontmatterPassword || isProtectedPath(currentPath);

        if (requiresPassword) {
          const password = frontmatterPassword || "123"; // 可以从配置中获取默认密码
          const pageId = currentPath;

          // 如果未验证，则显示密码输入组件
          if (!isPageVerified(pageId)) {
            // 创建密码验证组件并显示
            const app = document.querySelector("#app");
            if (app) {
              // 保存原始内容
              const originalContent = app.innerHTML;
              app.innerHTML = '<div id="password-protect-container"></div>';

              // 挂载密码组件
              const container = document.querySelector("#password-protect-container");
              if (container) {
                const vnode = h(PasswordProtect, {
                  correctPassword: password,
                  pageId: pageId,
                  onVerified: (success: boolean) => {
                    if (success) {
                      // 验证成功，恢复原始内容
                      app.innerHTML = originalContent;
                      // 触发路由刷新
                      window.location.reload();
                    }
                  }
                });

                // 手动挂载组件
                import("vue").then(({ createApp }) => {
                  createApp(vnode).mount(container);
                });
              }
            }
          }
        }
      }

      return () => h(TeekLayoutProvider, props);
    }
  }),
  /**
   * 增强 Vue 应用实例
   *  app: App // Vue 应用实例
   *  router: Router // VitePress 路由实例
   *  siteData: Ref<SiteData> // 站点级元数据
   * @optional
   */
  async enhanceApp({ app, router, siteData }) {
    // 使用数组统一注册组件，减少重复代码
    const globalComponents = [
      { name: "friend-link", component: FriendshipLink } // 注册友链组件
    ];

    globalComponents.forEach(({ name, component }) => {
      app.component(name, component); // 全局注册组件
    });

    // @ts-ignore-error
    if (!import.meta.env.SSR) {
      //const { lenisInstance,onScroll } = useMyLenis()
      //console.log("lenisInstance", lenisInstance);

      // 开发环境禁用umami统计
      // @ts-ignore-error
      if (import.meta.env.DEV) {
        // @ts-ignore-error
        console.log(import.meta.env);
        console.log("开发环境禁用umami统计");
        localStorage.setItem("umami.disabled", "1");
      }

      // 配置进度条
      NProgress.configure({ showSpinner: false });

      // 重写路由钩子
      router.onBeforeRouteChange = to => {
        //console.log("onBeforeRouteChange", decodeURIComponent(to))
        NProgress.start(); // 开始进度条
      };

      router.onAfterRouteChange = to => {
        //console.log("onAfterRouteChange", decodeURIComponent(to))
        // 发送访问记录
        //sendVisitStatistics(router, siteData, fingerprintID)
        NProgress.done(); // 停止进度条
      };
      return NProgress;
    }
  }
};
