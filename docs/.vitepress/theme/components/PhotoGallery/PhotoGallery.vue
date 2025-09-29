<template>
  <div class="photo-gallery">
    <!-- 标题 -->
    <h2 class="gallery-title">我的相册</h2>

    <!-- 分类筛选 -->
    <div class="category-filter">
      <button
        v-for="category in categories"
        :key="category"
        :class="['filter-btn', activeCategory === category ? 'filter-btn--active' : '']"
        @click="activeCategory = category"
      >
        {{ category }}
      </button>
    </div>

    <!-- 图片网格 -->
    <div class="photo-grid">
      <div
        v-for="(photo, index) in filteredPhotos"
        :key="photo.id || index"
        class="photo-item"
        @click="openSwiper(index)"
      >
        <div class="photo-wrapper">
          <img :src="photo.thumbnail || photo.src" :alt="photo.alt" class="photo-img" loading="lazy" />
          <!-- 悬停信息 -->
          <div class="photo-overlay">
            <h3 class="overlay-title">{{ photo.title || "未命名" }}</h3>
            <p class="overlay-desc">{{ photo.description || "" }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 使用 Swiper 组件 -->
    <MySwiper v-if="showSwiper" :photos="filteredPhotos" :initial-index="currentIndex" @close="closeSwiper" />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import MySwiper from "./MySwiper.vue"; // 导入 Swiper 组件
import { photos } from "./PhotoGalleryData";

// 响应式状态
const showSwiper = ref(false); // 控制 Swiper 显示
const currentIndex = ref(0); // 当前显示的图片索引
const activeCategory = ref("全部"); // 当前选中的分类

// 计算属性：筛选当前分类的图片
const filteredPhotos = computed(() => {
  if (activeCategory.value === "全部") {
    return photos.value;
  }
  return photos.value.filter(photo => photo.category === activeCategory.value);
});

// 计算属性：获取所有分类（含"全部"）
const categories = computed(() => {
  const categorySet = new Set(photos.value.map(photo => photo.category));
  return ["全部", ...Array.from(categorySet)];
});

// 打开轮播的方法（点击图片时调用）
const openSwiper = index => {
  showSwiper.value = true; // 显示轮播
  currentIndex.value = index;
  document.body.style.overflow = "hidden"; // 禁止页面滚动
};

// 方法：关闭 Swiper
const closeSwiper = () => {
  showSwiper.value = false; // 隐藏轮播
  document.body.style.overflow = ""; // 恢复页面滚动（之前为了禁止滚动设置了 overflow: hidden）
};
</script>

<style scoped>
/* 相册容器 */
.photo-gallery {
  max-width: 90rem; /* 对应原 max-w-[90rem] */
  margin: 0 auto; /* 对应原 mx-auto */
  padding: 2rem 1rem; /* 对应原 px-4 py-8，移动端适配调整 */
}

/* 相册标题 */
.gallery-title {
  /* 响应式字体大小：1.5rem ~ 2.5rem，对应原 clamp(1.5rem,3vw,2.5rem) */
  font-size: 1.5rem;
  font-weight: 700; /* 对应原 font-bold */
  text-align: center; /* 对应原 text-center */
  margin-bottom: 2rem; /* 对应原 mb-8 */
  color: #1f2937; /* 对应原 text-gray-800 */
  transition: color 0.3s ease;
}

html.dark .gallery-title {
  color: #ffffff; /* 对应原 dark:text-white */
}

/* 分类筛选容器 */
.category-filter {
  display: flex;
  flex-wrap: wrap; /* 对应原 flex-wrap */
  justify-content: center; /* 对应原 justify-center */
  gap: 0.75rem; /* 对应原 gap-3 */
  margin-bottom: 2rem; /* 对应原 mb-8 */
}

/* 筛选按钮基础样式 */
.filter-btn {
  padding: 0.5rem 1rem; /* 对应原 px-4 py-2 */
  border-radius: 9999px; /* 对应原 rounded-full */
  font-size: 0.875rem; /* 对应原 text-sm */
  transition: all 0.3s ease; /* 对应原 transition-all duration-300 */
  border: none;
  cursor: pointer;
  background-color: #f3f4f6; /* 对应原 bg-gray-100 */
  color: #374151; /* 对应原 text-gray-700 */
}

/* 筛选按钮 hover 状态 */
.filter-btn:hover:not(.filter-btn--active) {
  background-color: #e5e7eb; /* 对应原 hover:bg-gray-200 */
}

/* 筛选按钮激活状态 */
.filter-btn--active {
  background-color: #3b82f6; /* 对应原 bg-blue-500 */
  color: #ffffff; /* 对应原 text-white */
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06); /* 对应原 shadow-md */
}

