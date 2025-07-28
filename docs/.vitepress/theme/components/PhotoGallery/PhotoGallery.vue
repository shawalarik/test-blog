<template>
  <div class="photo-gallery max-w-7xl mx-auto px-4 py-8">
    <!-- 标题 -->
    <h2 class="text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-center mb-8 text-gray-800">我的相册</h2>

    <!-- 分类筛选 -->
    <div class="flex flex-wrap justify-center gap-3 mb-8">
      <button
          v-for="category in categories"
          :key="category"
          :class="[
          'px-4 py-2 rounded-full transition-all duration-300 text-sm',
          activeCategory === category
            ? 'bg-blue-500 text-white shadow-md'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        ]"
          @click="activeCategory = category"
      >
        {{ category }}
      </button>
    </div>

    <!-- 图片网格 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      <div
          v-for="(photo, index) in filteredPhotos"
          :key="photo.id || index"
          class="content-auto group cursor-pointer overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-xl"
          @click="openModal(index)"
      >
        <div class="relative aspect-[5/3] overflow-hidden">
          <img
              :src="photo.thumbnail || photo.src"
              :alt="photo.alt"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
          />
          <!-- 悬停信息 -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <h3 class="text-white font-medium text-lg">{{ photo.title || '未命名' }}</h3>
            <p class="text-white/80 text-sm mt-1">{{ photo.description || '' }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 使用模态框组件 -->
    <GalleryModal
        :visible="showModal"
        :images="filteredPhotos"
        :currentIndex="currentIndex"
        @close="showModal = false"
        @update:currentIndex="currentIndex = $event"
    />
  </div>
</template>

<script setup>
import {ref, computed} from 'vue';
import GalleryModal from './GalleryModal.vue'; // 导入模态框组件
import {photos} from './PhotoGalleryData';

// 响应式状态
const showModal = ref(false); // 控制模态框显示
const currentIndex = ref(0); // 当前显示的图片索引
const activeCategory = ref('全部'); // 当前选中的分类

// 计算属性：筛选当前分类的图片
const filteredPhotos = computed(() => {
  if (activeCategory.value === '全部') {
    return photos.value;
  }
  return photos.value.filter(photo => photo.category === activeCategory.value);
});

// 计算属性：获取所有分类（含"全部"）
const categories = computed(() => {
  const categorySet = new Set(photos.value.map(photo => photo.category));
  return ['全部', ...Array.from(categorySet)];
});

// 方法：打开模态框
const openModal = (index) => {
  currentIndex.value = index;
  showModal.value = true;
  // 打开时禁止页面滚动
  document.body.style.overflow = 'hidden';
};

// 方法：关闭模态框
const closeModal = () => {
  showModal.value = false;
  // 关闭时恢复页面滚动
  document.body.style.overflow = '';
};

// 方法：切换到上一张
const prevImage = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};

// 方法：切换到下一张
const nextImage = () => {
  if (currentIndex.value < filteredPhotos.value.length - 1) {
    currentIndex.value++;
  }
};
</script>

<style scoped>
/* 仅补充少量自定义样式，大部分依赖 Tailwind 工具类 */
.photo-gallery {
  /* 可添加组件整体样式 */
}

/* 适配小屏幕的按钮位置调整 */
@media (max-width: 640px) {
  .text-4xl {
    font-size: 2rem;
  }

  button[class*="left-[-2rem]"] {
    left: 0.5rem;
  }

  button[class*="right-[-2rem]"] {
    right: 0.5rem;
  }
}
</style>
