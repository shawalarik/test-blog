import {
  VscodeDark,
  WebstormDark,
  Postman,
  Html,
  Css,
  Javascript,
  Typescript,
  Sass,
  LessDark,
  TailwindcssDark,
  VuejsDark,
  ViteDark,
  PiniaDark,
  Electron,
  LinuxDark,
  Nginx,
  NodejsDark,
  MysqlDark,
  PnpmDark,
  ReactDark,
  Git,
  GithubDark,
  GitlabDark,
  Docker,
  JAVA,
  IDEA,
  DataGrip,
  RedisDark,
  RabbitMqDark,
  SpringDark,
  SpringBootDark,
  NpmDark,
  Android,
  MavenDark,
  Star,
  Fork,
  View, NacosDark, Jquery, Oracle, MybatisDark, SvnDark, MongoDBDark,
} from "./TechIcons";

export const profile = {
  title: '你好，我是',
  name: '威威',
  desc: '一名兴趣使然的程序员',
  avatar: '/avatar/avatar.webp',//头像
  buttons: [
    {text: '联系我', link: 'mailto:your@email.com', type: 'primary'},
    {text: '查看项目', link: '/projects', type: 'default'}
  ],
};

export const majorSkills = [
  {
    name: '后端与数据库',
    percent: 95,
    color: '#f25e62',
    tags: [
      { name: 'Java', bg: '#ffeaea', color: '#f25e62' },
      { name: 'Spring', bg: '#f3eaff', color: '#88619a' },
      { name: 'Maven', bg: '#eaf6ff', color: '#4298b4' },
      { name: 'MySQL', bg: '#eafff3', color: '#33a474' },
      { name: 'Oracle', bg: '#fff7ea', color: '#e4ae3a' },
    ]
  },
  {
    name: '前端开发与框架',
    percent: 93,
    color: '#33a474',
    tags: [
      { name: 'HTML5', bg: '#eaf6ff', color: '#4298b4' },
      { name: 'CSS3', bg: '#e3edfa', color: '#3976c6' },
      { name: 'JavaScript', bg: '#fffbe6', color: '#e4ae3a' },
      { name: 'jQuery', bg: '#e3edfa', color: '#3976c6' },
      { name: 'Vue', bg: '#eaf6ff', color: '#4298b4' },
      /*{ name: 'Less', bg: '#f3eaff', color: '#88619a' },*/
      { name: 'Node.js', bg: '#f3ffe9', color: '#96b466' }
    ]
  },
  {
    name: '中间件',
    percent: 95,
    color: '#4298b4',
    tags: [
      { name: 'Redis', bg: '#ffeaea', color: '#f25e62' },
      { name: 'RabbitMq', bg: '#f3ffe9', color: '#96b466' },
      { name: 'Kafka', bg: '#e3edfa', color: '#3976c6' },
    ]
  },
  {
    name: '工程化与工具',
    percent: 93,
    color: '#e4ae3a',
    tags: [
      { name: 'Vite', bg: '#fffbe6', color: '#e4ae3a' },
      { name: 'Webpack', bg: '#e3edfa', color: '#3976c6' },
      { name: 'Git', bg: '#f3eaff', color: '#88619a' },
      { name: 'Docker', bg: '#eafff3', color: '#33a474' }
    ]
  },
  {
    name: '运维与Linux',
    percent: 86,
    color: '#96b466',
    tags: [
      { name: 'Nginx', bg: '#e3edfa', color: '#3976c6' },
      { name: 'HAProxy', bg: '#ffeaea', color: '#f25e62' },
      { name: 'Kubernetes', bg: '#eafff3', color: '#33a474' },
      { name: 'Wireshark', bg: '#f3eaff', color: '#88619a' },
      { name: 'Fail2Ban', bg: '#fffbe6', color: '#e4ae3a' }
    ]
  },
];

