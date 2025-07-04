const description = [
    "欢迎来到 vitepress-theme-teek 使用文档",
    "Teek 是一个基于 VitePress 构建的主题，是在默认主题的基础上进行拓展，支持 VitePress 的所有功能、配置",
    "Teek 拥有三种典型的知识管理形态：结构化、碎片化、体系化，可以轻松构建一个结构化知识库，适用个人博客、文档站、知识库等场景",
].toString();

const noScripTemplate = `
<div style="text-align: center;">
    <h3>JavaScript 已禁用</h3>
    <p>为了获得更好的体验，请启用JavaScript，或点击下方链接跳转：</p>
    <a href="https://www.baidu.com/" style="display: inline-block; margin-top: 10px; padding: 8px 16px; background-color: #4285f4; color: white; text-decoration: none; border-radius: 4px;">
      跳转至百度
    </a>
  </div>
`

export const Head =[
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    // umami统计
    [
        "script",
        {
            src: "https://umami.seasir.top/script.js",
            "data-website-id": "baf9cac2-151d-4f1e-80ff-c7603df9792a",
            defer: "defer",
        },
    ],
    ["meta", { name: "author", content: "威威" }],
    [
        "meta",
        {
            name: "viewport",
            content:
                "width=device-width,initial-scale=1,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no",
        },
    ],
    [
        "meta",
        {
            name: "description",
            description,
        },
    ],
    ["meta", { name: "keywords", description }],
    [
        "noscript",
        {},
        noScripTemplate
    ], // 禁用js跳转
]
