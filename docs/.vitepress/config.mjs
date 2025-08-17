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
import { plugins } from "./plugins.mjs"; // 插件
import rewritesJson from "./rewrites.json";
import {VitePluginVitePressRewrites} from "../../plugs/vitepress-plugin-test/index.js";
import {genSidebar} from "vitepress-plugin-sidebar-permalink/sidebar";
import {FriendLink} from "./config/FriendLink";
import {SocialDate} from "./config/SocialDate";
import {FooterGroup} from "./config/FooterGroup";
import {FooterInfo} from "./config/FooterInfo"; // 插件

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
  teekHome: true,
  // 原vitePress风格主页，文档类
  vpHome: false,
  backTopDone: TkMessage => TkMessage.success("返回顶部"),
  windowTransition: true,
  /*windowTransition: {
    // 是否开启首页文章列表过渡效果
    post: true,
    // 是否开启首页卡片列表过渡效果
    card: true,
    // 是否开启归档页过渡效果
    archives: true,
    // 是否开启 Feature 过渡效果
    feature: true
  },*/
  author: {
    name: "威威", // 作者名称
    //link: "https://github.com/Kele-Bingtang",
  },
  blogger: {
    // 博主信息，显示在首页侧边栏
    avatar: "/avatar/avatar.webp",
    shape: "circle", // 头像风格：square 为方形头像，circle 为圆形头像，circle-rotate 可支持鼠标悬停旋转
    name: "威威",
    slogan: "人心中的成见是一座大山~",
    circleBgImg: "/avatar/avatarBg.webp", // 头像圆形背景图
  },
  toComment: {
    enabled: true, // 是否启动滚动到评论区功能
    done: TkMessage => TkMessage.success("已抵达评论区"), // 滚动到评论区后的回调
  },
  // 如果想重写侧边栏展开/折叠触发器组件，则使用 teek-sidebar-trigger 插槽。
  sidebarTrigger: true,
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
  category: {
    path: "/categories",
  },
  tag: {
    path: "/tags",
  },
  archive: {
    path: "/archives",
  },
  page: {
    pageSize: 15,
  },
  post: {
    postStyle: "list", // card 和 list 文章列表风格
    excerptPosition: "top", // 文章摘要位置
    showMore: true, // 是否显示更多按钮
    moreLabel: "阅读全文 >", // 更多按钮文字
    coverImgMode: "default", // 文章封面图模式
    showCapture: false, // 是否在摘要位置显示文章部分文字，当为 true 且不使用 frontmatter.describe 和 <!-- more --> 时，会自动截取前 300 个字符作为摘要
  },
  topArticle: {
    enabled: true, // 是否启用精选文章卡片
    limit: 5, // 一页显示的数量
    autoPage: false, // 是否自动翻页
    pageSpeed: 4000, // 翻页间隔时间，单位：毫秒。autoPage 为 true 时生效
    dateFormat: "yyyy-MM-dd hh:mm:ss", // 精选文章的日期格式
  },
  friendLink: FriendLink, // 友链配置
  social: SocialDate, //社交信息配置
  footerGroup: FooterGroup,
  footerInfo: FooterInfo,
  // 站点信息卡片配置
  docAnalysis: {
    enabled: true,
    createTime: "2021-10-19",
    wordCount: true,
    readingTime: true,
    statistics: {
      provider: "", // busuanzi
      siteView: true,
      pageView: true,
    },
    overrideInfo: [
      {
        key: "lastActiveTime",
        label: "活跃时间",
        value: (originValue, currentValue) => {
          return currentValue
        },
        show: true,
      },
      {
        // 本站被访问了
        key: 'viewCount', show: false,
        value: (originValue, currentValue) => {
          //console.log("viewCount", originValue, currentValue)
          return currentValue
        },
      },
      {
        // 本站曾来访过
        key: 'visitCount', show: false,
        value: (originValue, currentValue) => {
          //console.log("visitCount", originValue, currentValue)
          return currentValue
        },
      },
      {key: 'viewCountUnit', show: true}, // 次
      {key: 'visitCountUnit', show: true}, // 人
      // 运行时间
      {
        key: 'runtime', show: true,
        value: (originValue, currentValue) => {
          // 示例使用
          const previousDateStr = '2025-06-15';
          // 解析输入的日期字符串（格式：YYYY-MM-DD）
          const [year, month, day] = previousDateStr.split('-').map(Number);
          // 创建日期对象（注意：月份从 0 开始，所以要减 1）
          const previousDate = new Date(year, month - 1, day);
          // 获取今天的日期（忽略时间部分）
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          // 设置 previousDate 的时间为 00:00:00，确保只比较日期
          previousDate.setHours(0, 0, 0, 0);
          // 计算时间差（毫秒）
          const timeDiff = today.getTime() - previousDate.getTime();
          // 转换为天数（1 天 = 24 * 60 * 60 * 1000 毫秒）
          const daysDifference = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
          return daysDifference + "天";
        }
      },

    ],
    //appendInfo: [{ key: "index", label: "序号", value: "天客 99" }],
  },
  articleShare: {
    enabled: true, // 是否开启文章链接分享功能
    text: "分享此页面", // 分享按钮文本
    copiedText: "链接已复制", // 复制成功文本
    query: false, // 是否包含查询参数
    hash: false, // 是否包含哈希值
  },
  articleBottomTip: () => {
    return {
      type: "tip",
      // title: "声明",
      text: `<p>作者：威威</p>
             <p>版权：此文章版权归 威威 所有，如有转载，请注明出处!</p>
             <p style="margin-bottom: 0">链接：可点击右上角分享此页面复制文章链接</p>
            `,
    };
  },
  articleUpdate: {
    enabled: true, // 是否启用文章最近更新栏
    limit: 3, // 文章最近更新栏显示数量
  },
  // 新版代码块配置
  codeBlock: {
    disabled: false, // 是否禁用新版代码块
    collapseHeight: 700, // 超出高度后自动折叠，设置 true 则默认折叠，false 则默认不折叠
    overlay: true, // 代码块底部是否显示展开/折叠遮罩层
    overlayHeight: 400, // 当出现遮罩层时，指定代码块显示高度，当 overlay 为 true 时生效
    copiedDone: (TkMessage) => TkMessage.success("代码已复制 🎉"),
  },
  vitePlugins: {
    permalink: true, // 是否开启永久链接
    sidebar: true, // 是否开启侧边栏
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

/*// 生成侧边栏，先引入插件生成rewritesJson再写下列代码
const sidebarOptions = { collapsed: true }
const sidebar = genSidebar(navLinks, 'docs/articles', rewritesJson.rewrites, sidebarOptions) //'docs/articles'为md文件所在目录
console.log("sidebar", sidebar)*/

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
  //rewrites: rewritesJson.rewrites, // 路由重写
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
    //sidebar: sidebar,
    socialLinks: SocialLinks, // 社交链接配置
    //sidebar: [],
    footer: {
/*      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025-present Evan You'*/
    }
  },
  vue: {
    template: {
      compilerOptions: {
        // 将 swiper- 开头的标签视为自定义元素（Web Components）
        isCustomElement: (tag) => tag.startsWith('swiper-')
      }
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
    plugins: plugins
  }
})
