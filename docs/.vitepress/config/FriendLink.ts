// FriendLink用于在首页展示一些友链
export const FriendLink = {
    enabled: true, // 是否启用友情链接卡片
    limit: 5, // 一页显示的数量
    autoScroll: true, // 是否自动滚动
    scrollSpeed: 4000, // 滚动间隔时间，单位：毫秒。autoScroll 为 true 时生效
    autoPage: true, // 是否自动翻页
    pageSpeed: 4000, // 翻页间隔时间，单位：毫秒。autoPage 为 true 时生效
    titleClick: (router) => router.go("/websites"), // 查看更多友链
    // 友情链接数据列表
    list: [
        {
            avatar: "/avatar/friendLink/teek-logo-large.png",
            name: "Teek VitePress主题",
            desc: "✨一个轻量、简洁高效、灵活配置、易于扩展的 VitePress 主题。",
            link: "https://vp.teek.top/",
        },
        {
            avatar: "/avatar/friendLink/Kele-Bingtang.png",
            name: "Teeker",
            desc: "朝圣的使徒，正在走向编程的至高殿堂！",
            link: "http://notes.teek.top/",
        },
        {
            avatar: "/avatar/friendLink/onedayxyy.webp",
            name: "One",
            desc: "明心静性，爱自己",
            link: "https://onedayxyy.cn/",
        },
        {
            avatar: "/avatar/friendLink/wiki.eryajf.png",
            name: "二丫讲梵",
            desc: "坐而言不如起而行",
            link: "https://wiki.eryajf.net/",
        },
        {
            avatar: "/avatar/friendLink/snowlinlan.png",
            name: "SnowLin",
            desc: "一個溫暖的地方",
            link: "https://blog.snowlinlan.com/",
        },
        {
            avatar: "/avatar/friendLink/sinc.webp",
            name: "凿壁偷光不算偷",
            desc: "tk 道友",
            link: "https://sinc.us.kg/",
        },
        {
            avatar: "/avatar/friendLink/liuyuyang.jpg",
            name: "宇阳",
            desc: "记录所学知识，缩短和大神的差距！",
            link: "https://liuyuyang.net",
        },
    ],
};
