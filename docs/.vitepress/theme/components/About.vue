<script setup>
import {TkIcon} from "vitepress-theme-teek";
import {ref, onMounted, onBeforeUnmount, computed, onUnmounted} from 'vue';
import {SocialLinks} from '../../config/SocialLinks';

import {
  VscodeDark,
  RiderDark,
  WebstormDark,
  PycharmDark,
  Postman,
  Photoshop,
  Html,
  Css,
  Javascript,
  Typescript,
  Jquery,
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
  MongoDBDark,
  Oracle,
  RabbitMqDark,
  SpringDark,
  SpringBootDark,
  NpmDark,
  NacosDark, MybatisDark, Android, MavenDark, SvnDark
} from '../icon/TechIcons';

const profile = {
  title: '你好，我是',
  name: '威威',
  desc: '一名兴趣使然的程序员',
  avatar: '/avatar/avatar.webp',//头像
  buttons: [
    {text: '联系我', link: 'mailto:your@email.com', type: 'primary'},
    {text: '查看项目', link: '/projects', type: 'default'}
  ],
};

const majorSkills = [
  {name: 'Java', percent: 95, color: '#f25e62'},
  {name: 'Oracle & MySQL', percent: 90, color: '#33a474'},
  {name: 'HTML5 & CSS3', percent: 90, color: '#4298b4'},
  {name: 'JavaScript & Vue.js', percent: 90, color: '#e4ae3a'},
  {name: 'Spring', percent: 93, color: '#88619a'},
  {name: 'Linux', percent: 85, color: '#96b466'},
];

// techStackIcons 扩展为 46 个（8*4+14）SVG图标
const techStackIcons = [
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
const ossProjects = [
  {
    name: 'Teek1',
    previewImgs: [
      'https://picsum.photos/200/300',
      'https://picsum.photos/200/300',
      'https://picsum.photos/200/300',
      'https://picsum.photos/200/300',
    ],
    desc: '🎉 Teek 是一个轻量、简洁高效、灵活配置、易于扩展的 VitePress 主题 ✨，是在默认主题的基础上进行拓展，支持 VitePress 的所有功能、配置，完全可以零成本迁移过来。',
    tech: [
      '前端：React、Ant Design、Redux',
      '后端：Node.js、Express、MongoDB',
    ],
    github: 'https://github.com/example/thrivex',
  },
  {
    name: 'Teek2',
    previewImgs: [
      'https://picsum.photos/200/300',
      'https://picsum.photos/200/300',
      'https://picsum.photos/200/300',
      'https://picsum.photos/200/300',
    ],
    desc: '🎉 Teek 是一个轻量、简洁高效、灵活配置、易于扩展的 VitePress 主题 ✨，是在默认主题的基础上进行拓展，支持 VitePress 的所有功能、配置，完全可以零成本迁移过来。',
    tech: [
      '前端：Vue3、Vite、Element Plus',
      '后端：Koa、MySQL',
    ],
    github: 'https://github.com/example/thrive',
  },
  {
    name: 'Teek3',
    previewImgs: [
      'https://picsum.photos/200/300',
      'https://picsum.photos/200/300',
      'https://picsum.photos/200/300',
      'https://picsum.photos/200/300',
    ],
    desc: '🎉 Teek 是一个轻量、简洁高效、灵活配置、易于扩展的 VitePress 主题 ✨，是在默认主题的基础上进行拓展，支持 VitePress 的所有功能、配置，完全可以零成本迁移过来。',
    tech: [
      '前端：微信小程序、Vant、Echarts、Autojs',
      '框架：Vue2、Element UI、vue-element-admin',
      '后端：Nodejs、Eggjs、Socket.io、MySQL',
    ],
    github: 'https://github.com/example/campus',
  },
];
const tab = ref(0);

/**
 * 自定义观察器函数
 * @param {Object} targetRef - 目标元素
 * @param {number} threshold - 交叉阈值（默认0.2）
 * @returns {Boolean} isVisible - 是否可见
 */
const useIntersectionObserver = (targetRef, threshold = 0.2) => {
  const isVisible = ref(false);
  let observer = null;
  onMounted(() => {
    if ('IntersectionObserver' in window && targetRef.value) {
      observer = new IntersectionObserver(
          (entries) => {
            isVisible.value = entries[0].isIntersecting;
          },
          { threshold }
      );
      // 开始监听目标元素
      observer.observe(targetRef.value);
    } else {
      // 不支持 IntersectionObserver 的浏览器，直接显示元素
      isVisible.value = true;
    }
  });

  onUnmounted(() => {
    // 组件卸载时清理监听
    observer?.disconnect();
  });

  return isVisible;
};

// 使用封装的组合式函数创建监听
// skills-left 动画相关
const skillsLeftRef = ref(null);
const skillsLeftVisible = useIntersectionObserver(skillsLeftRef, 0.2);

// skills-right 动画相关
const skillsRightRef = ref(null);
const skillsRightVisible = useIntersectionObserver(skillsRightRef, 0.2);

// open-source-section 动画相关
const ossSectionRef = ref(null);
const ossSectionVisible = useIntersectionObserver(ossSectionRef, 0.2);

// 首屏元素延迟动画，about-hero 和 skills-section 动画相关
const aboutHeroVisible = ref(false);
const skillsSectionVisible = ref(false);

const isMobile = ref(false);
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 600;
};
onMounted(() => {
  // about-hero 和 skills-section 动画
  setTimeout(() => {
    aboutHeroVisible.value = true;
    skillsSectionVisible.value = true;
  }, 60); // 延迟触发动画，避免与页面渲染冲突
  checkMobile();
  window.addEventListener('resize', checkMobile);
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile);
});
// 移动端情况下过滤掉空的图标（占位符图标）
const mobileTechStackIcons = computed(() => techStackIcons.filter(i => i.icon));

