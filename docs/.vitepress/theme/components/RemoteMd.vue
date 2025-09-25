<!-- .vitepress/components/RemoteMd.vue -->
<template>
  <div class="remote-md-container">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading">加载中...</div>

    <!-- 错误状态 -->
    <div v-if="error" class="error">{{ error }}</div>

    <!-- 渲染 Markdown 内容 -->
    <div v-if="html" class="markdown-content" v-html="html" v-pre></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
/*
import marked from "marked";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css"; // 代码高亮样式
*/

// 接收 Markdown 远程地址参数
const props = defineProps<{
  url: string; // 远程 Markdown 文件 URL（如 https://xxx.com/docs/page1.md）
}>();

const html = ref("");
const loading = ref(true);
const error = ref("");

/*// 使用 marked 扩展方式添加代码高亮
marked.use({
  renderer: {
    code(code: string, lang: string, escaped: boolean) {
      if (lang && hljs.getLanguage(lang)) {
        return `<pre><code class="hljs language-${lang}">${hljs.highlight(code, { language: lang }).value}</code></pre>`;
      }
      return `<pre><code class="hljs">${hljs.highlightAuto(code).value}</code></pre>`;
    }
  }
});

// 配置 marked 解析器（支持代码高亮）
marked.setOptions({
  breaks: true, // 支持换行
  gfm: true // 支持 GitHub Flavored Markdown
});*/

// 远程加载并解析 Markdown
const loadRemoteMd = async () => {
  try {
    loading.value = true;

    // 动态导入 marked 和 highlight.js（可选，避免打包）
    const { default: marked } = await import("marked");
    const { default: hljs } = await import("highlight.js");

    const response = await fetch(props.url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const mdContent = await response.text();
    html.value = await marked.parse(mdContent);
  } catch (err) {
    error.value = err instanceof Error ? err.message : "加载失败";
    console.error("远程 Markdown 加载失败:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadRemoteMd();
});
</script>

<style scoped>
/* 加载状态 & 错误状态：复用 VitePress 主题文本色，保持视觉统一 */
.loading,
.error {
  padding: 2rem;
  text-align: center;
  color: var(--vp-c-text-2); /* VitePress 内置次要文本色 */
  font-size: var(--vp-font-size-base); /* 贴合主题字体大小 */
}

.error {
  color: var(--vp-c-danger); /* VitePress 内置危险色（红色系） */
}

/* 远程 Markdown 容器：对齐 VitePress 本地 Markdown 布局 */
.markdown-content {
  /* 匹配 VitePress 正文内边距（移动端/桌面端自适应） */
  padding: 0 var(--vp-layout-gutter);
  /* 最大宽度对齐主题（避免内容过宽） */
  max-width: var(--vp-layout-max-width);
  /* 水平居中（同本地 Markdown 容器） */
  margin: 0 auto;
  /* 上下留白（匹配主题段落间距） */
  margin-top: 1.5rem;
  margin-bottom: 2rem;
  /* 继承主题字体（确保文字风格统一） */
  font-family: var(--vp-font-family-base);
  line-height: var(--vp-line-height-base);
}

/* 代码块样式：对齐 VitePress 原生代码块 */
.markdown-content pre {
  margin: 1rem 0; /* 上下间距（匹配主题代码块） */
  padding: 1rem; /* 内边距 */
  border-radius: var(--vp-border-radius); /* 主题圆角（通常是 8px） */
  background-color: var(--vp-c-bg-alt); /* 主题备用背景色（深色模式自动切换） */
  overflow-x: auto; /* 横向滚动（避免代码溢出） */
  font-size: var(--vp-font-size-sm); /* 代码字体大小（比正文小一号） */
}

/* 行内代码样式：匹配主题 */
.markdown-content code {
  padding: 0.15rem 0.3rem;
  border-radius: var(--vp-border-radius-sm); /* 小圆角（通常是 4px） */
  background-color: var(--vp-c-bg-alt);
  font-family: var(--vp-font-family-mono); /* 等宽字体（代码专用） */
  font-size: var(--vp-font-size-sm);
  color: var(--vp-c-text-code); /* 主题代码文本色（高亮色） */
}

/* 补充 Markdown 常见元素样式（对齐 VitePress 原生） */
/* 标题样式 */
.markdown-content h1,
.markdown-content h2,
.markdown-content h3,
.markdown-content h4,
.markdown-content h5,
.markdown-content h6 {
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: var(--vp-c-text-1); /* 主题主要文本色 */
  font-weight: var(--vp-font-weight-bold);
}

.markdown-content h1 {
  font-size: var(--vp-font-size-xxl);
}

.markdown-content h2 {
  font-size: var(--vp-font-size-xl);
}

/* 段落样式 */
.markdown-content p {
  margin: 1rem 0;
  color: var(--vp-c-text-1);
}

/* 列表样式 */
.markdown-content ul,
.markdown-content ol {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.markdown-content li {
  margin: 0.5rem 0;
}

/* 链接样式 */
.markdown-content a {
  color: var(--vp-c-brand); /* 主题品牌色（链接色） */
  text-decoration: underline;
  text-underline-offset: 0.25rem;
  transition: color 0.2s;
}

.markdown-content a:hover {
  color: var(--vp-c-brand-hover); /* 主题品牌 hover 色 */
}

/* 图片样式（避免图片溢出） */
.markdown-content img {
  max-width: 100%;
  border-radius: var(--vp-border-radius);
  margin: 1.5rem 0;
}
</style>
