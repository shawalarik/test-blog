import { FileInfo } from "vitepress-plugin-auto-frontmatter";
import { BlogCover, Wallpaper } from "../../config/Wallpaper";

/**
 * 定义规则类型
 * 如果第一个分组相同（即第一个斜杠的内容，只匹配一级，自动忽略纯空格），说明已包含目标前缀，不处理直接跳过
 * @param folderName 文件或文件夹名称
 * @param prefix 可选：要添加的前缀，可以是多级的，/test-$uuid4-$uuid2/aaa/$uuid10/，其中 $uuid5 为随机数字加小写字母，最后的数字代表几位，最大十位
 * @param removeLevel 可选：要移除的前缀层级（以 / 分割），适合移除前缀并添加的场景（可以填写一个很大的数，那么就会全部清空再添加前缀）
 * @param clear 可选，是否清空 permalink，适合只想要清空的场景。true=清空，默认false（此时填写prefix无效，clear优先级高）
 */
export interface TransformRule {
  folderName: string;
  prefix?: string;
  removeLevel?: number;
  clear?: boolean;
}

/**
 * 获取路径按 / 分割后的第一个有效分组（忽略空字符串）
 * @param path
 */
const getFirstPathSegment = (path: string): string => {
  const segments = path.split('/').filter(segment => segment.trim() !== '');
  return segments.length > 0 ? segments[0] : '';
};

/**
 * 生成指定长度的随机字符串（数字 + 小写字母）
 * @param length 字符串长度（最大为10）
 * @returns 指定长度的随机字符串
 */
const generateRandomString = (length: number): string => {
  if (length <= 0) return '';
  const maxLen = 10;
  const actualLength = Math.min(length, maxLen); // 最大10位

  const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
  const charsLength = chars.length;
  let result = '';

  for (let i = 0; i < actualLength; i++) {
    result += chars[Math.floor(Math.random() * charsLength)];
  }

  return result;
};

/**
 * 替换字符串中的 $UUID{n} 占位符
 * 支持 $UUID2, $UUID5, $UUID10 等格式
 * - n 超过 10 按 10 处理
 * - 不区分大小写（可选）
 * @param str 原始字符串
 * @returns 替换后的字符串
 * @example
 * replaceUuidPlaceholder('/test/$UUID10') → '/test/a3k9m2x8p1'
 * replaceUuidPlaceholder('/user/$UUID5/$UUID2') → '/user/abc12/de'
 */
const replaceUuidPlaceholder = (str: string): string => {
  return str.replace(/\$UUID(\d+)/gi, (match, numStr) => {
    const length = parseInt(numStr, 10);
    return generateRandomString(length);
  });
};

/**
 * 清理路径中的无效层级（纯空格、空字符串）
 * @param path 原始路径（如 "/    /testawe/a/$uuid1"）
 * @returns 清理后的路径（如 "/testawe/a/$uuid1"）
 */
const cleanPathSpaces = (path: string): string => {
  // 1. 按 / 分割路径
  const segments = path.split('/');
  // 2. 过滤无效层级：排除空字符串和纯空格（trim后为空）
  const validSegments = segments.filter(segment => segment.trim() !== '');
  // 3. 重新拼接路径（确保以 / 开头，结尾无多余 /）
  return validSegments.length > 0 ? `/${validSegments.join('/')}` : '';
};

/**
 * 处理日期：减去8小时抵消时区转换
 * @param frontMatter 原始 frontMatter
 * @returns 转换后的 frontMatter
 */
export const handleDate = (frontMatter: Record<string, any>): void => {
  // 处理日期：减去8小时抵消时区转换
  if (frontMatter.date) {
    const originalDate = new Date(frontMatter.date);
    originalDate.setHours(originalDate.getHours() - 8);
    frontMatter.date = originalDate;
  }
}

/**
 * 处理封面图
 * @param frontMatter 原始 frontMatter
 * @param coverList 封面图列表
 * @param isForce 是否强制替换封面图
 * @returns 转换后的 frontMatter
 */
