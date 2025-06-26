import { defineConfig } from 'vitepress'
import { defineTeekConfig } from "vitepress-theme-teek/config";
import { Nav } from "./config/Nav.js"; // 导入Nav模块
import {teekConfig} from "./teekConfig.js";
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
} from "vitepress-plugin-group-icons"; // 导入代码组图标插件


// https://vitepress.dev/reference/site-config
export default defineConfig({
  // Teek 主题配置
  extends: teekConfig,
  lang: 'en-US',
  outDir: '../dist',
  title: "威威 Blog",
  description: "A VitePress Site",
  cleanUrls: true,
  // 当设置为 true 时，将页面元数据提取到单独的 JavaScript 块中，而不是内联在初始 HTML 中。
  // 这使每个页面的 HTML 负载更小，并使页面元数据可缓存，从而当站点中有很多页面时可以减少服务器带宽
  metaChunk: true,
  themeConfig: {
    logo: '/logo.svg',
    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    /*carbonAds: {
      code: 'your-carbon-code',
      placement: 'your-carbon-placement'
    },*/
    // https://vitepress.dev/reference/default-theme-config
    nav: Nav,
    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'gitee', link: 'https://gitee.com/dlwwei' },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025-present Evan You'
    }

  },
  vite: {
    plugins: [
      groupIconVitePlugin(), //代码组图标
    ],
  },
})
