import { isEmpty } from "../theme/utils/WwUtils";
import type { DefaultTheme } from "vitepress/theme";

/**
 * 生成导航栏的文本和图标
 * @param text 导航栏的文本
 * @param svgPath 导航栏的图标路径（可选，可以直接在文本中使用emoji表情）
 * @returns 导航栏的文本和图标
 */
function getNav(text: string, svgPath?: string) {
  let imgTemplate = "";
  if (!isEmpty(svgPath)) {
    imgTemplate = `<img src="${svgPath}" alt="" style="width: 16px; height: 16px;">`;
  }

  return `
            <div style="display: flex; align-items: center; gap: 4px;">
             ${imgTemplate}
              <span>${text}</span>
            </div>
            `;
}

export const Nav: DefaultTheme.NavItem[] = [
  {
    text: "🏡首页",
    link: "/"
  },
  {
    text: "🏓生活",
    items: [
      {
        text: getNav("相册", "/svg/相册.svg"),
        link: "/photo"
      },
      {
        text: getNav("电影", "/svg/电影.svg"),
        link: "/movie"
      },
      {
        text: getNav("音乐", "/svg/音乐.svg"),
        link: "/music"
      }
    ]
  },
  {
    text: "📖前端",
    items: [
      {
        text: getNav("Vite相关", "/svg/vite.svg"),
        link: "/vite"
      },
      {
        text: getNav("VitePress相关", "/svg/vitepress-logo-mini.svg"),
        link: "/vitePress"
      },
      {
        text: getNav("Vdoing主题", "/img/png/vdoing.png"),
        link: "/vdoing"
      },
      {
        text: getNav("Teek主题", "/svg/teek-logo-mini.svg"),
        link: "/teek"
      }
    ]
  },
  {
    text: "💻后端",
    items: [
      {
        text: getNav("Java", "/svg/java.svg"),
        link: "/java"
      }
    ]
  },
  {
    text: "📕笔记",
    items: [
      {
        text: getNav("博客搭建", "/svg/blog.svg"),
        link: "/blog"
      },
      {
        text: getNav("友人专栏", "/svg/朋友.svg"),
        link: "/friend"
      }
    ]
  },
  {
    text: "🧰工具资源", // 目录页链接，此处 link 是 vdoing 主题新增的配置项，有二级导航时，可以点击一级导航跳到目录页
    items: [
      {
        text: getNav("SSL证书", "/svg/allinssl.svg"),
        link: "/ssl"
      },
      {
        text: getNav("Linux", "/svg/linux.svg"),
        link: "/linux"
      },
      {
        text: getNav("Nginx", "/svg/nginx.svg"),
        link: "/nginx"
      },
      {
        text: getNav("Git", "/svg/git.svg"),
        link: "/git"
      },
      {
        text: getNav("Docker", "/svg/docker.svg"),
        link: "/docker"
      },
      {
        text: getNav("实用软件", "/svg/appstore.svg"),
        link: "/appstore"
      }
    ]
  },
  {
    text: "🗂️文章",
    items: [
      {
        text: getNav("归档页", "/svg/归档.svg"),
        link: "/archives"
      },
      {
        text: getNav("📃文章分类"),
        link: "/categories"
      },
      {
        text: getNav("🔖文章标签"),
        link: "/tags"
      },
      {
        text: getNav("文章清单", "/svg/清单.svg"),
        link: "/articleOverview"
      }
      /*{
                text: getNav("站点登录", '/svg/登录.svg'),
                link: '/login',
            }*/
    ]
  },
  {
    text: "🍷关于",
    items: [
      {
        text: getNav("👋关于我"),
        link: "/about-me"
      },
      {
        text: getNav("工作计算器", "/svg/job.svg"),
        link: "/job"
      },
      {
        text: getNav("友链链接", "/svg/link.svg"),
        link: "/friend-link"
      },
      {
        text: getNav("🌐网站导航"),
        link: "/websites"
      },
      {
        text: getNav("站点统计", "/svg/SiteAnalytics.svg"),
        link: "https://umami.dl-web.top/share/W17NnbgApgn6RaVs/dl-web.top"
      },
      {
        text: getNav("站点监控", "/svg/站点监控.svg"),
        link: "https://status.dl-web.top/status/monitor"
      }
    ]
  }
];
