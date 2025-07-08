import { defineConfig } from 'vitepress'
// @ts-ignore
import { defineTeekConfig } from "vitepress-theme-teek/config";
import { Head } from "./config/Head"; // 导入页面head配置
import { Nav } from "./config/Nav"; // 导入Nav模块
//import {teekConfig} from "./config/TeekConfig";
import { SocialLinks } from "./config/SocialLinks.js";
import { plugings } from "./plugins.mjs";
import path from "path";

// 是否为开发模式
const isDev = process.argv.includes('dev');

if (isDev) {
  console.log('正在以开发模式运行');
} else {
  console.log('正在构建生产版本');
}

const teekConfig = defineTeekConfig({
  // 分类页
/*  category: {
    path: "/categories",
  },*/
  riskLink: {
    enabled: true,
  },
  // 新版代码块配置
  codeBlock: {
    disabled: false, // 是否禁用新版代码块
    collapseHeight: 700, // 超出高度后自动折叠，设置 true 则默认折叠，false 则默认不折叠
    copiedDone: (TkMessage) => TkMessage.success("代码已复制 🎉"),
  },
  vitePlugins: {
    sidebarOption: {
      initItems: false, //这条命令注释后，才会让文档和目录的样式保持一致
      collapsed: true, //打开侧边栏自动收缩功能
      // ignoreList: ["nav"], //忽略的文件夹和文件
      ignoreWarn: true, // 忽略警告
    },
    autoFrontmatter: true, // 自动生成 frontmatter
    permalinkOption: {
      notFoundDelayLoad: 1000, // 1秒后加载
    },
  },
});

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // Teek 主题配置
  extends: teekConfig,
  base: "/",
  lang: "zh-CN",
  outDir: '../dist',
  title: "威威 Blog",
  head: Head,
  description: "A VitePress Site",
  cleanUrls: true,
  // 当设置为 true 时，将页面元数据提取到单独的 JavaScript 块中，而不是内联在初始 HTML 中。
  // 这使每个页面的 HTML 负载更小，并使页面元数据可缓存，从而当站点中有很多页面时可以减少服务器带宽
  metaChunk: true,
  markdown: {
    // 开启行号
    lineNumbers: true,
    image: {
      // 默认禁用；设置为 true 可为所有图片启用懒加载。
      lazyLoading: true,
    },
    // 更改容器默认值标题
    container: {
      tipLabel: "提示",
      warningLabel: "警告",
      dangerLabel: "危险",
      infoLabel: "信息",
      detailsLabel: "详细信息",
    },
  },
  themeConfig: {
    logo: '/logo.svg',
    search: {
      // 用浏览器内索引进行模糊全文搜索
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换'
                }
              }
            }
          }
        }
      }
    },
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },
    outline: {
      level: [2, 4],
      label: "本页导航",
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
    socialLinks: SocialLinks, // 社交链接配置
    //sidebar: [],
    footer: {
/*      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025-present Evan You'*/
    }

  },
  vite: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './'),
        '@components': path.resolve(__dirname, './theme/components/') // 将 @ 指向 components 目录
      }
    },
    build: {
      chunkSizeWarningLimit: 1500, // 限制警告的块大小
      assetsInlineLimit: 4096, // 小于 4KB 的字体转为 base64
      minify: 'terser', // 使用 Terser 进行代码压缩 或 'esbuild'
      terserOptions: {
        compress: {
          drop_console: false, // 移除所有 console.* 调用（生产环境建议开启）
          drop_debugger: true, // 移除 debugger 语句（生产环境必备）
          pure_funcs: ["console.info"], // 保留 console.info 调用（白名单机制）
          dead_code: true, // 移除不可达代码（消除死代码）
          arrows: true, // 将 function 转换为箭头函数（优化代码体积）
          unused: true, // 移除未使用的变量/函数（需确保不影响程序逻辑）
          join_vars: true, // 合并连续 var 声明（优化作用域）
          collapse_vars: true, // 内联单次使用的变量（体积优化）
        },
        format: {
          comments: false, // 移除所有注释（保留版权声明需使用正则表达式）
          beautify: false, // 禁用代码美化（进一步减小体积）
          preamble: "/* 项目版本 1.0.0 */", // 文件头部添加版权声明（需遵守 MIT 协议）
        },
        mangle: {
          toplevel: true, // 混淆顶级作用域变量名（保留 class/function 名称）
          properties: false, // 保留对象属性名（防止破坏 DOM 属性绑定）
        },
      },
      rollupOptions: {
/*        external: (id) => {
          // 调试日志：输出匹配的文件路径
          const isOriginalMusic = /^.*public[/\\]music[/\\](?!compressed[/\\]).*\.(mp3|wav|flac)$/i.test(id);
          if (isOriginalMusic) {
            console.log(`忽略原始音频文件: ${id}`);
          }
          return isOriginalMusic
        },*/
      }
    },
    ssr: {
      // 标记 APlayer 为外部依赖，不在 SSR 中处理
      external: []
    },
    plugins: plugings
  },
  setup() {
    console.log("setup")
/*    // 监听路由变化，显示进度条
    const router = useRouter()

    router.onBeforeRouteChange(() => {
      console.log("onBeforeRouteChange")
      nprogress.start()
    })

    router.onAfterRouteChange(() => {
      console.log("onAfterRouteChange")
      nprogress.done()
    })*/
  }
})
