// plugins/clean-dist.js
import { rm, readdir, access, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

/**
 * 清理 dist/music 目录，仅保留 compressed 子目录
 * 优化点：
 * 1. 完善错误处理，兼容 compressed 目录不存在的场景
 * 2. 增加路径校验，避免误删非目标目录
 * 3. 优化日志输出，区分不同操作状态
 * 4. 精简代码逻辑，使用解构和早期 return 提升可读性
 * 使用 Promise.allSettled 实现并发删除，同时捕获所有结果
 */
export function cleanDistMusic() {
    return {
        name: 'clean-dist-music',
        apply: 'build',
        async closeBundle() {
            const distDir = path.resolve(process.cwd(), 'dist');
            const musicDir = path.join(distDir, 'music');
            const compressedDir = path.join(musicDir, 'compressed');

            if (!existsSync(distDir)) {
                console.log('⚠️ dist 目录不存在，跳过清理');
                return;
            }

            if (!existsSync(musicDir)) {
                console.log('⚠️ dist/music 目录不存在，无需清理');
                return;
            }

            console.log(`⏳ 开始清理 ${musicDir}（仅保留 compressed 目录）`);

            try {
                if (!existsSync(compressedDir)) {
                    await mkdir(compressedDir, { recursive: true });
                    console.log(`ℹ️ 已创建缺失的 compressed 目录: ${compressedDir}`);
                } else {
                    await access(compressedDir);
                }

                const items = await readdir(musicDir, { withFileTypes: true });
                const itemsToDelete = items
                    .filter(item => item.name !== 'compressed')
                    .map(item => path.join(musicDir, item.name));

                if (itemsToDelete.length === 0) {
                    console.log('✅ dist/music 目录已无多余内容，无需清理');
                    return;
                }

                // 核心修复：简化 Promise 回调，避免嵌套
                const results = await Promise.allSettled(
                    itemsToDelete.map(itemPath => {
                        // 直接返回 rm 的 Promise，不额外嵌套对象
                        return rm(itemPath, { recursive: true, force: true })
                            .then(() => itemPath) // 成功时直接返回路径
                            .catch(error => ({ error, path: itemPath })); // 失败时返回错误和路径
                    })
                );

                // 处理结果（适配新的结构）
                const successfulDeletions = [];
                const failedDeletions = [];

                results.forEach(result => {
                    if (result.status === 'fulfilled') {
                        // 成功：result.value 就是路径
                        successfulDeletions.push(result.value);
                    } else {
                        // 失败：result.reason 包含 error 和 path
                        failedDeletions.push(result.reason);
                    }
                });

                // 输出成功日志
                successfulDeletions.forEach(path => {
                    console.log(`✅ 已删除: ${path}`);
                });

                // 输出失败日志
                failedDeletions.forEach(({ path, error }) => {
                    console.error(`❌ 删除失败: ${path} (${error.message})`);
                });

                // 汇总结果
                if (failedDeletions.length > 0) {
                    console.error(`⚠️ 清理完成，成功删除 ${successfulDeletions.length} 项，失败 ${failedDeletions.length} 项`);
                } else {
                    console.log(`✅ 清理完成，共删除 ${successfulDeletions.length} 项，仅保留 compressed 目录`);
                }

            } catch (error) {
                console.error(`❌ 清理过程出错: ${error.message}`);
            }
        },
    };
}
