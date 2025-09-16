import { ref, onMounted, onUnmounted } from "vue";

// 检查是否在客户端环境
const isClient = typeof window !== "undefined" && typeof document !== "undefined";

// 定义 fullscreenApi 结构
let fullscreenApi: any = null;

if (isClient) {
  fullscreenApi = {
    request:
      document.documentElement.requestFullscreen ||
      document.documentElement.webkitRequestFullscreen ||
      document.documentElement.mozRequestFullScreen ||
      document.documentElement.msRequestFullscreen,

    exit: (
      document.exitFullscreen ||
      document.documentElement.webkitExitFullscreen ||
      document.documentElement.mozCancelFullScreen ||
      document.documentElement.msExitFullscreen
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
  const isFullScreen = ref(false);
  // 用组件内部变量存储事件引用（替代window挂载）
  let eventRefs: {
    changeEvent: string | null;
    handleFullscreenChange: (() => void) | null;
    handleKeydown: ((e: KeyboardEvent) => void) | null;
  } = {
    changeEvent: null,
    handleFullscreenChange: null,
    handleKeydown: null
  };

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

  // 定义事件处理函数（用变量存储以便卸载）
  const handleFullscreenChange = () => {
    updateStatus();
  };

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "F11" || e.keyCode === 122) {
      requestAnimationFrame(updateStatus);
    }
  };

  onMounted(() => {
    updateStatus();

    if (isClient && fullscreenApi) {
      const changeEvent = fullscreenApi.changeEvent();
      // 存储事件引用到内部变量
      eventRefs = {
        changeEvent,
        handleFullscreenChange,
        handleKeydown
      };
      // 绑定事件
      document.addEventListener(changeEvent, handleFullscreenChange);
      window.addEventListener("keydown", handleKeydown);
    }
  });

  onUnmounted(() => {
    if (isClient) {
      // 从内部变量获取事件引用并卸载
      const { changeEvent, handleFullscreenChange, handleKeydown } = eventRefs;
      if (changeEvent && handleFullscreenChange) {
        document.removeEventListener(changeEvent, handleFullscreenChange);
      }
      if (handleKeydown) {
        window.removeEventListener("keydown", handleKeydown);
      }
      // 清空内部变量
      eventRefs = {
        changeEvent: null,
        handleFullscreenChange: null,
        handleKeydown: null
      };
    }
  });

  return {
    isFullScreen: isFullScreen,
    toggleFullscreen: isClient ? toggle : () => {},
    updateFullscreenStatus: isClient ? updateStatus : () => {}
  };
}
