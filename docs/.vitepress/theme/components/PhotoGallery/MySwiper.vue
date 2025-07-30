<template>
  <div class="swiper-container fixed inset-0 bg-black/95 flex items-center justify-center">
    <!-- 关闭按钮 -->
    <button
        class="absolute top-6 right-6 text-white text-4xl hover:text-gray-300 transition-colors z-10"
        @click="close"
    >
      &times;
    </button>

    <!-- Swiper 组件 -->
    <swiper-container
        init="false"
        :initial-slide="initialIndex"
        class="w-full max-w-7xl"
        @swiperslidechange="onSlideChange"
    >
      <swiper-slide v-for="(photo, index) in photos" :key="photo.id || index" class="max-h-[90vh] max-w-full object-contain">
        <div class="flex justify-center items-center h-[90vh]">
          <img
              :src="photo.src"
              :alt="photo.alt"
              class="max-h-[90vh] max-w-full object-contain"
          />
        </div>
      </swiper-slide>
    </swiper-container>

    <!-- 图片信息 -->
    <div class="absolute bottom-8 left-0 right-0 text-center text-white z-10 px-4">
      <h3 class="text-xl font-semibold">{{ currentPhoto.title || '照片' }}</h3>
      <p class="text-gray-300 mt-1">{{ currentPhoto.description || '' }}</p>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, onBeforeUnmount, watch} from 'vue';
import {register} from 'swiper/element/bundle';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

register();

const props = defineProps({
  photos: {
    type: Array,
    required: true
  },
  initialIndex: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['close']);
const currentSlideIndex = ref(props.initialIndex);

// 当前显示的照片（基于当前索引）
const currentPhoto = computed(() => {
  // 处理循环时的索引问题
  const index = currentSlideIndex.value % props.photos.length;
  return props.photos[index >= 0 ? index : 0] || {};
});


// 关闭 Swiper
const close = () => {
  if (swiperInstance) {
    swiperInstance.destroy(); // 关闭 Swiper
    swiperInstance = null;
  }
  emit('close');
};

// swiper实例对象
let swiperInstance = null;

// 监听幻灯片切换事件
const onSlideChange = (e) =>{
  console.log("onSlideChange", swiperInstance?.activeIndex)
  currentSlideIndex.value = swiperInstance?.activeIndex;
}

onMounted(()=>{
  const swiperEl = document.querySelector("swiper-container");

  const swiperParams = {
    centeredSlides: true, // 使活动幻灯片居中
    slidesPerView: 1,     // 一次只显示一张幻灯片
    spaceBetween: 10,     // 幻灯片之间的间距为10px
    loop: false,          // 不启用循环播放
    navigation: true,    // 显示左右箭头导航
    keyboard: {
      enabled: true      // 启用键盘方向键控制
    },
    //watchSlidesProgress: false, // 下方显示查看进度
    /*autoplay: {
      delay: 1000,
      disableOnInteraction: false
    },*/
    effect: 'cube', // 用立方体效果切换幻灯片， 'slide', 'fade', 'cube', 'coverflow', 'flip', 'creative' or 'cards'
    fadeEffect: {
      crossFade: true    // 淡入淡出效果的交叉淡入
    },
    parallax: true,               // 启用视差效果
    lazy: {
      enabled: true,               // 启用图片懒加载
      loadPrevNext: true,          // 加载当前幻灯片的前后一张
    },
    observer: true,               // 监听Swiper元素变化
    observeParents: true,         // 监听父元素变化
    virtualTranslate: true,       // 虚拟位移提高性能
    injectStyles:[ // 注入样式
        `
        @media (max-width: 700px) {
        .swiper-button-prev {
          display: none;
        }

        .swiper-button-next {
          display: none;
        }
      }
        `
    ],
/*    breakpoints: {
      640: {
        slidesPerView: 1,          // 屏幕宽度<=640px时显示1张幻灯片
        spaceBetween: 10,
      },
      1024: {
        slidesPerView: 3,          // 屏幕宽度>=1024px时显示3张幻灯片
        spaceBetween: 20,
      },
    },*/
    on:{
      init(el){
        swiperInstance = el
        console.log("Swiper 初始化完成", swiperInstance)
      },
      keyPress(swiper, keyCode){
        //console.log("Swiper keyPress", swiper, keyCode)
        // 监听esc键
        if (keyCode === 27){
          close();
        }
      }
    }

  }

  // 合并配置
  Object.assign(swiperEl, swiperParams)
  // 初始化 Swiper
  swiperEl.initialize()
})


</script>

<style scoped>
.swiper-container {
  z-index: 100;
}
</style>