export const techStackIcons = [
  // 第一行，首尾空
  {},
  {name: 'JAVA', icon: JAVA},
  {name: 'IDEA', icon: IDEA},
  {name: 'Webstorm', icon: WebstormDark},
  {name: 'DataGrip', icon: DataGrip},
  {name: 'Spring', icon: SpringDark},
  {name: 'SpringBoot', icon: SpringBootDark},
  {},
  // 第二行
  {name: 'Nacos', icon: NacosDark},
  {name: 'Redis', icon: RedisDark},
  {name: 'RabbitMq', icon: RabbitMqDark},
  {name: 'Html', icon: Html},
  {name: 'Css', icon: Css},
  {name: 'Javascript', icon: Javascript},
  {name: 'Typescript', icon: Typescript},
  {name: 'Jquery', icon: Jquery},
  // 第三行
  {name: 'Vuejs', icon: VuejsDark},
  {name: 'Vite', icon: ViteDark},
  {name: 'Pinia', icon: PiniaDark},
  {name: 'Linux', icon: LinuxDark},
  {name: 'Nginx', icon: Nginx},
  {name: 'Nodejs', icon: NodejsDark},
  {name: 'Mysql', icon: MysqlDark},
  {name: 'Oracle', icon: Oracle},
  // 第四行，首尾空
  {name: 'Mybatis', icon: MybatisDark},
  {name: 'Npm', icon: NpmDark},
  {name: 'Git', icon: Git},
  {name: 'Github', icon: GithubDark},
  {name: 'Postman', icon: Postman},
  {name: 'Docker', icon: Docker},
  {name: 'Maven', icon: MavenDark},
  {name: 'Svn', icon: SvnDark},

  // 第五行，缩小行
  {name: 'MongoDB', icon: MongoDBDark, small: true},
  {name: 'Android', icon: Android, small: true},
  {name: 'Pnpm', icon: PnpmDark, small: true},
  {name: 'Electron', icon: Electron, small: true},
  {name: 'Sass', icon: Sass, small: true},
  {name: 'Tailwindcss', icon: TailwindcssDark, small: true},
  {name: 'Github', icon: GithubDark, small: true},
  {name: 'Postman', icon: Postman, small: true}
];

export const ossProjects = [
  {
    name: 'Vue3 Admin Template',
    desc: '基于Vue3、TypeScript和Element Plus的后台管理系统模板，包含完整的权限管理、数据可视化等功能，助力快速搭建企业级应用。',
    tag: { name: 'Vue3', bg: '#eaf6ff', color: '#33a474' },
    projectsimg: 'https://fastly.picsum.photos/id/482/1080/1920.jpg?hmac=evlV0d4x4sWVknpu4iSg4ULVDAcmNBSnf6htH9RsNxw',
    Star: 1200,
    Fork: 456,
    View: 3200,
    github: 'https://github.com/example/vue3-admin'
  },
  {
    name: 'React Component Library',
    desc: '一个基于React的高质量UI组件库，包含常用组件如按钮、表单、弹窗等，支持自定义主题，遵循现代设计原则，提高开发效率。',
    tag: { name: 'React', bg: '#e3edfa', color: '#3976c6' },
    projectsimg: 'https://picsum.photos/id/180/600/400',
    Star: 850,
    Fork: 230,
    View: 2100,
    github: 'https://github.com/example/react-lib'
  },
  {
    name: 'Web Performance Tool',
    desc: '一个用于分析和优化网页性能的工具，提供详细的性能报告和优化建议，帮助开发者快速定位并解决性能瓶颈问题。',
    tag: { name: 'JavaScript', bg: '#fffbe6', color: '#e4ae3a' },
    projectsimg: 'https://picsum.photos/id/1/600/400',
    Star: 560,
    Fork: 180,
    View: 1500,
    github: 'https://github.com/example/web-perf'
  }
];

// 导出开源项目图标用于子组件
export { Star, Fork, View };
