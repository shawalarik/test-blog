// 卡片栏社交信息
import { Social } from "vitepress-theme-teek/es/config/interface/social.js";
import { gitee, email, WhatsApp, telegram } from "../theme/icon/icons";

export const SocialDate: Social[] = [
    {
        name: "Gitee",
        icon: gitee, // 本地 SVG 文件路径（public 目录下）
        iconType: "component",     // 指定为图片类型
        link: "https://gitee.com/dlwwei",
    },
    {
        name: "邮件",
        icon: email, // 本地 SVG 文件路径（public 目录下）
        iconType: "component",
        link: "",
    },
    {
        name: "微信",
        icon: WhatsApp, // 本地 SVG 文件路径（public 目录下）
        iconType: "component",     // 指定为图片类型
        link: "http://wpa.qq.com/msgrd?v=3&uin=2458697735&site=qq&menu=yes",
    },
];