export const handleCoverImg = (frontMatter: Record<string, any>, coverList: string[], isForce = false): void => {
  // 原始封面图
  let coverImg = frontMatter.coverImg

  // 如果文件本身的 coverImg 不存在于 coverList 中，则随机获取一个
  if (isForce || !coverList.includes(coverImg)) {
    // 随机获取 coverImg
    coverImg = coverList[Math.floor(Math.random() * coverList.length)];
    console.log("文件 coverImg 更改为 =>", coverImg);
    frontMatter.coverImg = coverImg
  }
}

/**
 * 根据规则转换 permalink
 * @param frontMatter 原始 frontMatter
 * @param fileInfo 文件信息
 * @param rules 规则数组
 * @returns 转换后的 frontMatter
 */
export const handleTransformByRules = (frontMatter: Record<string, any>, fileInfo: FileInfo, rules: TransformRule[]): void => {

  // 转换函数：支持移除指定层级前缀后再添加新前缀，新增clear清空逻辑 + UUID占位符替换
  for (const rule of rules) {
    const { folderName, prefix = "", removeLevel, clear = false } = rule; // 解构时给clear默认值false

    // 1. 检查文件路径是否匹配文件夹规则（精确匹配单个文件时，需完全一致）
    if (!fileInfo.relativePath.startsWith(folderName) && folderName !== '*') {
      continue;
    }

    //console.log(`folderName：${folderName}`, `prefix: ${prefix}`, `removeLevel: ${removeLevel}`, `clear: ${clear}`);

    // 处理日期：减去8小时抵消时区转换
/*    if (frontMatter.date) {
      const originalDate = new Date(frontMatter.date);
      originalDate.setHours(originalDate.getHours() - 8);
      frontMatter.date = originalDate;
    }*/

    // 2. 如果clear为true，直接清空permalink并返回（优先级最高）
    if (clear) {
      frontMatter.permalink = ''
      console.log(`匹配规则：${folderName}（clear=true）→ 清空permalink`);
    }

    // 兼容null和undefined，避免空字符串替换报错
    let originalPermalink = frontMatter.permalink;
    if (originalPermalink === null || originalPermalink === undefined) {
      originalPermalink = "";
    }

    let normalizedPrefix = "";
    const finalPrefix = cleanPathSpaces(prefix);
    // 前缀不为空的情况才需要处理
    if (finalPrefix !== "") {
      // 4.替换prefix中的$UUID/$UUID10占位符，'/test/$UUID10' → '/test/a3k9m2x8p1'
      normalizedPrefix = replaceUuidPlaceholder(finalPrefix);
      // 原有：标准化前缀（确保以 / 开头）
      normalizedPrefix = normalizedPrefix.startsWith('/') ? normalizedPrefix : `/${normalizedPrefix}`;

      // 5. 核心调整：按 / 分组，比较第一个前缀是否一致
      // 获取目标前缀的第一个分组（如 "/test/12345" → "test"）
      const targetFirstSegment = getFirstPathSegment(normalizedPrefix);
      // 获取当前 permalink 的第一个分组（如 "/old/path" → "old"）
      const currentFirstSegment = getFirstPathSegment(originalPermalink);

      // 若第一个分组相同，说明已包含目标前缀，无需处理
      if (currentFirstSegment === targetFirstSegment) {
        continue;
      }
    }

    // 7. 处理 permalink：先移除指定层级，再添加新前缀
    if (removeLevel !== undefined && removeLevel > 0) {
      // 分割permalink（处理空字符串和开头的 /）
      const parts = originalPermalink.split('/').filter(part => part);
      // 确保移除的层级不超过实际存在的层级（removeLevel=99时，会移除所有层级，只剩根路径）
      const actualRemoveLevel = Math.min(removeLevel, parts.length);
      // 移除前N个层级，再重新拼接
      const remainingParts = parts.slice(actualRemoveLevel);
      originalPermalink = remainingParts.length > 0
        ? `/${remainingParts.join('/')}`
        : ''; // 移除所有层级后，originalPermalink为 ""
    }

    // 8. 拼接新 permalink 并返回结果（此时prefix已替换占位符）
    const newPermalink = `${normalizedPrefix}${originalPermalink}`;
    frontMatter.permalink = newPermalink

    console.log(`原permalink：${frontMatter.permalink} → 新permalink：${newPermalink}`);
  }
}
