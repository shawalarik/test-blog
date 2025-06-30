// vite-plugins/scan-music.js
import fs from "fs";

import path, {resolve} from "path";
function scanMusicPlugin(options = {}) {
    const { musicDir = 'music', outputFile = 'musicData.js' } = options;

    return {
        name: 'vite-plugin-scan-music',
        enforce: 'pre', // 确保插件在早期执行

        // 构建前扫描目录
        async buildStart() {
            try {
                // 解析音乐目录路径（基于项目根目录）
                const musicPath = resolve(__dirname, '..', 'docs', 'public', musicDir);
                const outputPath = resolve(__dirname, '..', 'docs', '.vitepress', 'config', outputFile);

                console.log(musicPath);
                console.log(outputPath);
                // 检查目录是否存在
                if (!fs.existsSync(musicPath)) {
                    this.warn(`音乐目录 ${musicPath} 不存在`);
                    return;
                }

                // 扫描目录获取文件列表
                const files = fs.readdirSync(musicPath);
                const audioData = [];

                // 过滤音频文件并生成数据
                files.forEach(file => {
                    const ext = path.extname(file).toLowerCase();
                    if (['.mp3', '.wav', '.flac'].includes(ext)) {
                        const baseName = path.basename(file, ext);
                        const [artist, name] = baseName.split('-').map(s => s.trim());

                        // 生成封面路径（假设封面与音频同名，扩展名为 webp/jpg/png）
                        let coverPath = '';
                        const coverExts = ['.webp', '.jpg', '.jpeg', '.png'];
                        for (const ext of coverExts) {
                            const coverFile = path.join(musicPath, baseName + ext);
                            if (fs.existsSync(coverFile)) {
                                coverPath = `/${musicDir}/${baseName}${ext}`;
                                break;
                            }
                        }

                        audioData.push({
                            name: name || baseName,
                            artist: artist || '未知艺术家',
                            url: `/${musicDir}/${file}`,
                            cover: coverPath,
                            theme: 'rgb(127, 218, 180)' // 默认主题色
                        });
                    }
                });

                // 生成输出文件内容
                const fileContent = `export const audio = ${JSON.stringify(audioData, null, 2)};\n`;

                // 确保输出目录存在
                const outputDir = path.dirname(outputPath);
                if (!fs.existsSync(outputDir)) {
                    fs.mkdirSync(outputDir, { recursive: true });
                }

                // 写入文件
                fs.writeFileSync(outputPath, fileContent);

                // 设置环境变量
                process.env.VITE_MUSIC_DATA_PATH = outputPath;
                this.info(`成功生成音乐数据文件: ${outputFile}`);

            } catch (error) {
                this.error(`扫描音乐目录失败: ${error.message}`);
            }
        }
    };
};

export { scanMusicPlugin };

