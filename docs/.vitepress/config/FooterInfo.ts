// 底部信息配置
import { version } from "vitepress-theme-teek/es/version"; // 导入版本号

export const FooterInfo = {
    // 页脚信息，支持 HTML 格式（位于主题版权上方）
    //topMessage: ["下面的内容和图标都可以修改（本条内容也可以隐藏的）"],
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
