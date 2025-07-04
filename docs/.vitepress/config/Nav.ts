import { isEmpty } from "../theme/utils/WwUtils";
import type { DefaultTheme  } from "vitepress/theme";
function getNav(text:string, svgPath:string) {
    let imgTemplate
    if (!isEmpty(svgPath)){
        imgTemplate = `<img src="${svgPath}" alt="" style="width: 16px; height: 16px;">`
    }else {
        imgTemplate = ''
    }

    return `
            <div style="display: flex; align-items: center; gap: 4px;">
             ${imgTemplate}
              <span>${text}</span>
            </div>
            `
}

export const Nav: DefaultTheme.NavItem[] = [
    {
        text: "🏡首页",
        link: "/"
    },
    {
        text: "📖笔记专栏",
        items: [
            {
                text: getNav("Teek主题", "/svg/teek-logo-mini.svg"),
                link: '/Teek',
            },
            {
                text: getNav("Vdoing主题", "https://vuepress.vuejs.org/images/hero.png"),
                link: '/Vdoing',
            },
            {
                text: getNav("SSL证书", "/svg/allinssl.svg"),
                link: '/SSL',
            },
            {
                text: getNav("博客搭建", "/svg/blog.svg"),
                link: '/Blog',
            }
        ],
    },
    {
        text: "🧰工具资源", // 目录页链接，此处 link 是 vdoing 主题新增的配置项，有二级导航时，可以点击一级导航跳到目录页
        items: [
            {
                text: getNav("Linux", "/svg/linux.svg"),
                link: '/Linux',
            },
            {
                text: getNav("Nginx", "/svg/nginx.svg"),
                link: '/Nginx',
            },
            {
                text: getNav("Git", "/svg/git.svg"),
                link: '/Git',
            },
            {
                text: getNav("Docker", "/svg/docker.svg"),
                link: '/Docker',
            },
            {
                text: getNav("实用软件", "/svg/appstore.svg"),
                link: '/Appstore',
            }
        ],
    },
    /*  {
        text: "🏙️生活娱乐",
        items: [
          {
            component: "NavIcon",
            props: PhotoIcon,
          },
          {
            component: "NavIcon",
            props: MusicIcon,
          },
          {
            component: "NavIcon",
            props: FilmIcon,
          },
        ],
      },
      { text: "👂畅所欲言", link: "/message-area/" },*/
    {
        text: "👏文章索引",
        items: [
            {text: "📃文章分类", link: "/categories/"},
            {
                text: getNav("🔖文章标签", null),
                link: '/tags',
            },
            {
                text: getNav("归档页", '/svg/归档.svg'),
                link: '/archives',
            },
            {
                text: getNav("文章清单", '/svg/清单.svg'),
                link: '/articleOverview',
            },
            {
                text: getNav("站点登录", '/svg/登录.svg'),
                link: '/login',
            },
            {
                text: getNav("风险提示", '/svg/风险提示.svg'),
                link: '/risk-link',
            },
        ],
    },
    {
        text: "🌐站点信息",
        items: [
            {
                text: getNav("关于本站", '/svg/about.svg'),
                link: '/About',
            },
            {
                text: getNav("友链链接", '/svg/link.svg'),
                link: '/Link',
            },
            {
                text: getNav("网站导航", '/svg/nav.svg'),
                link: '/Nav',
            },
            {
                text: getNav("站点统计", '/svg/SiteAnalytics.svg'),
                link: 'https://umami.seasir.top/share/rvVBNZWa0sUCN6wG/teek.seasir.top',
            },
            {
                text: getNav("站点状态", '/svg/status.svg'),
                link: 'https://status.seasir.top/',
            }
        ],
    },
];
