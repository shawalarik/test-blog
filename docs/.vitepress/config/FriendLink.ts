// FriendLink用于在首页展示一些友链
export const FriendLink = {
    enabled: true, // 是否启用友情链接卡片
    limit: 5, // 一页显示的数量
    autoScroll: true, // 是否自动滚动
    scrollSpeed: 2500, // 滚动间隔时间，单位：毫秒。autoScroll 为 true 时生效
    autoPage: true, // 是否自动翻页
    pageSpeed: 4000, // 翻页间隔时间，单位：毫秒。autoPage 为 true 时生效
    // 友情链接数据列表
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
/*        {
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
        }*/
    ]
};
