// plugins/clean-dist.js
import { rm } from 'fs/promises';
import path from 'path';
import fs from 'fs/promises';

export function cleanDistMusic() {
    return {
        name: 'clean-dist-music',
        apply: 'build', // 仅在构建时执行
        closeBundle: async () => { // Vite 等效于 Rollup 的 writeBundle
            try {
                const distDir = path.resolve(process.cwd(), 'dist');
                const musicDir = path.join(distDir, 'music');
                const compressedDir = path.join(musicDir, 'compressed');

                console.log("⏳ 正在清理 dist/music 目录...", musicDir)

                // 确保 compressed 目录存在
                await fs.access(compressedDir);

                // 读取 music 目录下的所有内容
                const items = await fs.readdir(musicDir);

                // 删除非 compressed 内容
                for (const item of items) {
                    if (item === 'compressed') continue;

                    const itemPath = path.join(musicDir, item);
                    await rm(itemPath, { recursive: true, force: true });
                    console.log(`已删除: ${itemPath}`);
                }

                console.log("✅ dist/music 清理完成，仅保留 compressed 目录");
            } catch (error) {
                console.error("❌ 清理 dist/music 时出错:", error);
            }
        }
    };
}
