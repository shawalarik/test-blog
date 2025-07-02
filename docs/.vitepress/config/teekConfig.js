import { defineTeekConfig } from "vitepress-theme-teek/config";
import wallpaperImages from "../theme/utils/wallpaperSelector";

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

// 博客基础配置
const teekBlogCommonConfig = {
  teekHome: false,
  vpHome: false,

  social: {}, //社交信息配置
  // 站点信息卡片配置
  docAnalysis: {
    enabled: true,
    createTime: "2021-10-19",
    wordCount: true,
    readingTime: true,
    statistics: {
      provider: "busuanzi", //是否开启首页的访问量和排名统计，仅当 provider 存在生效
      // siteView: true, //是否开启文章页的浏览量统计，仅当 provider 存在生效
      // pageView: true, //如果请求不蒜子接口失败，是否重试，类型 boolean
      // tryRequest: false, //重试次数，仅当 tryRequest 为 true 时有效
      // tryCount: 2000, //重试间隔时间，单位毫秒，仅当 tryRequest 为 true 时有效目录链接
    },
    overrideInfo: [
      {
        key: "lastActiveTime",
        label: "活跃时间",
        value: (_, currentValue) => (currentValue + "").replace("前", ""),
        show: true,
      },
    ],
    appendInfo: [{ key: "index", label: "序号", value: "Hyde" }],
  },
};

// Teek 主题配置
export const teekConfig = defineTeekConfig({
  teekHome: true,
  // 原vitePress风格主页，文档类
  vpHome: false,
  backTopDone: TkMessage => TkMessage.success("返回顶部"),
/*  themeEnhance: {
    position: "top", // 位置，top 为导航栏右侧，bottom 为右下角
    // 布局切换配置
    layoutSwitch: {
      disabled: true,
      defaultMode: "original"
    },
    // 布局主题色配置
    themeColor: {
      disabled: true,
      defaultColor: "vp-default",
      defaultSpread: false
    },
    // 聚光灯配置
    spotlight: {
      disabled: true,
      defaultStyle: "aside",
      defaultValue: true
    }
  },*/
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
    imgSrc: wallpaperImages, // Banner 图片链接。bgStyle 为 partImg 或 fullImg 时生效
    imgInterval: 15000, // 当多张图片时（imgSrc 为数组），设置切换时间，单位：毫秒
    imgShuffle: true, // 图片是否随机切换，为 false 时按顺序切换，bgStyle 为 partImg 或 fullImg 时生效
    imgWaves: true, // 是否开启 Banner 图片波浪纹，bgStyle 为 fullImg 时生效
    mask: true, // Banner 图片遮罩，bgStyle 为 partImg 或 fullImg 时生效
    maskBg: "rgba(0, 0, 0, 0.3)",// Banner 遮罩颜色，如果为数字，则是 rgba(0, 0, 0, ${maskBg})，如果为字符串，则作为背景色。bgStyle 为 partImg 或 fullImg 且 mask 为 true 时生效
    textColor: "#ffffff", // Banner 字体颜色，bgStyle 为 pure 时为 '#000000'，其他为 '#ffffff'
    titleFontSize: "3.2rem", // 标题字体大小
    descFontSize: "1.4rem", // 描述字体大小
    descStyle: "types", // 描述信息风格：default 为纯文字渲染风格（如果 description 为数组，则取第一个），types 为文字打印风格，switch 为文字切换风格
    description: typewriter, // 描述信息
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
  friendLink: {
    enabled: true, // 是否启用友情链接卡片
    list: [
      {
        name: "Teeker",
        desc: "朝圣的使徒，正在走向编程的至高殿堂！",
        avatar: "https://testingcf.jsdelivr.net/gh/Kele-Bingtang/static/user/avatar2.png",
        link: "http://notes.teek.top/",
      },
      {
        name: "vuepress-theme-vdoing",
        desc: "🚀一款简洁高效的VuePress 知识管理&博客 主题",
        avatar: "https://doc.xugaoyi.com/img/logo.png",
        link: "http://notes.teek.top/",
      },
      {
        name: "vuepress-theme-vdoing",
        desc: "🚀一款简洁高效的VuePress 知识管理&博客 主题",
        avatar: "https://doc.xugaoyi.com/img/logo.png",
        link: "https://doc.xugaoyi.com/",
      },
      {
        name: "One",
        desc: "明心静性，爱自己",
        avatar: "https://onedayxyy.cn/img/xyy-touxiang.png",
        link: "https://onedayxyy.cn/",
      },
      {
        name: "Hyde Blog",
        desc: "人心中的成见是一座大山",
        avatar: "https://teek.seasir.top/avatar/avatar.webp",
        link: "https://teek.seasir.top/",
      },
      {
        name: "二丫讲梵",
        desc: "💻学习📝记录🔗分享",
        avatar: "https://wiki.eryajf.net/img/logo.png",
        link: " https://wiki.eryajf.net/",
      },
    ], // 友情链接数据列表
    limit: 3, // 一页显示的数量
    autoScroll: false, // 是否自动滚动
    scrollSpeed: 2500, // 滚动间隔时间，单位：毫秒。autoScroll 为 true 时生效
    autoPage: false, // 是否自动翻页
    pageSpeed: 4000, // 翻页间隔时间，单位：毫秒。autoPage 为 true 时生效
  },
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
  footerGroup: [
    {
      title: "官网",
      links: [
        { name: "Vue", link: "https://cn.vuejs.org/" },
        { name: "Vite", link: "https://vitejs.cn/vite6-cn/" },
      ],
    },
    {
      title: "博客",
      links: [
        { name: "vitePress", link: "https://vitejs.cn/vitepress/" },
        { name: "vp Teek", link: "https://vp.teek.top/" },
      ],
    },
    {
      title: "内部链接",
      links: [
        { name: "快速开始", link: "/guide/quickstart" },
        { name: "配置简介", link: "/reference/config" },
      ],
    },
  ],
  footerInfo: {
    // 页脚信息，支持 HTML 格式（位于主题版权上方）
    //topMessage: ["下面的内容和图标都可以修改（本条内容也可以隐藏的）"],
    // 页脚信息，支持 HTML 格式（位于主题版权下方）
    //bottomMessage: ["上面的内容和图标都可以修改（本条内容也可以隐藏的）"],
    // 主题版权配置
    theme: {
      show: true, // 是否显示主题版权，建议显示
      name: "", // 自定义名称
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
      text: `<p>作者：Teek</p>
             <p>版权：此文章版权归 威威 所有，如有转载，请注明出处!</p>
             <p style="margin-bottom: 0">链接：可点击右上角分享此页面复制文章链接</p>
            `,
    };
  },
  articleUpdate: {
    enabled: true, // 是否启用文章最近更新栏
    limit: 3, // 文章最近更新栏显示数量
  },
});

// 博客卡片配置
export const teekBlogCardConfig = {
  ...teekBlogCommonConfig,
  pageStyle: "segment", //主题面板需要选择第四个选项，否则彩带是透明
  page: {
    pageSize: 15, // 每页显示的文章数量,这里先暂时设置为15，因为卡片栏高度超出右侧卡片就会一起同步滚动了，反之不会
  },
  post: {
    postStyle: "card", //文章模板风格，list 为列表风格，card 为卡片风格
  },
  homeCardListPosition: "left", //卡片模式下的标题标签位置
  banner: {
    name: "Hyde Blog 🎉", // Banner 标题，默认读取 vitepress 的 title 属性
    bgStyle: "fullImg",
    imgSrc: {},
    description: {}, // 打字机描述信息,
    descStyle: "types",
  },
};
