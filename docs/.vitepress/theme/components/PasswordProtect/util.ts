import { ref, watch } from "vue";
import { useData, useRouter } from "vitepress";

// 类型定义
export interface ProtectedRoute {
  path: string;
  password: string;
}

const LOCAL_STORAGE_KEY: string = "tk:vpVerifiedPages";

// 默认保护规则（你也可以从配置传入）
export const DEFAULT_PROTECTED_ROUTES: ProtectedRoute[] = [
  { path: "/private/*", password: "secret123" },
  { path: "/about-me", password: "111" },
  { path: "/job", password: "222" },
  { path: "/front/*", password: "222" }
];

// 通配符匹配函数
const matchPattern = (path: string, pattern: string): boolean => {
  if (pattern === path) return true;

  if (pattern.endsWith("/*")) {
    const base = pattern.slice(0, -1);
    // 严格模式：只匹配一级子路径（/private/abc ✅，/private/abc/def ❌）
    //return path.startsWith(base) && path.split("/").filter(Boolean).length === base.split("/").filter(Boolean).length;
    // 若需宽松模式（匹配任意深度），改用：
    return path.startsWith(base);
  }

  return false;
};

// 根据路径获取所需密码（优先级：frontmatter > 路由规则）
const getRequiredPassword = (
  currentPath: string,
  frontmatterPassword: string | undefined,
  protectedRoutes: ProtectedRoute[] = DEFAULT_PROTECTED_ROUTES
): string | null => {
  // 1. Frontmatter 优先
  if (frontmatterPassword) {
    return frontmatterPassword;
  }

  // 2. 检查路径规则
  for (const rule of protectedRoutes) {
    if (matchPattern(currentPath, rule.path)) {
      return rule.password;
    }
  }

  return null;
};

// 获取已验证页面集合
const getVerifiedPages = (): Set<string> => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return new Set(data ? JSON.parse(data) : []);
  } catch (e) {
    console.warn("Failed to parse verified pages from localStorage", e);
    return new Set();
  }
};

// 标记页面为已验证
const markPageAsVerified = (pageId: string): void => {
  const verified = getVerifiedPages();
  verified.add(pageId);
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([...verified]));
  } catch (e) {
    console.warn("Failed to save verified pages to localStorage", e);
  }
};

// 检查当前页面是否需要显示密码组件
const shouldShowPassword = (
  currentPath: string,
  frontmatterPassword: string | undefined,
  protectedRoutes?: ProtectedRoute[]
): { show: boolean; password: string | null; pageId: string } => {
  const requiredPassword = getRequiredPassword(currentPath, frontmatterPassword, protectedRoutes);
  const pageId = currentPath;

  if (requiredPassword) {
    const isVerified = getVerifiedPages().has(pageId);
    if (!isVerified) {
      return { show: true, password: requiredPassword, pageId };
    }
  }

  return { show: false, password: null, pageId };
};

export function usePasswordProtection(customRoutes?: ProtectedRoute[]) {
  const { frontmatter } = useData();
  const router = useRouter();

  const showPassword = ref(false);
  const currentPassword = ref("");
  const currentPageId = ref("");

  const checkProtection = (path: string) => {
    const fmPassword = frontmatter.value?.password as string | undefined;
    const routes = customRoutes || DEFAULT_PROTECTED_ROUTES;
    const { show, password, pageId } = shouldShowPassword(path, fmPassword, routes);

    showPassword.value = show;
    if (show) {
      currentPassword.value = password!;
      currentPageId.value = pageId;
    }
  };

  // 监听路由变化
  watch(
    () => router.route.path,
    newPath => {
      checkProtection(newPath);
    },
    { immediate: true }
  );

  const handleVerified = (success: boolean) => {
    if (success && currentPageId.value) {
      markPageAsVerified(currentPageId.value);
      showPassword.value = false;
    }
  };

  return {
    showPassword,
    currentPassword,
    currentPageId,
    handleVerified
  };
}
