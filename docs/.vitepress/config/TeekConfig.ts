// @ts-ignore
import type { TeekConfig } from "vitepress-theme-teek/config";
import { FooterInfo } from "./FooterInfo";
import { FooterGroup } from "./FooterGroup";
import { FriendLink } from "./FriendLink";
import { Typewriter } from "./Typewriter";
import { Wallpaper } from "./Wallpaper";
import {SocialDate} from "./SocialDate";
import {SocialLinks} from "./SocialLinks";

// 博客基础配置
const teekBlogCommonConfig: TeekConfig = {
  teekHome: true,
  // 原vitePress风格主页，文档类
  vpHome: false,
  backTopDone: TkMessage => TkMessage.success("返回顶部"),
  author: {
    name: "威威", // 作者名称
    //link: "https://github.com/Kele-Bingtang",
  },
  blogger: {
    // 博主信息，显示在首页侧边栏
    avatar: "/avatar/avatar.webp",
    shape: "circle", // 头像风格：square 为方形头像，circle 为圆形头像，circle-rotate 可支持鼠标悬停旋转
    name: "威威",
    slogan: "人心中的成见是一座大山~",
    circleBgImg: "/avatar/avatarBg.webp", // 头像圆形背景图
  },
  banner: {
    enabled: true,
    //features: [], //用于在首页展示一些功能介绍,也就是首页三个功能块
    //name: "", // Banner 标题，默认读取 vitepress 的 title 属性
    //name: "Teek", // Banner 标题，默认读取 vitepress 的 title 属性
    bgStyle: "fullImg", // Banner 背景风格：pure 为纯色背景，partImg 为局部图片背景，fullImg 为全屏图片背景
    //pureBgColor: "#28282d", // Banner 背景色，bgStyle 为 pure 时生效
    imgSrc: Wallpaper, // Banner 图片链接。bgStyle 为 partImg 或 fullImg 时生效
    imgInterval: 15000, // 当多张图片时（imgSrc 为数组），设置切换时间，单位：毫秒
    imgShuffle: true, // 图片是否随机切换，为 false 时按顺序切换，bgStyle 为 partImg 或 fullImg 时生效
    imgWaves: true, // 是否开启 Banner 图片波浪纹，bgStyle 为 fullImg 时生效
    mask: true, // Banner 图片遮罩，bgStyle 为 partImg 或 fullImg 时生效
    maskBg: "rgba(0, 0, 0, 0.3)",// Banner 遮罩颜色，如果为数字，则是 rgba(0, 0, 0, ${maskBg})，如果为字符串，则作为背景色。bgStyle 为 partImg 或 fullImg 且 mask 为 true 时生效
    textColor: "#ffffff", // Banner 字体颜色，bgStyle 为 pure 时为 '#000000'，其他为 '#ffffff'
    titleFontSize: "3.2rem", // 标题字体大小
    descFontSize: "1.4rem", // 描述字体大小
    descStyle: "types", // 描述信息风格：default 为纯文字渲染风格（如果 description 为数组，则取第一个），types 为文字打印风格，switch 为文字切换风格
    description: Typewriter, // 描述信息
    switchTime: 4000, // 描述信息切换间隔时间，单位：毫秒。descStyle 为 switch 时生效
    typesInTime: 200, // 输出一个文字的时间，单位：毫秒。descStyle 为 types 时生效
    typesOutTime: 100, // 删除一个文字的时间，单位：毫秒。descStyle 为 types 时生效
    typesNextTime: 800, // 打字与删字的间隔时间，单位：毫秒。descStyle 为 types 时生效
    switchShuffle: false, // 描述信息是否随机切换，为 false 时按顺序切换。descStyle 为 switch 时生效
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
  page: {
    pageSize: 20,
  },
  post: {
    postStyle: "list", // card 和 list 文章列表风格
    excerptPosition: "top", // 文章摘要位置
    showMore: true, // 是否显示更多按钮
    moreLabel: "阅读全文 >", // 更多按钮文字
    coverImgMode: "default", // 文章封面图模式
    showCapture: false, // 是否在摘要位置显示文章部分文字，当为 true 且不使用 frontmatter.describe 和 <!-- more --> 时，会自动截取前 300 个字符作为摘要
  },
  topArticle: {
    enabled: true, // 是否启用精选文章卡片
    limit: 5, // 一页显示的数量
    autoPage: false, // 是否自动翻页
    pageSpeed: 4000, // 翻页间隔时间，单位：毫秒。autoPage 为 true 时生效
    dateFormat: "yyyy-MM-dd hh:mm:ss", // 精选文章的日期格式
  },
  friendLink: FriendLink, // 友链配置
  social: SocialDate, //社交信息配置
  footerGroup: FooterGroup,
  footerInfo: FooterInfo,

  // 站点信息卡片配置
  docAnalysis: {
    enabled: true,
    createTime: "2021-10-19",
    wordCount: true,
    readingTime: true,
    statistics: {
      provider: "busuanzi",
      siteView: true,
      pageView: true,
    },
    overrideInfo: [
      {
        key: "lastActiveTime",
        label: "活跃时间",
        value: (_, currentValue) => (currentValue + "").replace("前", ""),
        show: true,
      },
      {key: 'viewCount', show: false},
      {key: 'visitCount', show: false}
    ],
    //appendInfo: [{ key: "index", label: "序号", value: "天客 99" }],
  },

  articleShare: {
    enabled: true, // 是否开启文章链接分享功能
    text: "分享此页面", // 分享按钮文本
    copiedText: "链接已复制", // 复制成功文本
    query: false, // 是否包含查询参数
    hash: false, // 是否包含哈希值
  },
  articleBottomTip: () => {
    return {
      type: "tip",
      // title: "声明",
      text: `<p>作者：威威</p>
             <p>版权：此文章版权归 威威 所有，如有转载，请注明出处!</p>
             <p style="margin-bottom: 0">链接：可点击右上角分享此页面复制文章链接</p>
            `,
    };
  },
  articleUpdate: {
    enabled: true, // 是否启用文章最近更新栏
    limit: 3, // 文章最近更新栏显示数量
  },
};

// Teek 主题配置
export const teekConfig: TeekConfig = {
  ...teekBlogCommonConfig
}

// 文档配置
export const teekDocConfig: TeekConfig = {
  teekHome: false,
  // 原vitePress风格主页，文档类
  vpHome: true,
  footerInfo: FooterInfo, // 底部信息配置
  themeEnhance: {
    layoutSwitch: {
      defaultMode: "bothWidthAdjustable",
    },
  },
};

// 博客默认配置
export const teekBlogConfig = {
  ...teekBlogCommonConfig,
  banner: {
    pureBgColor: "#28282d", // Banner 背景色。bgStyle 为 pure 时生效
    imgSrc: Wallpaper,
    descStyle: "types",
    description: Typewriter, // 打字机描述信息,
    bgStyle: "pure",
  },
};

// 博客小图配置
export const teekBlogParkConfig: TeekConfig = {
  ...teekBlogCommonConfig,
  banner: {
    bgStyle: "partImg",
    imgSrc: Wallpaper,
    description: Typewriter, // 打字机描述信息,
    descStyle: "types",
  },
};

// 博客大图配置
export const teekBlogFullConfig: TeekConfig = {
  ...teekBlogCommonConfig,
  post: {
    coverImgMode: "full",
  },
  banner: {
    bgStyle: "fullImg",
    imgSrc: Wallpaper,
    description: Typewriter, // 打字机描述信息,
    descStyle: "types",
  },
};

// 博客全图配置
export const teekBlogBodyConfig: TeekConfig = {
  ...teekBlogCommonConfig,
  pageStyle: "segment-nav",
  bodyBgImg: {
    imgSrc: Wallpaper,
  },
  themeEnhance: {
    layoutSwitch: {
      defaultMode: "bothWidthAdjustable",
    },
  },
  banner: {
    bgStyle: "fullImg",
    description: Typewriter, // 打字机描述信息,
    descStyle: "types",
  },
};

// 博客卡片配置
export const teekBlogCardConfig: TeekConfig = {
  ...teekBlogCommonConfig,
  // pageStyle: "segment", //主题面板需要选择第四个选项，否则彩带是透明;230630去除该配置会影响网站导航移动端容器样式
  page: {
    pageSize: 15, // 每页显示的文章数量,这里先暂时设置为15，因为卡片栏高度超出右侧卡片就会一起同步滚动了，反之不会
  },
  post: {
    postStyle: "card", //文章模板风格，list 为列表风格，card 为卡片风格
  },
  homeCardListPosition: "left", //卡片模式下的标题标签位置
  banner: {
    bgStyle: "fullImg",
    imgSrc: Wallpaper,
    description: Typewriter, // 打字机描述信息,
    descStyle: "types",
  },
};
