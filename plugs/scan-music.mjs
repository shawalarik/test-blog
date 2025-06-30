// vite-plugins/scan-music.js
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import compressor from '../docs/.vitepress/theme/utils/audio/audio-compressor.mjs';

const fsExists = promisify(fs.exists);
const readdir = promisify(fs.readdir);

export function scanMusicPlugin(options = {}) {
    const { musicDir = 'music', scanOnStart = true } = options;
    let resolvedConfig;
    let audioData = [];
    let isServerBuild = true; // 标记是否为服务器构建

    async function compressAndScanMusic() {
        try {
            // 执行压缩
            await compressor.compressDirectory()
                .then(result => {
                    console.log(`压缩统计:`);
                    console.log(`- 总音频文件: ${result.totalFiles}`);
                    console.log(`- 成功压缩: ${result.compressedFiles}`);
                    console.log(`- 跳过文件: ${result.skippedFiles}`);
                })
                .catch(console.error);

            // 扫描压缩后的文件
            const baseDir = path.resolve(resolvedConfig.root, 'public', musicDir);
            const musicPath = path.resolve(baseDir, 'compressed');

            if (!await fsExists(musicPath)) {
                this.warn(`音乐目录 ${musicPath} 不存在`);
                return;
            }

            const files = await readdir(musicPath);
            audioData = [];

            for (const file of files) {
                const ext = path.extname(file).toLowerCase();
                if (!['.mp3', '.wav', '.flac'].includes(ext)) continue;

                const baseName = path.basename(file, ext).replace(/_压缩$/, '');
                const [artist, name] = baseName.split('-').map(s => s.trim());

                let coverUrl = '';
                const coverExts = ['.webp', '.jpg', '.jpeg', '.png'];
                for (const cExt of coverExts) {
                    const coverFilePath = path.join(baseDir, baseName + cExt);
                    if (await fsExists(coverFilePath)) {
                        coverUrl = `/${musicDir}/${baseName}${cExt}`;
                        break;
                    }
                }

                audioData.push({
                    name: name || baseName,
                    artist: artist || '未知艺术家',
                    url: `/${musicDir}/compressed/${file}`,
                    cover: coverUrl,
                });
            }
        } catch (error) {
            console.error("音频处理失败:", error);
            this.warn(`音频处理失败: ${error.message}`);
        }
    }

    return {
        name: 'vite-plugin-scan-music',
        enforce: 'pre',

        // 在配置解析后立即执行
        async configResolved(config) {
            resolvedConfig = config;
            // 判断是否为服务器构建
            isServerBuild = config.build.ssr;

            if (scanOnStart && isServerBuild) {
                console.log("开始扫描和压缩音频文件...");
                await compressAndScanMusic();
                console.log("音频扫描和压缩完成");
            }
        },

        // 压缩并扫描音乐文件
        resolveId(id) {
            if (id === '$internal/music-data') {
                return id;
            }
        },

        // 直接返回已缓存的数据，不再等待压缩
        load(id) {
            if (id === '$internal/music-data') {
                return `export const audio = ${JSON.stringify(audioData, null, 2)};`;
            }
        }
    };
}
