import { defineConfig } from 'vitepress'
import { defineTeekConfig } from "vitepress-theme-teek/config";
import { Nav } from "./config/Nav.js"; // 导入Nav模块
import {teekConfig} from "./config/teekConfig.js";
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
} from "vitepress-plugin-group-icons"; // 导入代码组图标插件
import { visualizer } from "rollup-plugin-visualizer"; // 导入可视化分析插件
//import viteImagemin from "vite-plugin-imagemin"; // 导入图片压缩插件
import compress from 'vite-plugin-compression';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { scanMusicPlugin } from '../../plugs/scan-music.mjs';
import {cleanDistMusic} from "../../plugs/clean-dist.js";


// 是否为开发模式
const isDev = process.argv.includes('dev');

if (isDev) {
  console.log('正在以开发模式运行');
} else {
  console.log('正在构建生产版本');
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // Teek 主题配置
  extends: teekConfig,
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
  themeConfig: {
    logo: '/logo.svg',
    search: {
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
    build: {
      minify: 'terser', // 或 'esbuild'
      terserOptions: {
        compress: {
          dead_code: true, // 移除死代码
          //drop_console: true, // 移除 console
          //drop_debugger: true // 移除 debugger
        }
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
        name: 'vite-plugin-image-optimizer', // 明确指定插件名称
        // 基础图片优化配置
        png: {
          quality: 20,
          interlaced: true // 启用隔行扫描
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
        enabled: true, // 仅生产环境启用
        //include: ['src/assets/images/**/*'], // 只优化指定目录
        //exclude: ['src/assets/images/ignore/*.png'], // 排除特定文件
        verbose: true // 关闭详细日志
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
