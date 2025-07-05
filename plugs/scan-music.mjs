// vite-plugins/scan-music.js
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import compressor from '../docs/.vitepress/theme/utils/audio/audio-compressor.mjs';

const fsExists = promisify(fs.exists);
const readdir = promisify(fs.readdir);

export function scanMusicPlugin(options = {}) {
    const { musicDir = 'music', showDetail = false } = options;
    const musicExt = ['.mp3', '.wav', '.flac', '.opus'];
    let resolvedConfig;
    let audioData = [];
    let isProduction = process.env.NODE_ENV === 'production';
    let isServerBuild = false;
    let compressionExecuted = false; // 标记压缩是否已执行

    async function processAudioFiles() {
        try {
            // 开发模式：直接使用原始音频文件
            if (!isProduction) {
                console.log("开发模式：直接使用原始音频文件")
                await processOriginalAudio();
                return;
            }

            // 生产模式：执行压缩并使用压缩后的音频
            if (!compressionExecuted) {
                console.log("生产模式：执行压缩并使用压缩后的音频")
                await compressor.compressDirectory()
                    .then(result => {
                        console.log(`压缩统计:`);
                        console.log(`- 总音频文件: ${result.totalFiles}`);
                        console.log(`- 成功压缩: ${result.compressedFiles}`);
                        console.log(`- 跳过文件: ${result.skippedFiles}`);
                    })
                await processCompressedAudio();
                compressionExecuted = true;
            }
        } catch (error) {
            console.error("音频处理失败:", error);
            this.warn(`音频处理失败: ${error.message}`);
        }
    }

    // 处理原始音频文件（开发模式）
    async function processOriginalAudio() {
        const baseDir = path.resolve(resolvedConfig.root, 'public', musicDir);
        const originalPath = baseDir;
        audioData = [];

        if (!await fsExists(originalPath)) {
            this.warn(`原始音乐目录 ${originalPath} 不存在`);
            return;
        }

        const files = await readdir(originalPath);
        for (const file of files) {
            const ext = path.extname(file).toLowerCase();
            if (!musicExt.includes(ext)) continue;

            const baseName = path.basename(file, ext);
            const [artist, name] = baseName.split('-').map(s => s.trim());

            let coverUrl = '';
            const coverExts = ['.webp', '.jpg', '.jpeg', '.png'];
            for (const cExt of coverExts) {
                const coverFilePath = path.join(originalPath, baseName + cExt);
                if (await fsExists(coverFilePath)) {
                    coverUrl = `/${musicDir}/${baseName}${cExt}`;
                    break;
                }
            }

            audioData.push({
                name: name || baseName,
                artist: artist || '未知艺术家',
                url: `/${musicDir}/${file}`, // 直接使用原始文件
                cover: coverUrl,
            });
        }
    }

    // 处理压缩后的音频文件（生产模式）
    async function processCompressedAudio() {
        const baseDir = path.resolve(resolvedConfig.root, 'public', musicDir);
        const musicPath = path.resolve(baseDir, 'compressed');
        const compressedCoverDir = path.resolve(musicPath); // 压缩目录下的封面文件夹
        audioData = [];

        // 创建压缩封面目录（如果不存在）
        await fs.promises.mkdir(compressedCoverDir, { recursive: true });

        if (!await fsExists(musicPath)) {
            this.warn(`压缩音乐目录 ${musicPath} 不存在`);
            return;
        }

        const files = await readdir(musicPath);
        for (const file of files) {
            const ext = path.extname(file).toLowerCase();
            if (!musicExt.includes(ext)) continue;

            const baseName = path.basename(file, ext).replace(/_压缩$/, '');
            const [artist, name] = baseName.split('-').map(s => s.trim());

            let coverUrl = '';
            let coverFileName = '';
            const coverExts = ['.webp', '.jpg', '.jpeg', '.png'];

            for (const cExt of coverExts) {
                const originalCoverPath = path.join(baseDir, baseName + cExt);

                if (await fsExists(originalCoverPath)) {
                    // 构建压缩目录中的封面路径
                    coverFileName = `${baseName}${cExt}`;
                    const compressedCoverPath = path.join(compressedCoverDir, coverFileName);

                    // 复制封面图片到压缩目录
                    await fs.promises.copyFile(originalCoverPath, compressedCoverPath);

                    // 更新封面 URL 指向新位置
                    coverUrl = `/${musicDir}/compressed/${coverFileName}`;
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
    }

    return {
        name: 'vite-plugin-scan-music',
        enforce: 'pre',

        async configResolved(config) {
            resolvedConfig = config;
            isServerBuild = config.build.ssr;
            isProduction = process.env.NODE_ENV === 'production';
            console.log(`音频扫描插件-当前环境: ${isProduction ? '生产' : '开发'} | 构建类型: ${isServerBuild ? '服务器' : '客户端'}`);
            // 开发模式：直接使用原始音频文件
            // 生产模式：只在服务器构建时处理音频
            if (!isProduction || !isServerBuild) {
                console.log("开始处理音频文件...");
                await processAudioFiles();
                console.log("音频处理完成");
                if (showDetail) {
                    console.log("音频数据", audioData);
                }
            }
        },

        resolveId(id) {
            if (id === '$internal/music-data') {
                return id;
            }
        },

        load(id) {
            if (id === '$internal/music-data') {

                if (!isServerBuild) {
                    console.log(`\n加载音频数据: ${audioData.length} 首`)
                    return `export const audio = ${JSON.stringify(audioData, null, 2)};`;
                }else {
                    return `export const audio = [];`;
                }
            }
        }
    };
}
