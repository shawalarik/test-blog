// 底部信息配置
import { version } from "vitepress-theme-teek/es/version"; // 导入版本号

// https://img.shields.io 查找svg
export const FooterInfo = {
    // 页脚信息，支持 HTML 格式（位于主题版权上方）
    topMessage: [
        `<span><img alt="VitePress" src="/footer/Animals.png" style="max-width: 80vw;"><span/>`,
        `
    <a target="_blank" href="https://vitepress.dev/" title="本站框架基于 VitePress${version}" ><img alt="VitePress" src="/footer/vitepress.svg" ></a>
    <!--<a target="_blank" href="https://twikoo.js.org/" title="本站评论系统使用 Twikoo" ><img alt="Twikoo" src="/footer/Twikoo.svg"></a>-->
    <a target="_blank" href="http://creativecommons.org/licenses/by-nc-sa/4.0/" title="本站内容采用 CC BY-NC-SA 4.0 国际许可协议进行许可"><img alt="Copyright" src="/footer/Copyright-BY--NC--SA%204.svg"></a>
    <!--<a target="_blank" href="https://www.algolia.com/" title="本站搜索服务使用 Algolia"><img alt="Algolia" src="/footer/Animals.png"></a>-->
    <a target="_blank" href="https://www.aliyun.com/" title="本站部署服务使用 Aliyun"><img alt="Aliyun" src="/footer/Alibaba-Cloud.svg"></a>
    <!--<a target="_blank" href="https://umami.is/" title="本站统计服务使用 Umami"><img alt="Umami" src="/footer/Umami.svg"></a>-->
    <a target="_blank" href="https://nginx.org/" title="本站反向代理使用 Nginx"><img alt="Nginx" src="/footer/Nginx.svg"></a>`,
    ],
    // 页脚信息，支持 HTML 格式（位于主题版权下方）
    //bottomMessage: ["上面的内容和图标都可以修改（本条内容也可以隐藏的）"],
    // 主题版权配置
    theme: {
        show: true, // 是否显示主题版权，建议显示
        name: `Theme By Teek@${version}`,
        link: "", // 自定义链接
    },
    // 博客版权配置
    copyright: {
        show: true, // 是否显示博客版权
        createYear: 2025, // 创建年份
        suffix: "威威 Blog", // 后缀
    },
    // ICP 备案信息配置
    icpRecord: {
        name: "",
        link: "",
    },
    // 网络安全备案信息配置
    securityRecord: {
        name: "",
        link: "",
    },
}