/* 深色模式：筛选按钮样式调整 */
html.dark .filter-btn:not(.filter-btn--active) {
  background-color: #1f2937; /* 对应原 dark:bg-gray-800 */
  color: #e5e7eb; /* 对应原 dark:text-gray-200 */
}
html.dark .filter-btn:hover:not(.filter-btn--active) {
  background-color: #374151; /* 对应原 dark:hover:bg-gray-700 */
}

/* 图片网格容器 */
.photo-grid {
  display: grid;
  /* 响应式列数：1列 → 2列 → 3列 → 4列，对应原 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 */
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem; /* 对应原 gap-4 */
}

/* 平板端（sm）：2列 */
@media (min-width: 640px) {
  .photo-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 桌面端（md）：3列 + 更大间距 */
@media (min-width: 768px) {
  .photo-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem; /* 对应原 md:gap-6 */
  }
}

/* 大屏桌面端（lg）：4列 */
@media (min-width: 1024px) {
  .photo-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* 图片项容器 */
.photo-item {
  cursor: pointer;
  overflow: hidden; /* 对应原 overflow-hidden */
  border-radius: 0.5rem; /* 对应原 rounded-lg */
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06); /* 对应原 shadow-md */
  transition: all 0.3s ease; /* 对应原 transition-all duration-300 */
}

/* 图片项 hover 状态 */
.photo-item:hover {
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05); /* 对应原 hover:shadow-xl */
}

/* 图片包裹层（控制宽高比） */
.photo-wrapper {
  position: relative;
  aspect-ratio: 5/3; /* 对应原 aspect-[5/3] */
  overflow: hidden; /* 对应原 overflow-hidden */
}

/* 图片样式 */
.photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 对应原 object-cover */
  transition: transform 0.7s ease; /* 对应原 transition-transform duration-700 */
}

/* 图片 hover 缩放效果 */
.photo-item:hover .photo-img {
  transform: scale(1.1); /* 对应原 group-hover:scale-110 */
}

/* 图片悬停信息层 */
.photo-overlay {
  position: absolute;
  inset: 0; /* 对应原 inset-0 */
  /* 渐变背景：从下到上透明，对应原 bg-gradient-to-t from-black/70 to-transparent */
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  opacity: 0; /* 初始透明 */
  transition: opacity 0.3s ease; /* 对应原 transition-opacity duration-300 */
  display: flex;
  flex-direction: column;
  justify-content: flex-end; /* 对应原 justify-end */
  padding: 1rem; /* 对应原 p-4 */
}

/* 图片 hover 时显示信息层 */
.photo-item:hover .photo-overlay {
  opacity: 1; /* 对应原 group-hover:opacity-100 */
}

/* 悬停标题 */
.overlay-title {
  color: #ffffff; /* 对应原 text-white */
  font-weight: 500; /* 对应原 font-medium */
  font-size: 1.125rem; /* 对应原 text-lg */
}

/* 悬停描述 */
.overlay-desc {
  color: rgba(255, 255, 255, 0.8); /* 对应原 text-white/80 */
  font-size: 0.875rem; /* 对应原 text-sm */
  margin-top: 0.25rem; /* 对应原 mt-1 */
}

/* 深色模式：确保覆盖层样式一致（无需额外调整，因已用 rgba 和白色） */
html.dark .photo-overlay {
  /* 深色模式下渐变更明显，可选增强对比 */
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
}
</style>
