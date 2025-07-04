import { defineConfig } from 'vitepress'
// @ts-ignore
import { defineTeekConfig } from "vitepress-theme-teek/config";
import { Nav } from "./config/Nav"; // 导入Nav模块
//import {teekConfig} from "./config/TeekConfig";
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
} from "vitepress-plugin-group-icons"; // 导入代码组图标插件
import { visualizer } from "rollup-plugin-visualizer"; // 导入可视化分析插件
//import viteImagemin from "vite-plugin-imagemin"; // 导入图片压缩插件
import compress from 'vite-plugin-compression';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { scanMusicPlugin } from '../../plugs/scan-music.mjs';
import { cleanDistMusic } from "../../plugs/clean-dist.mjs";
import { Wallpaper } from "./config/Wallpaper.js";
import AutoFrontmatter from "vitepress-plugin-auto-frontmatter";

// 是否为开发模式
const isDev = process.argv.includes('dev');

if (isDev) {
  console.log('正在以开发模式运行');
} else {
  console.log('正在构建生产版本');
}

const teekConfig = defineTeekConfig({
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
  lang: 'en-US',
  outDir: '../dist',
  title: "威威 Blog",
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
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
/*      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025-present Evan You'*/
    }

  },
  vite: {
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
    plugins: [
      AutoFrontmatter({
        pattern: "**/*.md",
          // exclude 指定的对象如果在 markdown frontmatter 存在，则忽略该文件。当 include 和 exclude 存在相同文件时，exclude 优先级高
          //exclude: { coverImg: true},
          // 每次启动项目时，是否基于 transform 返回的数据重新生成新的 frontmatter，如果为 false，则只对不存在的 key 进行生成，如果为 true，则重新生成新的 frontmatter
          recoverTransform: false,
          transform: (frontmatter) => {
            // 如果文件本身存在了 coverImg，则不生成
            if (frontmatter.coverImg) return; // 随机获取 coverImg

            console.log("frontmatter", frontmatter)

            const list = Wallpaper;

            const coverImg = list[Math.floor(Math.random() * list.length)];

            const transformResult = { ...frontmatter, coverImg };

            return Object.keys(transformResult).length
                ? transformResult
                : undefined;
          },
        }),
      cleanDistMusic(),
      groupIconVitePlugin(), //代码组图标
      visualizer({
        filename: "stats.html",
        open: false, // 打包后自动打开报告
        gzipSize: true, // 压缩大小
        brotliSize: true,
      }),
      compress({
        verbose: false, // 是否在控制台输出压缩结果
        disable: false, // 是否禁用压缩
        threshold: 10240, // 文件大小超过此值时进行压缩，单位为字节
        algorithm: 'gzip', // 压缩算法，可选 'gzip' 或 'brotli'
        ext: '.gz', // 压缩后的文件扩展名
      }),
      ViteImageOptimizer({
        // 基础图片优化配置
        png: {
          quality: 20,
        },
        jpg: {
          quality: 20,
          progressive: true // 启用渐进式加载
        },
        jpeg: {
          quality: 20,
          progressive: true // 启用渐进式加载
        },
        webp: {
          quality: 20,
          //lossless: true // 无损压缩模式
        },
        svg: {
          multipass: true,
        },
        // 构建控制配置
        //include: ['src/assets/images/**/*'], // 只优化指定目录
        //exclude: ['src/assets/images/ignore/*.png'], // 排除特定文件
      }),
      scanMusicPlugin({
        musicDir: 'music', // 音乐文件存放目录
        //outputFile: '' // 输出数据文件路径
      })
      /*viteImagemin({
        gifsicle: {
          interlaced: true, // 隔行扫描
          optimizationLevel: 3, // 压缩级别（0-3）
        },
        optipng: {
          optimizationLevel: 5, // 压缩级别（0-7），值越大压缩率越高
        },
        mozjpeg: {
          quality: 80, // 压缩质量（0-100）
          progressive: true, // 渐进式加载
          smooth: 2, // 平滑处理，减少色彩失真
        },
        svgo: {
          plugins: [
            { name: 'removeViewBox', active: false }, // 保留 viewBox 以防止 SVG 变形
            { name: 'removeEmptyAttrs', active: true }, // 移除空属性
            { name: 'convertColors', params: { currentColor: true } }, // 颜色转换
          ]
        },
        webp: {
          quality: 80, // WebP 质量（0-100）
          lossless: false, // 是否无损压缩
          method: 6, // 压缩方法（0-6），数值越大，压缩率越高但速度变慢
        },
        pngquant: {
          quality: [0.8, 0.9], // PNG 质量范围
          speed: 4, // 压缩速度（1-10），数值越大速度越快但压缩率降低
        },
        disable: true, // 仅在生产环境启用
        /!** 是否在控制台输出压缩结果 *!/
        verbose: true,
      })*/
    ],
  },
})
