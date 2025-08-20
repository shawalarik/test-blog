<template>
  <!-- 重要公告卡片 -->
  <div class="announcement-card" v-if="isVisible">
    <!-- 关闭按钮 -->
<!--    <button class="close-btn" @click="isVisible = false">
      <svg t="1755659636151" class="icon" viewBox="0 0 1027 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6058" width="16" height="16"><path d="M1002.17475 21.837105a74.286973 74.286973 0 0 0-105.103821 0L513.901173 405.006861 130.629374 21.837105a74.491058 74.491058 0 0 0-105.103821 105.103821L408.797352 510.212725 25.525553 893.382481a74.389015 74.389015 0 1 0 105.103821 105.103821L513.901173 615.316546l383.271799 383.169756a73.878803 73.878803 0 0 0 105.103821 0 74.18493 74.18493 0 0 0 0-105.103821L619.004994 510.212725l383.271799-383.271799a74.286973 74.286973 0 0 0 0-105.103821" fill="#999999" p-id="6059"></path></svg>
    </button>-->

    <!-- 公告头部 -->
    <div class="announcement-header">
      <div class="announcement-tag">
        <span>{{ noticeContent.title }}</span>
      </div>
      <span class="announcement-date">{{ noticeContent.date }}</span>
    </div>

    <!-- 公告内容 -->
    <div class="announcement-content">
      <h3 class="announcement-title">{{ noticeContent.subtitle }}</h3>

      <p class="announcement-text">
        {{ noticeContent.content }}
      </p>

      <!-- 附件提示 -->
      <div class="announcement-attachment">
        <span>{{ noticeContent.fileName }}</span>
      </div>

      <!-- 底部操作区 -->
      <div class="announcement-footer">
        <a class="announcement-button" :href="noticeContent.operationButtonPath" :target="getTargetValue()" >
          <span>{{ noticeContent.operationButtonName }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 控制组件显示状态
const isVisible = ref(true);

// 公告内容类型定义
interface NoticeContent {
  title: string;
  date: string;
  subtitle: string;
  content: string;
  fileName?: string;
  operationButtonName: string;
  operationButtonPath: string;
}

// 公告内容
const noticeContent: NoticeContent = {
  title: '重要公告',
  date: '2025-8-20',
  subtitle: '关于系统升级维护的通知',
  content: '为提供更稳定的服务体验，系统将于10月20日00:00-06:00进行升级维护，期间可能无法正常访问。请您提前做好准备，由此带来的不便，敬请谅解。',
  fileName: '',
  operationButtonName: '查看详情',
  operationButtonPath: 'https://dl-web.top/',
};

/**
 * 判断是否为外部链接
 * @returns 是否为外部链接
 */
const isExternalLink = (): boolean => {
  const url: string = noticeContent.operationButtonPath
  return /^(https?:\/\/|\/\/)/.test(url);
};

const getTargetValue = (): string => {
  if (isExternalLink()){
    return '_blank';
  }
};
</script>

<style scoped>
.announcement-card {
  width: var(--tk-home-card-width);
  margin: 0 auto;
  background-color: var(--tk-bg-color-elm);
  border-radius: var(--tk-home-card-border-radius);
  box-shadow: var(--tk-card-shadow);
  overflow: hidden;
  transition: box-shadow var(--tk-transition-duration-slow), transform var(--tk-transition-duration-slow);
  position: relative; /* 为关闭按钮提供定位基准 */
}

.announcement-card:hover {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  transform: translateY(-3px);
}

/* 关闭按钮样式 */
.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10; /* 确保按钮在最上层 */
}

.close-btn:hover .icon {
  fill: #dc2626; /* hover时变红 */
}

.announcement-header {
  background-color: rgba(59, 130, 246, 0.05);
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.announcement-tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 999px;
  background-color: rgba(249, 115, 22, 0.1);
  color: #F97316;
  font-size: 12px;
  font-weight: 500;
}

.announcement-date {
  color: #6b7280;
  font-size: 14px;
}

.announcement-content {
  padding: 12px 20px;
}

.announcement-title {
  margin: 0 0 12px 0;
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  transition: color 0.3s ease;
}

.announcement-card:hover .announcement-title {
  color: #3B82F6;
}

.announcement-text {
  margin: 0 0 16px 0;
  color: #374151;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.announcement-attachment {
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
  color: #3B82F6;
  font-size: 14px;
}

.announcement-footer {
  padding-top: 12px;
  border-top: 1px solid #f3f4f6;
  display: flex;
  justify-content: end;
  align-items: center;
}

.announcement-button {
  display: inline-flex;
  align-items: center;
  background: none;
  border: none;
  color: #3B82F6;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s ease;
  padding: 0;
  gap: 6px;
}

.announcement-button:hover {
  color: #2563eb;
}
</style>
