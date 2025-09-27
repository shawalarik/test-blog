// 配置需要密码保护的URL模式（支持通配符*）
const protectedRoutes = [
  "/private/*", // 保护/private下的所有页面
  "/secret-docs", // 保护特定页面
  "/admin/*" // 保护/admin下的所有页面
];

// 通配符匹配函数
const matchPattern = (path: string, pattern: string): boolean => {
  // 精确匹配
  if (pattern === path) return true;

  // 通配符匹配
  if (pattern.endsWith("*")) {
    const basePattern = pattern.slice(0, -1);
    return path.startsWith(basePattern);
  }

  return false;
};

// 检查路径是否需要密码保护
const isProtectedPath = (path: string): boolean => {
  return protectedRoutes.some(pattern => matchPattern(path, pattern));
};

// 检查页面是否已验证
const isPageVerified = (pageId: string): boolean => {
  const verifiedPages = JSON.parse(localStorage.getItem("vpVerifiedPages") || "{}");
  return !!verifiedPages[pageId];
};

