<template>
  <div
    v-show="isVisible"
    ref="menuDom"
    class="context-menu-var context-menu"
    :style="{
      top: `${y}px`,
      left: `${x}px`
    }"
  >
    <div class="menu-container">
      <!-- 头部区域 -->
      <div class="menu-header">
        <div class="menu-title-icon" v-html="menuData.header?.svg"></div>
        <span style="color: var(--title-text-color)">{{ menuData.header?.title }}</span>

        <!-- 全屏svg -->
        <div
          class="menu-title-icon screen"
          @click="
            toggleFullscreen();
            hideMenu();
          "
        >
          <SvgRender v-show="isFullScreen" :svg="FullScreen" />
          <SvgRender v-show="!isFullScreen" :svg="NonFullScreen" />
        </div>
      </div>

      <!-- 菜单项列表 -->
      <ul class="menu-items">
        <li
          :class="item.subMenu ? 'menu-item has-submenu' : 'menu-item'"
          v-for="item in menuData.body"
          :key="item.text"
          @click="!item.subMenu && handleClick(item, frontmatter, navigateTo)"
        >
          <div class="menu-item-icon" v-html="item.svg"></div>
          <span>{{ item.text }}</span>

          <!-- 如果有子菜单则显示箭头 -->
          <div class="menu-item-arrow" v-if="item.subMenu" v-html="Arrow"></div>

          <ul class="submenu" v-if="item.subMenu">
            <li
              class="submenu-item"
              v-for="subItem in item?.subMenu"
              :key="subItem.text"
              @click.stop="handleClick(subItem, frontmatter, navigateTo)"
            >
              <div class="submenu-item-icon" v-html="subItem.svg"></div>
              <span>{{ subItem.text }}</span>
            </li>
          </ul>
        </li>

        <!-- 分割线 -->
        <li class="menu-divider"></li>

        <!-- 刷新页面 - 特殊样式 -->
        <li v-if="menuData.footer.copy" class="menu-item menu-footer-item" @click="copy">
          <SvgRender class="menu-item-icon" :svg="Copy" />
          <span>复制</span>
        </li>

        <li v-if="menuData.footer.refresh" class="menu-item menu-footer-item" @click="handleRefresh">
          <SvgRender class="menu-item-icon" :svg="Refresh" />
          <span>刷新页面</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useData, useRouter, withBase } from "vitepress"; // 引入 VitePress 路由
import { menuData } from "./MenuData";
import { useFullscreen } from "./useFullscreen";
import SvgRender from "./SvgRender.vue";
import { Arrow, Copy, FullScreen, NonFullScreen, Refresh } from "./SvgList";

const { frontmatter } = useData();
// 自定义处理全屏事件hook
const { isFullScreen, toggleFullscreen } = useFullscreen();

const menuDom = ref<HTMLDivElement | null>(null);

const router = useRouter(); // 获取 VitePress 路由实例
const isVisible = ref(false);
const x = ref(0);
const y = ref(0);

// 检查是否在客户端环境
const isClient = typeof window !== "undefined" || typeof document !== "undefined";

// 显示菜单
const showMenu = (event: MouseEvent) => {
  if (!isClient) return null;

  // 阻止默认菜单行为
  event.preventDefault();

  const element = menuDom.value;
  if (!element) return;

  // 先显示菜单以获取准确尺寸（但不可见）
  element.style.visibility = "hidden";

  // 获取菜单和子菜单的精确尺寸
  const menuRect = element.getBoundingClientRect();
  const submenuWidth = 180; // 子菜单宽度（假设固定）

  // 初始位置为鼠标位置
  let posX = event.clientX;
  let posY = event.clientY;

  // 计算安全区域内的位置
  const rightEdge = window.innerWidth - 10; // 右侧安全边距
  const bottomEdge = window.innerHeight - 10; // 底部安全边距

  // 处理右侧溢出
  if (posX + menuRect.width + submenuWidth > rightEdge) {
    posX = Math.max(10, rightEdge - menuRect.width);
  }

  // 处理底部溢出
  if (posY + menuRect.height > bottomEdge) {
    posY = Math.max(10, bottomEdge - menuRect.height);
  }

  // 应用位置样式
  x.value = posX;
  y.value = posY;
  isVisible.value = true;

  // 延迟显示以确保位置计算完成
  setTimeout(() => {
    element.style.visibility = "visible";
  }, 0);

  // 确保子菜单位置正确显示
  adjustSubmenuPositions();
};

