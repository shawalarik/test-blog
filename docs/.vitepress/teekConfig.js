import { defineTeekConfig } from "vitepress-theme-teek/config";

// 首页壁纸
const wallpaper = [
  "/home/bg1.webp",
  "/home/bg2.webp",
  "/home/bg3.webp",
  "/home/bg4.webp",
  "/home/bg5.webp",
  "/home/bg6.webp",
  "/home/bg7.webp",
  "/home/bg8.webp",
  "/home/bg9.webp",
  "/home/bg10.webp",
  "/home/bg11.webp",
  "/home/bg12.webp",
  "/home/bg13.webp",
  "/home/bg14.webp",
  "/home/bg15.webp",
  "/home/bg16.webp",
  "/home/bg17.webp",
  "/home/bg18.webp",
  "/home/bg19.webp",
  "/home/bg20.webp",
  "/home/bg21.webp",
  "/home/bg22.webp",
  "/home/bg23.webp",
  "/home/bg24.webp",
  "/home/bg25.webp",
  "/home/bg26.webp",
  "/home/bg27.webp",
  "/home/bg28.webp",
  "/home/bg29.webp",
  "/home/bg30.webp",
  "/home/bg31.webp",
];

const typewriter = [
  "愿每个人都有属于自己的一片星空",
  "书以启智 技于谋生",
  "有一份热，发一份光",
  "就令萤火一般",
  "也可以在黑暗里发一点光",
  "不必等候炬火",
  "此后如竟没有炬火",
  "我便是唯一的光",
]

// Teek 主题配置
export const teekConfig = defineTeekConfig({
  banner: {
    enabled: true,
    //features: [], //用于在首页展示一些功能介绍,也就是首页三个功能块
    //name: "", // Banner 标题，默认读取 vitepress 的 title 属性
    //name: "Teek", // Banner 标题，默认读取 vitepress 的 title 属性
    bgStyle: "fullImg", // Banner 背景风格：pure 为纯色背景，partImg 为局部图片背景，fullImg 为全屏图片背景
    //pureBgColor: "#28282d", // Banner 背景色，bgStyle 为 pure 时生效
    imgSrc: wallpaper, // Banner 图片链接。bgStyle 为 partImg 或 fullImg 时生效
    imgInterval: 15000, // 当多张图片时（imgSrc 为数组），设置切换时间，单位：毫秒
    imgShuffle: false, // 图片是否随机切换，为 false 时按顺序切换，bgStyle 为 partImg 或 fullImg 时生效
    imgWaves: true, // 是否开启 Banner 图片波浪纹，bgStyle 为 fullImg 时生效
    mask: true, // Banner 图片遮罩，bgStyle 为 partImg 或 fullImg 时生效
    maskBg: "rgba(0, 0, 0, 0.3)",// slategray
    //maskBg: "rgba(0, 0, 0, 0.4)", // Banner 遮罩颜色，如果为数字，则是 rgba(0, 0, 0, ${maskBg})，如果为字符串，则作为背景色。bgStyle 为 partImg 或 fullImg 且 mask 为 true 时生效
    textColor: "#ffffff", // Banner 字体颜色，bgStyle 为 pure 时为 '#000000'，其他为 '#ffffff'
    titleFontSize: "3.2rem", // 标题字体大小
    descFontSize: "1.4rem", // 描述字体大小
    descStyle: "types", // 描述信息风格：default 为纯文字渲染风格（如果 description 为数组，则取第一个），types 为文字打印风格，switch 为文字切换风格
    description: typewriter, // 描述信息
    switchTime: 4000, // 描述信息切换间隔时间，单位：毫秒。descStyle 为 switch 时生效
    switchShuffle: false, // 描述信息是否随机切换，为 false 时按顺序切换。descStyle 为 switch 时生效
    typesInTime: 200, // 输出一个文字的时间，单位：毫秒。descStyle 为 types 时生效
    typesOutTime: 100, // 删除一个文字的时间，单位：毫秒。descStyle 为 types 时生效
    typesNextTime: 800, // 打字与删字的间隔时间，单位：毫秒。descStyle 为 types 时生效
    typesShuffle: false, // 描述信息是否随机打字，为 false 时按顺序打字，descStyle 为 types 时生效
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
  // 首页顶部按 F11 开启壁纸模式
  wallpaper: {
    enabled: true, // 是否启用壁纸模式
    hideBanner: false, // 开启壁纸模式后，全屏是否显示打字机文案，
    hideMask: true, // 开启壁纸模式后，是否隐藏 Banner 或 bodyBgImage 的遮罩层，则确保 banner.mask 和 bodyBgImage.mask 为 true 才生效
    hideWaves: false, // 开启壁纸模式后，是否隐藏 Banner 波浪组件，仅 banner.bgStyle = 'fullImg' 生效
  },
});

export default teekConfig;
