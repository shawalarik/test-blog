<template>
  <div class="announcement-card" v-if="isVisible">
    <!-- 公告头部 -->
    <div class="announcement-header">
      <div class="announcement-tag">
        <svg class="tag-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" fill="currentColor"/>
        </svg>
        <span>{{ noticeContent.title }}</span>
      </div>
      <span class="announcement-date">{{ noticeContent.date }}</span>
    </div>

    <!-- 公告内容 -->
    <div class="announcement-content">
      <h3 class="announcement-title">
        <svg class="title-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z" fill="currentColor"/>
        </svg>
        {{ noticeContent.subtitle }}
      </h3>

      <p class="announcement-text">
        {{ noticeContent.content }}
      </p>

      <!-- 底部操作区 -->
      <div class="announcement-footer">
        <a class="announcement-button" :href="noticeContent.operationButtonPath" :target="getTargetValue()">
          <span>{{ noticeContent.operationButtonName }}</span>
          <svg class="button-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isVisible = ref(true);

interface NoticeContent {
  title: string;
  date: string;
  subtitle: string;
  content: string;
  fileName?: string;
  operationButtonName: string;
  operationButtonPath: string;
}

const noticeContent: NoticeContent = {
  title: '📢 重要公告',
  date: '2025-8-20',
  subtitle: '全网最美博客Teek🎉',
  content: 'Teek~一款简约、唯美、丝滑且强大的VitePress主题博客(知识库&博客二合一) ，正在持续迭代更新，欢迎交流学习！',
  fileName: '',
  operationButtonName: '查看详情',
  operationButtonPath: 'https://vp.teek.top/',
};

const isExternalLink = (): boolean => {
  const url: string = noticeContent.operationButtonPath
  return /^(https?:\/\/|\/\/)/.test(url);
};

const getTargetValue = (): string => {
  return isExternalLink() ? '_blank' : '_self';
};
</script>

<style scoped>
.announcement-card {
  --primary-color: #6366f1;
  --primary-hover: #4f46e5;
  --text-color: #334155;
  --text-secondary: #64748b;
  --bg-color: #ffffff;
  --border-color: #e2e8f0;
  --tag-bg: #eef2ff;
  --tag-color: #4338ca;

  width: var(--tk-home-card-width);
  margin: 0 auto;
  background: var(--bg-color);
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid var(--border-color);
}

html.dark .announcement-card {
  --primary-color: #818cf8;
  --primary-hover: #6366f1;
  --text-color: #e2e8f0;
  --text-secondary: #94a3b8;
  --bg-color: #1e293b;
  --border-color: #334155;
  --tag-bg: #312e81;
  --tag-color: #c7d2fe;
}

html.dark .announcement-header {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
}

.announcement-card:hover {
  box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
  transform: translateY(-2px);
  border-color: var(--primary-color);
}

.announcement-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border-bottom: 1px solid var(--border-color);
}

.announcement-tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px 4px 6px;
  border-radius: 6px;
  background-color: var(--tag-bg);
  color: var(--tag-color);
  font-size: 13px;
  font-weight: 600;
  gap: 6px;
}

.tag-icon {
  width: 16px;
  height: 16px;
}

.announcement-date {
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 500;
}

.announcement-content {
  padding: 20px;
}

.announcement-title {
  display: flex;
  align-items: center;
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-color);
  gap: 8px;
}

.title-icon {
  width: 20px;
  height: 20px;
  color: var(--primary-color);
}

.announcement-text {
  margin: 0 0 20px 0;
  color: var(--text-color);
  line-height: 1.7;
  font-size: 15px;
}

.announcement-footer {
  display: flex;
  justify-content: flex-end;
}

.announcement-button {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  background-color: var(--primary-color);
  color: white;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  text-decoration: none;
  transition: all 0.2s ease;
  gap: 6px;
}

.announcement-button:hover {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
}

.button-icon {
  width: 16px;
  height: 16px;
}
</style>
