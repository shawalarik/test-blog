import {groupIconMdPlugin, groupIconVitePlugin} from "vitepress-plugin-group-icons"; // 导入代码组图标插件
import { visualizer } from "rollup-plugin-visualizer"; // 导入可视化分析插件
//import viteImagemin from "vite-plugin-imagemin"; // 导入图片压缩插件
import compress from 'vite-plugin-compression';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { scanMusicPlugin } from '../../plugs/scan-music.mjs';
import AutoFrontmatter, {FileInfo} from "vitepress-plugin-auto-frontmatter";
import {cleanDistMusic} from "../../plugs/clean-dist.mjs";
import inspect from 'vite-plugin-inspect'

// 检查是否有 --inspect 参数
const isEnableInspectPluging = false

export const plugins =  [
    groupIconVitePlugin(), //代码组图标
/*    AutoFrontmatter({
        pattern: "**!/!*.md",
        // exclude 指定的对象如果在 markdown frontmatter 存在，则忽略该文件。当 include 和 exclude 存在相同文件时，exclude 优先级高
        exclude: { coverImg: true},
        recoverTransform: true, // false 只添加不存在的字段
        // 返回一个新的 frontmatter 或只返回 undefined，如果返回 {}，则清空 MD 文件本身存在的 frontmatter
        transform: (frontMatter: Record<string, any>, fileInfo: FileInfo) => {
            return frontMatter;
        },
    }),*/
    cleanDistMusic(),
/*    visualizer({
        filename: "stats.html",
        open: false, // 打包后自动打开报告
        gzipSize: true, // 压缩大小
        brotliSize: true,
    }),*/
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
        showDetail: false, // 是否展示音频数据信息，默认为 false
        musicDir: 'music', // 音乐文件存放目录
        //outputFile: '' // 输出数据文件路径
    }),
    isEnableInspectPluging && inspect({
        // 基础配置
        enabled: false, // 是否启用插件，可用于条件开启
        build: false,   // 构建时是否启用
        // 路径配置
        outputDir: '.', // 输出目录
    }),
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
]
