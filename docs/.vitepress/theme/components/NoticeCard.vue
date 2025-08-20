<template>
  <TkPageCard :title="noticeContent.title">
    <div class="announcement-card">
      <!-- 公告内容 -->
      <div class="announcement-content">
        <h3 class="announcement-title">
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
  </TkPageCard>
</template>

<script setup lang="ts">
import { TkPageCard } from "vitepress-theme-teek";

// 公告内容类型
interface NoticeContent {
  title: string;
  subtitle: string;
  content: string;
  operationButtonName: string;
  operationButtonPath: string;
}

// 公告内容
const noticeContent: NoticeContent = {
  title: '📢 重要公告',
  subtitle: '全网最美博客Teek🎉',
  content: 'Teek~一款简约、唯美、丝滑且强大的VitePress主题博客(知识库&博客二合一) ，正在持续迭代更新，欢迎交流学习！',
  operationButtonName: '查看详情',
  operationButtonPath: 'https://vp.teek.top/',
};

// 判断是否为外链
const isExternalLink = (): boolean => {
  const url: string = noticeContent.operationButtonPath
  return /^(https?:\/\/|\/\/)/.test(url);
};

// 获取网页打开方式
const getTargetValue = (): string => {
  return isExternalLink() ? '_blank' : '_self';
};
</script>

<style scoped>
.announcement-card {
  --primary-color: #6366f1;
  --primary-hover: #4f46e5;
}

html.dark .announcement-card {
  --primary-color: #818cf8;
  --primary-hover: #6366f1;
}

.announcement-content {
  padding: 10px;
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

.announcement-text {
  margin: 0 0 20px 0;
  color: var(--text-color);
  line-height: 1.7;
  font-size: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
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
