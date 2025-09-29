import { ref, watch } from "vue";
import { useData, useRouter } from "vitepress";
import { isClient } from "vitepress-theme-teek";

// ========================= 核心配置（务必修改！）=========================
const ENCRYPTION_KEY = "your-32-char-key-here-12345678";
const SALT = new TextEncoder().encode("vp-protect-salt-2024");
const PBKDF2_ITERATIONS = 1000;
const LOCAL_STORAGE_KEY: string = "tk:vpVerifiedPages";

// 默认保护规则（支持前缀匹配一次性验证）
export const DEFAULT_PROTECTED_ROUTES: ProtectedRoute[] = [
  { path: "/private/*", password: "secret123" },
  { path: "/archives", password: "123" }
];

// ========================= 类型定义 =========================
export interface ProtectedRoute {
  path: string;
  password: string;
}

// ========================= 工具函数：Base64编解码 =========================
const uint8ToBase64 = (array: Uint8Array): string => {
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

const base64ToUint8 = (str: string): Uint8Array => {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = str.length % 4;
  if (pad) str += "=".repeat(4 - pad);

  const binary = atob(str);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }
  return array;
};

// ========================= 加密核心函数 =========================
const generateVerifyKey = async (key: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${key}::${ENCRYPTION_KEY}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return uint8ToBase64(new Uint8Array(hashBuffer));
};

const getEncryptionKey = async (): Promise<CryptoKey> => {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(ENCRYPTION_KEY), { name: "PBKDF2" }, false, [
    "deriveKey"
  ]);

  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: SALT, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
};

const encryptData = async (data: string[]): Promise<string> => {
  try {
    const key = await getEncryptionKey();
    const encoder = new TextEncoder();
    const jsonStr = JSON.stringify(data);
    const dataBuffer = encoder.encode(jsonStr);
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, dataBuffer);
    const encryptedArray = new Uint8Array(encrypted);
    const authTag = encryptedArray.slice(-16);
    const ciphertext = encryptedArray.slice(0, -16);

    return `${uint8ToBase64(iv)}|${uint8ToBase64(ciphertext)}|${uint8ToBase64(authTag)}`;
  } catch (e) {
    console.error("加密失败:", e);
    throw new Error("验证状态存储失败");
  }
};

const decryptData = async (encryptedStr: string): Promise<string[]> => {
  try {
    const [ivBase64, ciphertextBase64, authTagBase64] = encryptedStr.split("|");
    if (!ivBase64 || !ciphertextBase64 || !authTagBase64) {
      throw new Error("数据格式无效");
    }

    const iv = base64ToUint8(ivBase64);
    const ciphertext = base64ToUint8(ciphertextBase64);
    const authTag = base64ToUint8(authTagBase64);
    // 组合密文和认证标签
    const encrypted = new Uint8Array([...ciphertext, ...authTag]);

    const key = await getEncryptionKey();
    // eslint-disable-next-line no-undef
    const decryptedBuffer = await crypto.subtle.decrypt({ name: "AES-GCM", iv: iv as BufferSource }, key, encrypted);
    const decryptedStr = new TextDecoder().decode(decryptedBuffer);
    return JSON.parse(decryptedStr) as string[];
  } catch (e) {
    console.warn("解密失败:", e);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    return [];
  }
};

// ========================= 核心逻辑：按路径前缀管理验证状态 =========================
/**
 * 1. 匹配当前路径对应的保护规则（返回规则+前缀标识）
 * 例：/front/docs → 匹配 /front/* 规则，返回 { rule, prefix: "/front" }
 */
const matchProtectedRule = (
  currentPath: string,
  protectedRoutes: ProtectedRoute[]
): { rule: ProtectedRoute | null; prefix: string | null } => {
  for (const rule of protectedRoutes) {
    // 处理前缀匹配（如 /front/*）
    if (rule.path.endsWith("/*")) {
      const prefix = rule.path.slice(0, -1); // 提取前缀：/front/* → /front
      // 验证当前路径是否以该前缀开头（且不是前缀本身，避免匹配 /front）
      if (currentPath.startsWith(prefix) && currentPath !== prefix) {
        return { rule, prefix };
      }
    }
    // 处理精确匹配（如 /archives）
    else if (currentPath === rule.path) {
      return { rule, prefix: rule.path }; // 精确路径的前缀就是自身
    }
  }
  return { rule: null, prefix: null };
};

/**
 * 2. 获取已验证的前缀/路径集合
 */
