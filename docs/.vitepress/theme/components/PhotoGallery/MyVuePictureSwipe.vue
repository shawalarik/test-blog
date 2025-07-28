<template>
  <div>
    <div class="my-gallery" ><!-- itemscope itemtype="http://schema.org/ImageGallery" -->
      <figure
          class="gallery-thumbnail"
          v-show="index === 0 || !singleThumbnail"
          itemprop="associatedMedia"
          itemscope
          itemtype="http://schema.org/ImageObject"
          v-for="(item, index) in items"
          :key="index"
      >
        <a
            v-show="nbThumbnailsDisplayed === -1 || index < nbThumbnailsDisplayed"
            :href="item.src"
            itemprop="contentUrl"
            :data-size="`${item.w}x${item.h}`"
            :title="item.title"
        >
          <img
              :src="item.thumbnail"
              :alt="item.alt"
              itemprop="thumbnail"
          />
        </a>
      </figure>
    </div>

    <div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="pswp__bg"></div>
      <div class="pswp__scroll-wrap">
        <div class="pswp__container">
          <div class="pswp__item"></div>
          <div class="pswp__item"></div>
          <div class="pswp__item"></div>
        </div>
        <div class="pswp__ui pswp__ui--hidden">
          <div class="pswp__top-bar">
            <div class="pswp__counter"></div>
            <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>

            <button
                class="pswp__button pswp__button--rotate pswp__button--rotate--left"
                title="Rotate left"
                v-if="options.rotationOn"
                @click="rotate(-90)"
            ></button>
            <button
                class="pswp__button pswp__button--rotate pswp__button--rotate--right"
                title="Rotate right"
                v-if="options.rotationOn"
                @click="rotate(90)"
            ></button>

            <button class="pswp__button pswp__button--share" title="Share"></button>
            <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>
            <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>
            <div class="pswp__preloader">
              <div class="pswp__preloader__icn">
                <div class="pswp__preloader__cut">
                  <div class="pswp__preloader__donut"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
            <div class="pswp__share-tooltip"></div>
          </div>
          <button
              class="pswp__button pswp__button--arrow--left"
              title="Previous (arrow left)"
              @click="resetAngle"
          ></button>
          <button
              class="pswp__button pswp__button--arrow--right"
              title="Next (arrow right)"
              @click="resetAngle"
          ></button>
          <div class="pswp__caption">
            <div class="pswp__caption__center"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import PhotoSwipe from 'photoswipe/dist/photoswipe';
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';
import 'photoswipe/dist/photoswipe.css';
import 'photoswipe/dist/default-skin/default-skin.css';

// 定义 props
const props = defineProps({
  items: {
    type: Array,
    default: () => [
      {
        src: 'http://via.placeholder.com/600x400',
        thumbnail: 'http://via.placeholder.com/64x64',
        w: 600,
        h: 400,
        alt: 'some numbers on a grey background'
      }
    ]
  },
  options: {
    type: Object,
    default: () => ({})
  },
  singleThumbnail: {
    type: Boolean,
    default: false
  },
  nbThumbnailsDisplayed: {
    type: Number,
    default: -1
  }
});

// 定义响应式变量
const pswp = ref(null);
const angle = ref(0);

// 定义事件
const emit = defineEmits(['open', 'close']);

// 旋转方法
const rotate = (newAngle) => {
  angle.value += newAngle;
  document.querySelectorAll('.pswp__img').forEach(i => {
    i.style.transform = `rotate(${angle.value}deg)`;
  });
};

// 重置旋转角度
const resetAngle = () => {
  angle.value = 0;
  document.querySelectorAll('.pswp__img').forEach(i => {
    i.style.transform = `rotate(${angle.value}deg)`;
  });
};

