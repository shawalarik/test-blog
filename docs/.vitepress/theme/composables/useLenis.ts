// hooks/useMyLenis.ts（建议放在 .vitepress/theme/hooks 目录下）
import Lenis from "lenis";
import type { LenisOptions, ScrollToOptions } from "lenis";

// 全局存储 Lenis 实例，避免重复创建（单例模式）
let lenisInstance: Lenis | null = null;
// 存储 requestAnimationFrame 的 ID，用于后续销毁
let rafId: number | null = null;

/**
 * 封装 Lenis 平滑滚动的 Vue 钩子（适配 VitePress）
 * @param options Lenis 配置项（可覆盖默认阻尼等参数）
 * @returns Lenis 实例及核心方法（scrollTo/start/stop/destroy）
 */
export function useMyLenis(options?: Partial<LenisOptions>) {
  // 1. 避免重复初始化（单例模式）
  if (lenisInstance) {
    console.warn("Lenis 实例已存在，无需重复创建");
    return getLenisExports();
  }

  // 2. 默认配置（阻尼感核心参数，可被外部传入的 options 覆盖）
  const defaultOptions: LenisOptions = {
    autoRaf: true, // 是否自动运行 requestAnimationFrame 循环
    lerp: 0.9, // 线性插值 （插值） 强度（介于 0 和 1 之间）
    //duration: 1.5, // 滚动动画的持续时间（以秒为单位）。如果定义了 lerp，则无用
    smoothWheel: true, // 启用鼠标滚轮平滑滚动（必开）
    wheelMultiplier: 0.7, // 鼠标滚轮灵敏度：值越小滚动越慢（增强阻尼）
    touchMultiplier: 0.5, // 移动端触摸灵敏度
    autoResize: true, // 启用浏览器窗口大小变化时自动调整滚动范围
    // 用于滚动动画的缓动函数，我们的默认值是自定义的，但您可以从 Easings.net 中选择一个。如果定义了 lerp，则无用
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  };

  // 3. 合并默认配置与外部传入配置
  const finalOptions = { ...defaultOptions, ...options };

  // 4. 初始化 Lenis（确保在浏览器端执行，避免 VitePress SSR 报错）
  if (typeof window === "undefined") {
    throw new Error("useMyLenis 仅支持客户端执行，请在 onMounted 或客户端入口中调用");
  }
  lenisInstance = new Lenis(finalOptions);


  // 5. 启动 Lenis 动画循环（结合 requestAnimationFrame）
/*  const raf = (time: number) => {
    // 步骤1：让 Lenis 处理当前帧的滚动逻辑
    lenisInstance?.raf(time);
    // 步骤2：预约下一帧继续执行这个循环
    rafId = requestAnimationFrame(raf);
  };
  rafId = requestAnimationFrame(raf);*/

  // 6. 可选：监听滚动事件（暴露给外部，可按需使用）
  const onScroll = (callback: (data: { scroll: number; velocity: number }) => void) => {
    if (!lenisInstance) return;
    lenisInstance.on("scroll", (data) => {
      callback({ scroll: data.scroll, velocity: data.velocity });
    });
  };


  // 7. 封装需要暴露的方法（避免直接操作实例）
  function getLenisExports() {
    return {
      // 暴露 Lenis 实例（谨慎使用，优先用封装的方法）
      lenisInstance,
      /**
       * 滚动到目标位置
       * @param target 目标（元素、选择器、滚动数值）
       * @param options 滚动配置（偏移量、时长等）
       */
      scrollTo: (target: HTMLElement | string | number, scrollOptions?: ScrollToOptions) => {
        lenisInstance?.scrollTo(target, scrollOptions);
      },
      // 暂停平滑滚动（如需要临时禁用）
      stop: () => {
        lenisInstance?.stop();
      },
      // 恢复平滑滚动
      start: () => {
        lenisInstance?.start();
      },
      // 监听滚动事件
      onScroll,
      /**
       * 销毁 Lenis 实例（重要：避免内存泄漏）
       * 需在组件卸载或页面销毁时调用
       */
      destroy: () => {
        if (lenisInstance) {
          lenisInstance.destroy(); // 销毁 Lenis 内部事件监听
          lenisInstance = null;
        }
        if (rafId !== null) {
          cancelAnimationFrame(rafId); // 取消动画循环
          rafId = null;
        }
      },
    };
  }

  return getLenisExports();
}