const getVerifiedPrefixes = async (): Promise<Set<string>> => {
  if (!isClient) return new Set();

  try {
    const encryptedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!encryptedData) return new Set();

    const verifiedHashes = await decryptData(encryptedData);
    return new Set(verifiedHashes);
  } catch (e) {
    console.warn("获取验证状态失败:", e);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    return new Set();
  }
};

/**
 * 3. 标记前缀/路径为已验证（一次性验证核心：存储前缀而非单个页面）
 */
const markPrefixAsVerified = async (prefix: string): Promise<void> => {
  if (!isClient) return;

  try {
    // 生成前缀的加密哈希（避免手动篡改）
    const prefixHash = await generateVerifyKey(prefix);
    const verifiedPrefixes = await getVerifiedPrefixes();
    verifiedPrefixes.add(prefixHash);

    // 加密存储前缀哈希集合
    const encryptedData = await encryptData(Array.from(verifiedPrefixes));
    localStorage.setItem(LOCAL_STORAGE_KEY, encryptedData);
  } catch (e) {
    console.warn("标记验证状态失败:", e);
    throw new Error("验证状态存储失败，请重试");
  }
};

/**
 * 4. 检查当前页面是否需要密码（按前缀验证）
 */
const shouldShowPassword = async (
  currentPath: string,
  frontmatterPassword: string | undefined,
  protectedRoutes: ProtectedRoute[] = DEFAULT_PROTECTED_ROUTES
): Promise<{ show: boolean; password: string | null; verifyPrefix: string | null }> => {
  // 优先处理frontmatter密码（单个页面独立验证）
  if (frontmatterPassword) {
    const verifyKey = currentPath; // 精确页面路径
    const verifiedPrefixes = await getVerifiedPrefixes();
    const verifyKeyHash = await generateVerifyKey(verifyKey);
    const isVerified = verifiedPrefixes.has(verifyKeyHash);

    return {
      show: !isVerified,
      password: frontmatterPassword,
      verifyPrefix: verifyKey // 存储的是单个页面路径
    };
  }

  // 处理路由规则（前缀/精确匹配）
  const { rule, prefix } = matchProtectedRule(currentPath, protectedRoutes);
  if (!rule || !prefix) {
    return { show: false, password: null, verifyPrefix: null };
  }

  // 检查该前缀是否已验证
  const verifiedPrefixes = await getVerifiedPrefixes();
  const prefixHash = await generateVerifyKey(prefix);
  const isVerified = verifiedPrefixes.has(prefixHash);

  return {
    show: !isVerified,
    password: rule.password,
    verifyPrefix: prefix // 存储的是前缀（如 /front）
  };
};

// ========================= 核心Hook =========================
export function usePasswordProtection(customRoutes?: ProtectedRoute[]) {
  const { frontmatter } = useData();
  const router = useRouter();

  const showPassword = ref(false);
  const currentPassword = ref("");
  const currentVerifyPrefix = ref<string | null>(null); // 改为存储「验证前缀」而非页面ID
  const isChecking = ref(false);

  // 检查页面保护状态
  const checkProtection = async (path: string) => {
    if (!isClient) return;

    isChecking.value = true;
    try {
      const fmPassword = frontmatter.value?.password as string | undefined;
      const routes = customRoutes || DEFAULT_PROTECTED_ROUTES;
      const result = await shouldShowPassword(path, fmPassword, routes);

      showPassword.value = result.show;
      currentPassword.value = result.password || "";
      currentVerifyPrefix.value = result.verifyPrefix; // 记录需要验证的前缀
    } catch (e) {
      console.error("检查页面保护状态失败:", e);
    } finally {
      isChecking.value = false;
    }
  };

  // 监听路由变化（切换/front/*下页面时自动检查）
  watch(
    () => router.route.path,
    async newPath => {
      if (isClient) {
        await checkProtection(newPath);
      }
    },
    { immediate: true }
  );

  // 处理验证成功（标记前缀为已验证）
  const handleVerified = async (success: boolean) => {
    if (success && currentVerifyPrefix.value && !isChecking.value) {
      try {
        await markPrefixAsVerified(currentVerifyPrefix.value);
        showPassword.value = false;
      } catch (e) {
        alert("验证成功，但状态存储失败，请重新尝试");
      }
    }
  };

  return {
    showPassword,
    currentPassword,
    currentVerifyPrefix,
    isChecking,
    handleVerified
  };
}