// 调整子菜单位置，防止溢出屏幕
const adjustSubmenuPositions = () => {
  if (!isClient) return null;

  const submenus = document.querySelectorAll(".submenu") as NodeListOf<HTMLElement>;

  // 使用 requestAnimationFrame 批量处理样式更新
  requestAnimationFrame(() => {
    submenus.forEach(submenu => {
      const parentItem = submenu.closest(".has-submenu") as HTMLElement;

      // 重置样式以便获取初始位置
      submenu.style.left = "";
      submenu.style.right = "";
      submenu.style.top = "";

      // 获取父菜单项和子菜单的边界矩形
      const parentRect = parentItem.getBoundingClientRect();
      const submenuRect = submenu.getBoundingClientRect();

      // 计算可用空间
      const availableRight = window.innerWidth - parentRect.right;
      const availableLeft = parentRect.left;
      const availableBottom = window.innerHeight - parentRect.bottom;
      const availableTop = parentRect.top;

      // 水平方向定位
      if (submenuRect.width > availableRight && availableLeft > availableRight) {
        // 右侧空间不足且左侧空间更大，向左显示
        submenu.style.right = "100%";
        submenu.style.left = "auto";
      } else {
        // 默认向右显示
        submenu.style.left = "100%";
        submenu.style.right = "auto";
      }

      // 垂直方向定位
      if (submenuRect.height > availableBottom && availableTop > availableBottom) {
        // 底部空间不足且顶部空间更大，向上显示
        submenu.style.top = `-${submenuRect.height - parentRect.height}px`;
      } else {
        // 默认向下显示
        submenu.style.top = "0";
      }
    });
  });
};

// 窗口大小变化时重新定位菜单
const handleResize = () => {
  if (isVisible.value) {
    adjustSubmenuPositions();
  }
};

// 隐藏菜单
const hideMenu = () => {
  isVisible.value = false;
};

// 导航到指定路由
const navigateTo = (path: string) => {
  if (!isClient) return null;

  // 判断是否为外部链接
  const isExternal = /^https?:\/\//.test(path);

  if (isExternal) {
    // 外部链接使用 window.open 或 window.location.href
    window.open(path, "_blank");
    hideMenu();
    return;
  }

  const targetPath = withBase(path);
  const currentPath = router.route.path;

  console.log(currentPath, "===>", targetPath);
  // 如果当前路径和目标路径相同，则不执行导航
  if (currentPath === targetPath) {
    hideMenu();
    return;
  }

  router.go(targetPath); // 使用 VitePress 路由的 goTo 方法
  hideMenu();
};

// 复制选中的文本内容到剪贴板
const copy = async () => {
  try {
    // 获取用户选中的文本
    const selectedText = window.getSelection()?.toString();

    if (!selectedText) {
      console.log("没有选中任何内容");
      return false;
    }

    // 使用 Clipboard API 复制文本
    await navigator.clipboard.writeText(selectedText);
    console.log("复制成功:", selectedText);
    return true;
  } catch (err) {
    // 处理复制失败的情况（如浏览器不支持或无权限）
    console.error("复制失败:", err);
    return false;
  } finally {
    // 隐藏菜单
    hideMenu();
  }
};

// 刷新页面
const handleRefresh = () => {
  if (!isClient) return null;
  window.location.reload();
  hideMenu();
};

// 点击其他地方时隐藏菜单
const clickOutsideHideMenu = (event: MouseEvent) => {
  const element = menuDom.value;
  if (isVisible.value && element && !element.contains(event.target as Node)) {
    hideMenu();
  }
};

// 键盘ESC键关闭菜单
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    hideMenu();
  }
};

// 统一的菜单点击处理函数（包装器）
const handleClick = (item: any, frontmatter: any, navigateTo: Function) => {
  try {
    // 1. 执行子项原有的点击逻辑
    if (typeof item.click === "function") {
      item.click(frontmatter, navigateTo);
    }
  } finally {
    // 2. 执行统一的后置操作：隐藏菜单
    hideMenu();
  }
};

