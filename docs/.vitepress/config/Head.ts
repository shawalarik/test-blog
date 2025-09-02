import { HeadConfig } from "vitepress/types/shared";

const description = [
  "欢迎来到 vitepress-theme-teek 使用文档",
  "Teek 是一个基于 VitePress 构建的主题，是在默认主题的基础上进行拓展，支持 VitePress 的所有功能、配置",
  "Teek 拥有三种典型的知识管理形态：结构化、碎片化、体系化，可以轻松构建一个结构化知识库，适用个人博客、文档站、知识库等场景"
].toString();

const noScripTemplate = `
<div style="text-align: center;">
    <h3>JavaScript 已禁用</h3>
    <p>为了获得更好的体验，请启用JavaScript，或点击下方链接跳转：</p>
    <a href="https://www.baidu.com/" style="display: inline-block; margin-top: 10px; padding: 8px 16px; background-color: #4285f4; color: white; text-decoration: none; border-radius: 4px;">
      跳转至百度
    </a>
  </div>
`;

const share: HeadConfig[] = [
  // 页面标题（分享时显示的标题）
  ["meta", { property: "og:title", content: "威威 Blog" }],
  // 页面类型（网站类型，如 article、website）
  ["meta", { property: "og:type", content: "website" }],
  // 页面 URL（分享的原始链接，建议使用绝对地址）
  ["meta", { property: "og:url", content: "https://dl-web.top" }],
  // 描述信息（已配置，可保留）
  ["meta", { property: "og:description", content: "个人博客，全栈分享" }],
  // 分享图片（已配置，建议图片尺寸为 1200x630px，提升展示效果）
  ["meta", { property: "og:image", content: "https://dl-web.top/avatar/avatar.webp" }],
  // 图片备选尺寸（可选，帮助平台识别图片）
  ["meta", { property: "og:image:width", content: "1200" }],
  ["meta", { property: "og:image:height", content: "630" }],
  // 网站名称（分享时显示的站点名称）
  ["meta", { property: "og:site_name", content: "博客" }]
];

const weChatShare: HeadConfig[] = [
  // 微信分享标题（优先级高于 og:title）
  ["meta", { name: "wechat-share-title", content: "威威 Blog" }],
  // 微信分享描述（优先级高于 og:description）
  ["meta", { name: "wechat-share-desc", content: "个人博客，全栈分享" }],
  // 微信分享图片（优先级高于 og:image）
  ["meta", { name: "wechat-share-img", content: "https://dl-web.top/avatar/avatar.webp" }]
];

const music = [
  ["link", { rel: "preconnect", href: "https://myhkw.cn" }],
  // jquery
  [
    "script",
    {
      src: "https://myhkw.cn/player/js/jquery.min.js"
    }
  ],
  // 音乐
  [
    "script",
    {
      src: "https://myhkw.cn/api/player/1752767006160",
      id: "myhk",
      key: "1752767006160",
      m: "1"
    }
  ]
];

const icon = [
  ["link", { rel: "preload", href: "https://at.alicdn.com/t/c/font_4899452_xj7acblxpxj.js", as: "script" }],
  // 阿里在线矢量库
  [
    "link",
    {
      rel: "stylesheet",
      href: "//at.alicdn.com/t/font_2989306_w303erbip9.css"
    }
  ],
  [
    // 阿里图标库symbol 引用
    "script",
    {
      src: "https://at.alicdn.com/t/c/font_4899452_xj7acblxpxj.js",
      media: "print",
      onload: "this.media='all'"
    }
  ]
];

export const Head: HeadConfig[] = [
  // 资源预加载
  ["link", { rel: "preload", href: "/favicon.ico", as: "image/x-icon" }],
  // 图标
  ["link", { rel: "icon", href: "/favicon.ico" }],
  // 作者信息
  ["meta", { name: "author", content: "威威" }],
  // 版权声明
  ["meta", { name: "copyright", content: "© 2025 威威 Blog. All Rights Reserved." }],
  // 规范网址，告诉搜索引擎站点的首选域名
  ["link", { rel: "canonical", href: "https://dl-web.top" }],
  // Android 添加到主屏幕
  ["meta", { name: "application-name", content: "威威 Blog" }],
  // 站点的索引策略，index:允许索引；follow:允许跟踪链接
  ["meta", { name: "robots", content: "index, follow" }],
  // 移动设备适配声明，向搜索引擎明确站点对移动设备友好
  ["meta", { name: "mobile-agent", content: "format=html5; url=https://dl-web.top" }],
  // 防点击劫持，禁止其他网站通过 iframe 嵌入你的站点
  ["meta", { httpEquiv: "X-Frame-Options", content: "DENY" }],
  // 防 MIME 类型嗅探，阻止浏览器猜测资源类型，避免恶意文件执行
  ["meta", { httpEquiv: "X-Content-Type-Options", content: "nosniff" }],
  // 引荐来源策略
  ["meta", { name: "referrer", content: "strict-origin-when-cross-origin" }],
  // 声明适配深色模式
  ["meta", { name: "color-scheme", content: "light dark" }],
  // 站点语言
  ["meta", { httpEquiv: "Content-Language", content: "zh-CN" }],
  [
    "meta",
    {
      name: "viewport",
      content: "width=device-width,initial-scale=1,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no"
    }
  ],
  ["meta", { name: "description", description }],
  ["meta", { name: "keywords", description }],
  ["meta", { name: "baidu-site-verification", content: "codeva-WuvZdxzMaM" }],
  // umami统计
  [
    "script",
    {
      src: "https://umami.dl-web.top/script.js",
      "data-website-id": "0b67009b-c85f-400f-b4f7-a2db22ee9698"
    }
  ],
  ...share,
  ...weChatShare,
  ["noscript", {}, noScripTemplate], // 禁用js跳转
  [
    "script",
    { type: "application/ld+json" },
    JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "威威 Blog",
      url: "https://dl-web.top",
      author: {
        "@type": "Person",
        name: "威威"
      },
      keywords: ["博客", "前端", "后端", "vitepress"],
      description: "个人博客，全栈分享",
      image: "https://dl-web.top/avatar/avatar.webp",
      publisher: {
        "@type": "Person",
        name: "威威"
      }
    })
  ]
];