const techStackRows = computed(() => {
  // 每行8个，最后一行不足8个自动补齐
  const rows = [];
  for (let i = 0; i < techStackIcons.length; i += 8) {
    rows.push(techStackIcons.slice(i, i + 8));
  }
  return rows;
});

console.log("techStackRows", techStackRows)
</script>

<template>
  <div class="about-hero" :class="{ visible: aboutHeroVisible }">
    <div class="about-info">
      <div class="about-title">
        <span>{{ profile.title }}</span>
        <span class="about-name">{{ profile.name }}</span>
      </div>
      <div class="about-desc">{{ profile.desc }}</div>
      <div class="about-btns">
        <a v-for="btn in profile.buttons" :key="btn.text" :href="btn.link" :class="['about-btn', btn.type]">{{
            btn.text
          }}</a>
      </div>
      <div class="SocialLinks">
        <a v-for="item in SocialLinks" :key="item.name" :href="item.link" class="social-link" target="_blank"
           rel="noopener noreferrer" :title="item.name">
          <TkIcon :icon="item.icon.svg" icon-type="svg" size="22px"/>
        </a>
      </div>
    </div>
    <div class="about-avatar-wrap">
      <img :src="profile.avatar" alt="avatar" class="about-avatar"/>
    </div>
  </div>

  <!-- 技能区块开始 -->
  <div class="skills-section" :class="{ visible: skillsSectionVisible }">
    <h2 class="skills-title">我的技能</h2>
    <div class="skills-content">
      <div class="skills-left" :class="{ visible: skillsLeftVisible }" ref="skillsLeftRef">
        <div class="skills-subtitle">专业技能</div>
        <div v-for="skill in majorSkills" :key="skill.name" class="skill-bar-item">
          <div class="skill-bar-label">
            <span>{{ skill.name }}</span>
            <span>{{ skill.percent }}%</span>
          </div>
          <div class="skill-bar-bg">
            <div class="skill-bar-fill" :style="{ width: skill.percent + '%', background: skill.color }">
            </div>
          </div>
        </div>
      </div>
      <div class="skills-right" :class="{ visible: skillsRightVisible }" ref="skillsRightRef">
        <div class="skills-subtitle">技术栈</div>
        <!-- PC端 -->
        <div class="tech-stack-grid pc" v-if="!isMobile">
          <div v-for="(row, rowIdx) in techStackRows" :key="rowIdx" class="tech-stack-row">
            <div v-for="(item, idx) in row" :key="idx" class="tech-stack-item" :class="{ empty: !item.icon }">
              <TkIcon v-if="item.icon" :icon="item.icon" icon-type="svg" :size="item.small ? '25px' : '44px'" :title="item.name"/>
            </div>
          </div>
        </div>
        <!-- 移动端 -->
        <div class="tech-stack-grid mobile" v-else>
          <div v-for="(item, idx) in mobileTechStackIcons" :key="idx" class="tech-stack-item">
            <TkIcon :icon="item.icon" icon-type="svg" size="32px" :title="item.name"/>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 开源项目区块 -->
  <div class="open-source-section" :class="{ visible: ossSectionVisible }" ref="ossSectionRef">
    <h2 class="oss-title">开源项目</h2>
    <div class="oss-tabs">
      <button v-for="(item, idx) in ossProjects" :key="item.name" :class="{ active: tab === idx }"
              @click="tab = idx">{{ item.name }}
      </button>
    </div>
    <div class="oss-card">
      <div class="oss-left">
        <h3 class="oss-preview-title">作品预览：</h3>
        <div class="oss-preview-grid">
          <img v-for="(img, i) in ossProjects[tab].previewImgs" :key="i" :src="img" class="oss-preview-img"/>
        </div>
      </div>
      <div class="oss-right">
        <h3 class="oss-detail-title">作品详情：</h3>
        <div class="oss-detail-desc">{{ ossProjects[tab].desc }}</div>
        <div class="oss-tech-title">技术栈：</div>
        <div class="oss-tech-list">
          <div v-for="(t, i) in ossProjects[tab].tech" :key="i">{{ t }}</div>
        </div>
        <div class="oss-github-title">GitHub：</div>
        <div class="oss-github-link">
          <a :href="ossProjects[tab].github" target="_blank">{{ ossProjects[tab].github }}</a>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.about-hero {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 380px;
  margin: 0 auto;
  max-width: 1000px;
  width: 100%;
  padding: 0 2rem;
  opacity: 0;
  transform: scale(0.8);
  transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.about-hero.visible {
  opacity: 1;
  transform: scale(1);
}

.about-info {
  flex: 1;
  min-width: 260px;
  margin: 0;
  /* 取消左侧margin */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.about-title {
  font-size: 2.8rem;
  font-weight: bold;
  margin-bottom: 1.2rem;
}

.about-name {
  background-color: var(--vp-c-brand-1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-left: 0.5rem;
}

.about-desc {
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.about-btns {
  display: flex;
  gap: 1.2rem;
}

.about-btn {
  padding: 0.7rem 2.2rem;
  border-radius: 2rem;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  transition: box-shadow 0.2s, background 0.2s, transform 0.18s;
  box-shadow: 0 2px 8px rgba(59, 108, 255, 0.08);
  border: 2px solid var(--vp-c-brand-1);
  display: inline-block;
}

.about-btn.primary {
  background: var(--vp-c-brand-1);
  color: #fff;
}

.about-btn.default {
  background: #fff;
  color: var(--vp-c-brand-1);
}

.about-btn.default:hover {
  background: #f5f8ff;
  color: var(--vp-c-brand-1);
  box-shadow: 0 6px 24px rgba(59, 108, 255, 0.18);
  transform: translateY(-3px) scale(1.04);
  border-color: #539dfd;
}

.about-btn.primary:hover {
  background: var(--vp-c-brand-1);
  color: #fff;
  box-shadow: 0 8px 32px rgba(59, 108, 255, 0.22);
  transform: translateY(-3px) scale(1.04);
  border-color: var(--vp-c-brand-1);
}

.about-avatar-wrap {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-left: 0;
  /* 取消margin */
}

.about-avatar {
  /* 头像 */
  width: 240px;
  height: 240px;
  border-radius: 50%;
  box-shadow: 0 0 60px 0 var(--vp-c-brand-1);
  border: 4px solid #fff;
  object-fit: cover;
  background: #fff;
  /* 添加过渡效果 */
  transition: transform 1.2s ease-out;
}

/* 当鼠标悬停时触发旋转 */
.about-avatar-wrap:hover .about-avatar {
  transform: rotate(360deg);
}

.skills-section {
  margin: auto;
  border-radius: 24px;
  max-width: 1200px;
  padding: 2.5rem 2rem 2.5rem 2rem;
  transition: box-shadow 0.22s, transform 0.18s, border 0.18s, opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  opacity: 0;
  transform: scale(0.8);
}

.skills-section.visible {
  opacity: 1;
  transform: scale(1);
}

/* .skills-section:hover {
    box-shadow: 0 12px 48px var(--vp-c-brand-1);
    transform: translateY(-8px) scale(1.01);
} */

.skills-title {
  text-align: center;
  font-size: 2.3rem;
  font-weight: bold;
  margin-bottom: 1.2rem;
  letter-spacing: 2px;
}

.skills-title::after {
  /* 我的技能下划线 */
  content: '';
  display: block;
  margin: 0.6rem auto 0 auto;
  width: 150px;
  height: 4px;
  border-radius: 2px;
  background: var(--vp-c-brand-1);
}

.skills-content {
  display: flex;
  gap: 2.5rem;
  margin-top: 2.5rem;
}

.skills-left {
  flex: 1.1;
  min-width: 260px;
}

.skills-right {
  flex: 1;
  min-width: 320px;
  display: flex;
  flex-direction: column;
}

.skills-subtitle {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

.skill-bar-item {
  margin-bottom: 2rem;
}

.skill-bar-label {
  display: flex;
  justify-content: space-between;
  font-size: 1.08rem;
  margin-bottom: 0.3rem;
}

.skill-bar-bg {
  width: 100%;
  height: 8px;
  background: #e5eaf3;
  border-radius: 6px;
  overflow: hidden;
}

.skill-bar-fill {
  height: 100%;
  border-radius: 8px;
  transition: width 0.7s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 6px;
}

.about-socials {
  display: flex;
  gap: 1.1rem;
  margin-top: 1.2rem;
}

.SocialLinks {
  display: flex;
  align-items: center;
  margin-top: 1.2rem;
}

.social-link {
  display: inline-flex;
  align-items: center;
  margin: 0 0.5rem;
  transition: transform 0.18s;
}

.social-link:hover {
  transform: scale(1.18) translateY(-2px);
}

.tech-stack-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.2rem;
}

.tech-stack-row {
  display: flex;
  gap: 1.2rem;
  margin-bottom: 1.2rem;
  justify-content: center;
}

.tech-stack-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 44px;
  border-radius: 12px;
  transition: box-shadow 0.18s, transform 0.18s;
}

.tech-stack-item:hover {
  transform: translateY(-3px) scale(1.03);
}

.small{
  height: fit-content;
}

.tech-stack-img {
  object-fit: contain;
}

/* 技术栈svg图标样式 */
.tech-stack-svg {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tech-stack-svg svg {
  width: 100%;
  height: 100%;
  display: block;
}

.tech-stack-item.empty {
  background: transparent;
  box-shadow: none;
  pointer-events: none;
}

.open-source-section {
  margin: 40px auto;
  max-width: 1200px;
  padding: 0 16px;
  opacity: 0;
  transform: scale(0.8);
  transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.open-source-section.visible {
  opacity: 1;
  transform: scale(1);
}

.oss-title {
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 18px;
}

.oss-tabs {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0;
  margin-bottom: 18px;
  background: #f4f4f5;
  border-radius: 12px;
  padding: 6px;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
}

.oss-tabs button {
  background: transparent;
  border: none;
  border-radius: 8px;
  padding: 7px 28px 7px 28px;
  font-size: 1.08rem;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
  margin: 0;
  outline: none;
  box-shadow: none;
  position: relative;
  z-index: 1;
}

.oss-tabs button.active {
  background: #fff;
  color: #222;
  font-weight: bold;
  box-shadow: 0 2px 8px #e0e3f7;
  z-index: 2;
}

.oss-tabs button:not(:last-child) {
  margin-right: 0;
}

.oss-card {
  border-radius: 24px;
  display: flex;
  padding: 32px 36px;
  gap: 36px;
  align-items: flex-start;
}

.oss-left {
  flex: 1.1;
}

.oss-preview-title {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 12px;
}

.oss-preview-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  border-radius: 14px;
  width: 320px;
}

.oss-preview-img {
  width: 100%;
  height: 90px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e5eaf3;
  background: #fff;
}

.oss-right {
  flex: 2;
  min-width: 320px;
}

.oss-detail-title {
  font-weight: bold;
  margin-bottom: 6px;
}

.oss-detail-desc {
  margin-bottom: 16px;
}

.oss-tech-title {
  font-weight: bold;
  margin-bottom: 6px;
}

.oss-tech-list {
  margin-bottom: 16px;
  font-size: 1rem;
}

.oss-github-title {
  font-weight: bold;
  margin-bottom: 6px;
}

.oss-github-link {
  color: #1976d2;
  word-break: break-all;
}

@media (max-width: 900px) {
  .about-hero {
    flex-direction: column;
    align-items: center;
    padding: 0 0.5rem;
    min-height: unset;
    opacity: 0;
    transform: scale(0.8);
    transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .about-hero.visible {
    opacity: 1;
    transform: scale(1);
  }

  .about-avatar {
    margin-top: 40px;
    width: 256px;
    height: 256px;
    margin-bottom: 1.2rem;
  }

  .about-info {
    margin: 10px;
    padding: 0 0.5rem;
    align-items: center;
    text-align: center;
  }

  .about-title {
    font-size: 2rem;
  }

  .about-desc {
    font-size: 1rem;
    margin-bottom: 1.2rem;
  }

  .about-btns {
    flex-direction: row;
    gap: 0.8rem;
    width: auto;
    align-items: center;
    justify-content: center;
  }

  .about-btn {
    width: auto;
    text-align: center;
    padding: 0.7rem 1.5rem;
  }

  .about-avatar-wrap {
    margin-left: 0;
    justify-content: center;
    width: 100%;
  }

  .skills-title {
    font-size: 1.4rem;
    margin-bottom: 0.8rem;
  }

  .skills-title::after {
    width: 100px;
    height: 3px;
    margin: 0.4rem auto 0 auto;
  }

  .skills-content {
    flex-direction: column;
    gap: 1.2rem;
    margin-top: 1.2rem;
  }

  .skills-left,
  .skills-right {
    min-width: 0;
  }

  .skills-subtitle {
    font-size: 1.08rem;
    margin-bottom: 1rem;
  }

  .skill-bar-item {
    margin-bottom: 1.2rem;
  }

  .skill-bar-label {
    font-size: 0.98rem;
    margin-bottom: 0.18rem;
  }

  .skill-bar-bg {
    height: 6px;
  }

  .about-socials {
    justify-content: center;
    margin-top: 1rem;
    gap: 0.7rem;
  }

  .oss-card {
    flex-direction: column;
    padding: 18px 6px;
    gap: 18px;
  }

  .oss-preview-grid {
    width: 100%;
    grid-template-columns: 1fr 1fr;
  }

  .oss-right {
    min-width: 0;
  }

  .oss-left {
    width: 100%;
    min-width: 0;
    margin-bottom: 10px;
  }

  .oss-preview-img {
    height: 100px;
    border-radius: 5px;
  }

  .skills-right {
    transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0;
    transform: scale(0.8);
  }

  .skills-right.visible {
    opacity: 1;
    transform: scale(1);
  }

  .skills-section {
    opacity: 0;
    transform: scale(0.8);
    transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .skills-section.visible {
    opacity: 1;
    transform: scale(1);
  }

  .skills-left {
    opacity: 0;
    transform: scale(0.8);
    transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .skills-left.visible {
    opacity: 1;
    transform: scale(1);
  }
}

/* 针对PC端生效，移动端不生效 */
@media (min-width: 769px) {
  .skills-section:hover {
    box-shadow: 0 12px 48px var(--vp-c-brand-1);
    transform: translateY(-8px) scale(1.01);
  }
}

@media (max-width: 600px) {
  .tech-stack-grid {
    gap: 0.6rem;
    margin-top: 0.6rem;
  }

  .tech-stack-row {
    gap: 0.6rem;
    margin-bottom: 0.6rem;
  }

  .tech-stack-svg {
    width: 32px;
    height: 32px;
  }

  .skills-right {
    min-width: 0;
  }
}

/* 移动端自动换行方案：用 grid 布局 */
@media (max-width: 600px) {
  .tech-stack-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.6rem;
    margin-top: 0.6rem;
  }

  .tech-stack-row {
    display: contents;
  }

  .tech-stack-item {
    min-width: 0;
    min-height: 0;
    justify-content: center;
  }
}

@media (max-width: 600px) {
  .tech-stack-grid.pc {
    display: none;
  }

  .tech-stack-grid.mobile {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.6rem;
    margin-top: 0.6rem;
    justify-items: center;
  }

  .tech-stack-row {
    display: contents;
  }

  .tech-stack-item {
    min-width: 0;
    min-height: 0;
    justify-content: center;
  }

  .tech-stack-svg,
  .tech-stack-item :deep(svg) {
    width: 32px;
    height: 32px;
  }

  .tech-stack-item.empty {
    display: none;
  }
}
</style>
