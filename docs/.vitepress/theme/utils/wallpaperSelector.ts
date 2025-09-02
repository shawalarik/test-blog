// 先安装依赖：npm install natural-sort
import fs from "fs";
import path from "path";
import naturalSort from "natural-sort";

const sourceDir = path.resolve(process.cwd(), "docs", "public", "home");
const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp"];

let files = [];
try {
  files = fs.readdirSync(sourceDir);
} catch (err) {
  console.error(`❌ 找不到目录: ${sourceDir}`);
  throw err;
}

// 使用 natural-sort 实现更智能的排序
files.sort(naturalSort());

const wallpaperImages = files
  .filter(file => imageExtensions.includes(path.extname(file).toLowerCase()))
  .map(file => `/home/${file}`);

console.log(`✅ 已生成图片列表：${wallpaperImages.length} 张`);
console.log(wallpaperImages);

export default wallpaperImages;
