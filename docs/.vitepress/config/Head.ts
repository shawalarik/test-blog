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

export const Head: HeadConfig[] = [
  ["link", { rel: "icon", href: "/favicon.ico" }],
  ["meta", { name: "author", content: "威威" }],
  [
    "meta",
    {
      name: "viewport",
      content: "width=device-width,initial-scale=1,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no"
    }
  ],
  [
    "meta",
    {
      name: "description",
      description
    }
  ],
  ["meta", { name: "keywords", description }],
  // umami统计
  [
    "script",
    {
      src: "https://umami.dl-web.top/script.js",
      "data-website-id": "0b67009b-c85f-400f-b4f7-a2db22ee9698"
    }
  ],
  /*    // jquery
    [
        "script",
        {
            src: "https://myhkw.cn/player/js/jquery.min.js",
        },
    ],
    // 音乐
    [
        "script",
        {
            src: "https://myhkw.cn/api/player/1752767006160",
            id: "myhk",
            key: "1752767006160",
            m: "1"
        },
    ],*/

  /*    // 阿里在线矢量库
    [
        "link",
        {
            rel: "stylesheet",
            href: "//at.alicdn.com/t/font_2989306_w303erbip9.css",
        },
    ],
    [
        // 阿里图标库symbol 引用
        "script",
        {
            src: "https://at.alicdn.com/t/c/font_4899452_xj7acblxpxj.js",
            media: "print",
            onload: "this.media='all'",
        },
    ],*/
  ["noscript", {}, noScripTemplate] // 禁用js跳转
];
