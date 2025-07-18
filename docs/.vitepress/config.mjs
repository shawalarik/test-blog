import path from "path";
import {defineConfig, loadEnv} from 'vitepress'
import { defineTeekConfig } from "vitepress-theme-teek/config";
//import {teekConfig} from "./config/TeekConfig";
import { Head } from "./config/Head"; // 导入页面head配置
import { Nav } from "./config/Nav"; // 导入Nav模块
import { Comment } from "./config/Comment"; // 导入Nav模块
import { SocialLinks } from "./config/SocialLinks.js";
import {generateEnvDefines} from "./theme/utils/WwUtils.js"; // 工具类
import config from "./env.mjs"; // 全局变量
import { plugings } from "./plugins.mjs"; // 插件

// 是否为开发模式
const isDev = process.argv.includes('dev');
const isProd = process.argv.includes('build')

if (isDev) {
  console.log('正在以开发模式运行');
} else {
  console.log('正在构建生产版本');
}

// 首次启动时，process.env.NODE_ENV为空，手动设置为开发模式，生成模式无此问题
if (process.env.NODE_ENV === undefined){
  process.env.NODE_ENV = 'development'
}
console.log("process.env.NODE_ENV", process.env.NODE_ENV)

/*// 加载环境变量（第一个参数为模式，第二个参数为环境变量文件所在目录）
const env = loadEnv(
    process.argv.includes('build') ? 'production' : 'development',
    process.cwd()
)
console.log('env:', env)*/

const teekConfig = defineTeekConfig({
  comment: Comment,
  notice: {
    enabled: true, // 是否启用公告功能
    title: "公告", // 公告标题，支持函数式：需要和国际化搭配使用，根据不同语言环境返回不同标题
    initOpen: false,
    duration: 0, // 弹框定时自动关闭，0 不自动消失
    mobileMinify: false, // 移动端自动最小化
    reopen: true, // 关闭公告弹框后，是否支持重新打开，如果为 false，则代表公告只显示一次
    useStorage: false, // 是是否使用 localStorage 存储公告状态，如：当打开公告弹框后，下次进来则自动打开弹框
    twinkle: false, // 公告图标是否打开闪烁提示
    position: "top", // 公告弹框出现位置
  },
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
      tipLabel: '提示',
      warningLabel: '警告',
      dangerLabel: '危险',
      infoLabel: '信息',
      detailsLabel: '详细信息'
    }
  },
  themeConfig: {
    logo: '/avatar/avatar.svg',
    darkModeSwitchLabel: "主题",
    sidebarMenuLabel: "菜单",
    returnToTopLabel: "返回顶部",
    lastUpdatedText: "上次更新时间",
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
    define: {
      __VUE_PROD_DEVTOOLS__: isDev,
      ...generateEnvDefines(config[process.env.NODE_ENV]) // 自动注入全局变量
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './'),
        '@components': path.resolve(__dirname, './theme/components/') // 将 @ 指向 components 目录
      }
    },
    build: {
      // 生成 sourcemap 方便定位压缩后的代码
      //sourcemap: true,
      chunkSizeWarningLimit: 1500, // 限制警告的块大小
      assetsInlineLimit: 4096, // 小于 4KB 的字体转为 base64
      minify: 'terser', // 使用 Terser 进行代码压缩 或 'esbuild'
      terserOptions: {
        compress: {
          drop_console: false, // 关闭“一刀切”删除所有 console
          drop_debugger: true, // 保留移除 debugger 的配置
          // 明确指定要移除的 console 方法（排除 info）
          pure_funcs: [
            'console.log',
            'console.warn',
            'console.error',
            'console.debug',
            'console.trace'
          ],
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
        output: {
          manualChunks: (id) => {
            //console.log("id", id)
            // 排除可能导致问题的主题库和核心依赖
            const excludePkgs = [
              'vitepress-theme-teek', // 主题库，避免拆分
              'vue',
              'vue-router',    // Vue 核心库，建议整体打包
              'vitepress'             // VitePress 核心，避免拆分
            ];

            if (id.includes('node_modules')) {
              const pkg = id.split('node_modules/')[1].split('/')[0];
              // 如果是需要排除的库，不单独分块（使用默认策略）
              if (excludePkgs.includes(pkg)) {
                return undefined; // 让 Rollup 按默认方式处理
              }
              // 其他库正常拆分
              return `vendor/${pkg}`;
            }
          },
        },
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
  }
})
