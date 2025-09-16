import {
  About,
  Exclamation,
  FriendshipLinks,
  Home,
  MessageBoard,
  Music,
  Other,
  PhotoAlbum,
  Refresh,
  TreeHollow
} from "./SvgList";

export const menuData = {
  header: {
    title: "威威 Blog",
    svg: Exclamation
  },
  body: [
    {
      text: "首页",
      svg: Home,
      click(frontmatter: any, navigateTo: Function) {
        navigateTo("/");
      }
    },
    {
      text: "关于我",
      svg: About,
      click(frontmatter: any, navigateTo: Function) {
        navigateTo("/about-me");
      }
    },
    {
      text: "其他",
      svg: Other,
      subMenu: [
        {
          text: "树洞",
          svg: TreeHollow,
          click(frontmatter: any, navigateTo: Function) {
            console.log("树洞");
          }
        },
        {
          text: "留言板",
          svg: MessageBoard,
          click(frontmatter: any, navigateTo: Function) {
            console.log("留言板");
          }
        }
      ]
    },
    {
      text: "友链",
      svg: FriendshipLinks,
      click(frontmatter: any, navigateTo: Function) {}
    },
    {
      text: "音乐",
      svg: Music,
      click(frontmatter: any, navigateTo: Function) {}
    },
    {
      text: "相册",
      svg: PhotoAlbum,
      click(frontmatter: any, navigateTo: Function) {}
    }
  ],
  footer: {
    copy: true,
    refresh: true
  }
};
