// useFullscreen.mjs
import { ref, onMounted, onUnmounted } from "vue";

// 检查是否在客户端环境
const isClient = typeof window !== "undefined" && typeof document !== "undefined";

// 定义 fullscreenApi 结构，但不立即访问 document
let fullscreenApi = null;

// 只在客户端初始化 fullscreenApi
if (isClient) {
  fullscreenApi = {
    request:
      document.documentElement.requestFullscreen ||
      document.documentElement.webkitRequestFullscreen ||
      document.documentElement.mozRequestFullScreen ||
      document.documentElement.msRequestFullscreen,

    exit: (
      document.exitFullscreen ||
      document.webkitExitFullscreen ||
      document.mozCancelFullScreen ||
      document.msExitFullscreen
    )?.bind(document),

    element: () =>
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement,

    changeEvent: () => {
      if (document.fullscreenElement !== undefined) return "fullscreenchange";
      if (document.webkitFullscreenElement !== undefined) return "webkitfullscreenchange";
      if (document.mozFullScreenElement !== undefined) return "mozfullscreenchange";
      if (document.msFullscreenElement !== undefined) return "MSFullscreenChange";
      return "fullscreenchange";
    }
  };
}

export function useFullscreen() {
  // 服务端渲染时提供默认值
  const isFullScreen = ref(false);

  const checkFullscreen = () => {
    if (!isClient || !fullscreenApi) return false;
    return !!fullscreenApi.element();
  };

  const updateStatus = () => {
    if (!isClient || !fullscreenApi) return;
    isFullScreen.value = checkFullscreen();
  };

  const toggle = () => {
    if (!isClient || !fullscreenApi) return;

    if (checkFullscreen()) {
      fullscreenApi.exit?.();
    } else {
      const element = document.documentElement;
      fullscreenApi.request?.call(element);
    }
  };

  const handleFullscreenChange = () => {
    updateStatus();
  };

  const handleKeydown = e => {
    if (e.key === "F11" || e.keyCode === 122) {
      requestAnimationFrame(updateStatus);
    }
  };

  onMounted(() => {
    updateStatus();

    const changeEvent = fullscreenApi.changeEvent();
    document.addEventListener(changeEvent, handleFullscreenChange);
    window.addEventListener("keydown", handleKeydown);

    // 保存事件引用以便清理
    window._fullscreenEvent = { changeEvent, handleFullscreenChange, handleKeydown };
  });

  onUnmounted(() => {
    const { changeEvent, handleFullscreenChange, handleKeydown } = window._fullscreenEvent || {};
    if (changeEvent && handleFullscreenChange) {
      document.removeEventListener(changeEvent, handleFullscreenChange);
    }
    if (handleKeydown) {
      window.removeEventListener("keydown", handleKeydown);
    }

    // 清理全局变量
    if (window._fullscreenEvent) {
      delete window._fullscreenEvent;
    }
  });

  // 返回 API，服务端也能正常工作
  return {
    isFullScreen: isFullScreen,
    toggleFullscreen: isClient ? toggle : () => {}, // 服务端提供空函数
    updateFullscreenStatus: isClient ? updateStatus : () => {} // 服务端提供空函数
  };
}