// 初始化 PhotoSwipe
onMounted(() => {
  console.log("初始化 PhotoSwipe")
  const initPhotoSwipeFromDOM = (gallerySelector) => {
    // 解析缩略图元素数据
    const parseThumbnailElements = (el) => {
      const thumbElements = el.childNodes;
      const numNodes = thumbElements.length;
      const items = [];

      for (let i = 0; i < numNodes; i++) {
        const figureEl = thumbElements[i];
        if (figureEl.nodeType !== 1) continue;

        const linkEl = figureEl.children[0];
        const size = linkEl.getAttribute('data-size').split('x');

        const item = {
          src: linkEl.getAttribute('href'),
          w: parseInt(size[0], 10),
          h: parseInt(size[1], 10),
          title: linkEl.getAttribute('title'),
          el: figureEl
        };

        if (figureEl.children.length > 1) {
          item.title = figureEl.children[1].innerHTML;
        }

        if (linkEl.children.length > 0) {
          item.msrc = linkEl.children[0].getAttribute('src');
        }

        items.push(item);
      }

      return items;
    };

    // 查找最近的父元素
    const closest = (el, fn) => {
      return el && (fn(el) ? el : closest(el.parentNode, fn));
    };

    // 缩略图点击事件
    const onThumbnailsClick = (e) => {
      e.preventDefault();
      const eTarget = e.target || e.srcElement;

      const clickedListItem = closest(eTarget, (el) => {
        return el.tagName && el.tagName.toUpperCase() === 'FIGURE';
      });

      if (!clickedListItem) return;

      const clickedGallery = clickedListItem.parentNode;
      const childNodes = clickedListItem.parentNode.childNodes;
      const numChildNodes = childNodes.length;
      let nodeIndex = 0;
      let index = 0;

      for (let i = 0; i < numChildNodes; i++) {
        if (childNodes[i].nodeType !== 1) continue;
        if (childNodes[i] === clickedListItem) {
          index = nodeIndex;
          break;
        }
        nodeIndex++;
      }

      if (index >= 0) {
        openPhotoSwipe(index, clickedGallery);
      }
      return false;
    };

    // 解析URL中的哈希值
    const photoswipeParseHash = () => {
      const hash = window.location.hash.substring(1);
      const params = {};

      if (hash.length < 5) return params;

      const vars = hash.split('&');
      for (let i = 0; i < vars.length; i++) {
        if (!vars[i]) continue;
        const pair = vars[i].split('=');
        if (pair.length < 2) continue;
        params[pair[0]] = pair[1];
      }

      if (params.gid) {
        params.gid = parseInt(params.gid, 10);
      }

      return params;
    };

    // 打开PhotoSwipe
    const openPhotoSwipe = (index, galleryElement, disableAnimation = false, fromURL = false) => {
      const pswpElement = galleryElement.parentElement.querySelector('.pswp');
      const items = parseThumbnailElements(galleryElement);

      const options = {
        galleryUID: galleryElement.getAttribute('data-pswp-uid'),
        getThumbBoundsFn: (index) => {
          const thumbnail = items[index].el.getElementsByTagName('img')[0];
          const pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
          const rect = thumbnail.getBoundingClientRect();
          return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
        },
        ...props.options
      };

      if (fromURL) {
        if (options.galleryPIDs) {
          for (let j = 0; j < items.length; j++) {
            if (items[j].pid == index) {
              options.index = j;
              break;
            }
          }
        } else {
          options.index = parseInt(index, 10) - 1;
        }
      } else {
        options.index = parseInt(index, 10);
      }

      if (isNaN(options.index)) return;
      if (disableAnimation) options.showAnimationDuration = 0;

      const gallery = new PhotoSwipe(
          pswpElement,
          PhotoSwipeUI_Default,
          items,
          options
      );

      // 处理图片尺寸
      gallery.listen('gettingData', (index, item) => {
        if (item.w < 1 || item.h < 1) {
          const img = new Image();
          img.onload = function() {
            item.w = this.width;
            item.h = this.height;
            gallery.invalidateCurrItems();
            gallery.updateSize(true);
          };
          img.src = item.src;
        }
      });

      gallery.init();
      pswp.value = gallery;

      // 触发事件
      emit('open');

      // 关闭时触发事件
      gallery.listen('destroy', () => {
        emit('close');
      });
    };

    // 绑定事件
    const galleryElements = document.querySelectorAll(gallerySelector);
    galleryElements.forEach((el, i) => {
      el.setAttribute('data-pswp-uid', i + 1);
      el.addEventListener('click', onThumbnailsClick);
    });

    // 从URL打开
    const hashData = photoswipeParseHash();
    if (hashData.pid && hashData.gid) {
      openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
    }
  };

  // 初始化
  initPhotoSwipeFromDOM('.my-gallery');
});
</script>

<style scoped>
.pswp__top-bar {
  text-align: right;
}
.pswp__caption__center {
  text-align: center;
}
.pswp__button--rotate {
  background: url(./icons/rotate.png) 0 0 no-repeat;
  background-size: 62px 24px;
}
.pswp__button--rotate--left {
  background-position: 8px 10px;
}
.pswp__button--rotate--right {
  background-position: -26px 10px;
}
.gallery-thumbnail {
  display: inline;
  margin: 5px;
}

</style>