onMounted(() => {
  document.addEventListener("contextmenu", showMenu);
  document.addEventListener("click", clickOutsideHideMenu);
  document.addEventListener("keydown", handleKeydown);
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  document.removeEventListener("contextmenu", showMenu);
  document.removeEventListener("click", clickOutsideHideMenu);
  document.removeEventListener("keydown", handleKeydown);
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped lang="scss">
.context-menu-var {
  // 主题色
  --theme-color: #a78bfa;
  // 标题颜色
  --title-text-color: #8b5cf6;
  // 头部背景色
  --header-bg-color: linear-gradient(to right, #f9f5ff, #f5f3ff);
  // 文本颜色
  --text-color: #4a4158;
  // 菜单背景颜色
  --menu-bg-color: #ffffff;
  // 菜单项鼠标悬停背景颜色
  --menu-hover-bg-color: #f5f3ff;
  // 分割线颜色
  --divider-bg-color: #f0e6ff;
}

html.dark .context-menu-var {
  // 主题色
  --theme-color: #8b5cf6;
  // 标题颜色
  --title-text-color: #8b5cf6;
  // 头部背景色
  --header-bg-color: linear-gradient(to right, #312a48, #2d2644);
  // 文本颜色
  --text-color: #ffffff;
  // 菜单背景颜色
  --menu-bg-color: #1e1b2d;
  // 菜单项鼠标悬停背景颜色
  --menu-hover-bg-color: #352e54;
  // 分割线颜色
  --divider-bg-color: #372f52;
}

.context-menu {
  position: fixed;
  z-index: 100000;
  user-select: none;
  animation: fadeIn 0.2s ease-out;
  filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.15));
}

// 设置svg颜色
.context-menu :deep(svg) {
  stroke: var(--theme-color);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 菜单容器 */
.menu-container {
  background-color: var(--menu-bg-color);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(139, 92, 246, 0.15);
  border: none;
  min-width: 240px;
  color: var(--text-color);
  position: relative;
  transition: all 0.2s ease;
  animation: slideIn 0.2s ease;
  overflow: visible;
}

html.dark .menu-container {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

/* 菜单头部 */
.menu-header {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  border-bottom: 1px solid var(--border-light-color);
  background: var(--header-bg-color);
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  position: relative;
  font-weight: bold;
}

.menu-title-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  width: 20px;
  height: 20px;
}

.screen {
  margin-left: auto;
  transition: transform 0.3s;
}

.screen:hover {
  stroke: var(--vp-c-brand-1);
  transform: scale(1.15);
}

/* 菜单项 */
.menu-items {
  list-style: none;
  margin: 0;
  padding: 10px;
}

/* 分隔线 */
.menu-divider {
  height: 1px;
  margin: 10px 0;
  background: var(--divider-bg-color);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 5px 14px;
  position: relative;
  font-size: 0.9rem;
  margin: 4px 0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: visible;
}

/* 子菜单箭头旋转 */
.has-submenu:hover .menu-item-arrow {
  transform: rotate(90deg);
}

/* 菜单hover背景等 */
.menu-item:hover {
  background-color: var(--menu-hover-bg-color);
  transform: translateX(2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.menu-item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  width: 18px;
  height: 18px;
  transition: transform 0.3s;
}

/* 图标放大加旋转 */
.menu-item:hover .menu-item-icon {
  transform: scale(1.15) rotate(8deg);
}

/* 鼠标悬停变色逻辑，带有refresh-item类的除外 */
.menu-item:not(.menu-footer-item):hover .menu-item-icon :deep(svg) {
  stroke: var(--vp-c-brand-1);
}

.submenu-item:hover .submenu-item-icon :deep(svg) {
  stroke: var(--vp-c-brand-1);
}

.menu-item-arrow {
  margin-left: auto;
  width: 16px;
  height: 16px;
  opacity: 0.7;
  transition: transform 0.2s ease;
}

/* 子菜单 */
.submenu {
  position: absolute;
  top: 0;
  left: 100%;
  background-color: var(--menu-bg-color);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.12);
  border: none;
  min-width: 180px;
  opacity: 0;
  transform: translateX(-5px);
  transition: all 0.2s ease;
  z-index: 1000;
  padding: 8px;
}

.has-submenu:hover > .submenu {
  opacity: 1;
  transform: translateX(0);
}

html.dark .submenu {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.submenu-item {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  cursor: pointer;
  font-size: 0.85rem;
  border-radius: 8px;
  margin: 3px 0;
  transition: all 0.2s ease;
}

.submenu-item:hover {
  background-color: var(--menu-hover-bg-color);
  transform: translateX(2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.submenu-item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  width: 16px;
  height: 16px;
}

.menu-footer-item {
  margin: 6px 8px;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  box-shadow: 0 3px 12px rgba(139, 92, 246, 0.2);
  color: white;
  transition: all 0.2s ease;
  border: none;
  border-radius: 8px;
}

.menu-footer-item:hover {
  background: linear-gradient(135deg, #a78bfa, #f472b6);
  box-shadow:
    0 5px 15px rgba(139, 92, 246, 0.4),
    0 2px 5px rgba(236, 72, 153, 0.3);
  //transform: translateY(-2px) translateX(2px);
}
</style>
