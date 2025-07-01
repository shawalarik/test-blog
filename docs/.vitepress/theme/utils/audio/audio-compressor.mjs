import { spawn } from "child_process";
import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";
import { basename, dirname, join, resolve } from "path";
import { fileURLToPath } from "url";
import { promises as fs } from "fs";
import path from 'path';


// 获取当前模块目录（兼容 ESM）
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * 音频压缩工具类
 * 支持批量压缩指定目录下的所有音频文件，跳过compressed目录和已压缩文件
 */
class AudioCompressor {
    constructor(options = {}) {
        // 获取当前模块目录（兼容 ESM）
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);

        this.options = {
            inputDir: resolve(__dirname, "../public/music"),
            outputDir: resolve(__dirname, "../public/music/compressed"),
            bitrate: "64k",
            concurrency: 10,
            audioExtensions: [".mp3", ".wav", ".flac", ".aac"],
            skipCompressedDir: true, // 跳过compressed目录
            ...options
        };

        this.runningTasks = 0;
        this.taskQueue = [];

        // 新增计数器属性
        this.totalFilesCount = 0;      // 总文件数
        this.compressedFilesCount = 0;  // 成功压缩的文件数
        this.skippedFilesCount = 0;     // 跳过的文件数
    }

    /**
     * 初始化压缩器
     */
    async init() {
        // 确保输出目录存在
        await this.ensureDirectoryExists(this.options.outputDir);
        console.log(`音频压缩器初始化完成`);
        console.log(`输入目录: ${this.options.inputDir}`);
        console.log(`输出目录: ${this.options.outputDir}`);
    }

    /**
     * 确保目录存在
     */
    async ensureDirectoryExists(directory) {
        try {
            await fs.access(directory);
        } catch {
            await fs.mkdir(directory, { recursive: true });
            console.log(`创建目录: ${directory}`);
        }
    }

    /**
     * 压缩单个音频文件
     */
    async compressFile(inputPath) {
        this.runningTasks++;
        this.totalFilesCount++;  // 增加总文件计数
        console.log(`开始压缩: ${inputPath}`);

        try {
            const filename = basename(inputPath);
            const outputFilename = filename.replace(/\.\w+$/, "") + "_压缩.mp3";
            const outputPath = join(this.options.outputDir, outputFilename);

            // 检查输出文件是否已存在
            const outputExists = await this.fileExists(outputPath);
            if (outputExists) {
                this.skippedFilesCount++;  // 增加跳过计数
                console.log(`已存在压缩文件: ${outputPath}`);
                this.runningTasks--;
                return outputPath;
            }

            // 执行压缩命令
            const process = spawn(ffmpegPath, [
                "-i", inputPath,
                "-b:a", this.options.bitrate,
                "-vn",         // 不处理视频流
                "-preset", "fast", // 加快编码速度
                "-y",          // 覆盖输出文件
                outputPath
            ]);

            // 处理进程输出（可选：取消注释以显示详细日志）
            /*
            process.stderr.on("data", (data) => {
              console.error(`FFmpeg 错误: ${data.toString()}`);
            });
            */

            process.stdout.on("data", (data) => {
                // 提取进度时间
                const output = data.toString();
                const timeMatch = output.match(/time=(\d{2}:\d{2}:\d{2})/);
                if (timeMatch) {
                    console.log(`压缩进度: ${timeMatch[1]}`);
                }
            });

            // 等待进程结束
            await new Promise((resolve, reject) => {
                process.on("close", (code) => {
                    if (code !== 0) {
                        reject(new Error(`压缩失败，错误码: ${code}`));
                    } else {
                        this.compressedFilesCount++;  // 增加成功压缩计数
                        console.log(`压缩完成: ${outputPath}`);
                        resolve(outputPath);
                    }
                });
            });

            this.runningTasks--;
            return outputPath;
        } catch (error) {
            this.runningTasks--;
            console.error(`压缩文件 ${inputPath} 失败: ${error.message}`);
            throw error;
        }
    }

    /**
     * 检查文件是否存在
     */
    async fileExists(filePath) {
        try {
            await fs.access(filePath);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * 扫描目录获取所有音频文件，跳过compressed目录
     */
    async scanDirectory(directory) {
        const files = await fs.readdir(directory);
        const audioFiles = [];

        for (const file of files) {
            const filePath = join(directory, file);
            const stats = await fs.stat(filePath);

            // 跳过compressed目录
            if (this.options.skipCompressedDir && basename(filePath).toLowerCase() === "compressed") {
                console.log(`跳过目录: ${filePath}`);
                continue;
            }

            if (stats.isDirectory()) {
                // 递归扫描子目录
                const subDirFiles = await this.scanDirectory(filePath);
                audioFiles.push(...subDirFiles);
            } else {
                const ext = path.extname(file).toLowerCase();
                if (this.options.audioExtensions.includes(ext)) {
                    audioFiles.push(filePath);
                }
            }
        }

        return audioFiles;
    }

    /**
     * 添加任务到队列
     */
    addTask(filePath) {
        this.taskQueue.push(filePath);
        this.processQueue();
    }

    /**
     * 处理任务队列
     */
    async processQueue() {
        while (this.taskQueue.length > 0 && this.runningTasks < this.options.concurrency) {
            const file = this.taskQueue.shift();
            try {
                await this.compressFile(file);
            } catch (error) {
                console.error(`处理任务失败: ${error.message}`);
            }
        }
    }

    /**
     * 批量压缩目录中的音频文件
     */
    async compressDirectory() {
        try {
            await this.init();

            // 扫描所有音频文件，跳过compressed目录
            const audioFiles = await this.scanDirectory(this.options.inputDir);
            console.log(`\n发现 ${audioFiles.length} 个音频文件`);

            // 添加所有文件到任务队列
            audioFiles.forEach(file => this.addTask(file));

            // 等待所有任务完成
            while (this.runningTasks > 0 || this.taskQueue.length > 0) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            console.log("\n所有音频压缩完成");
            return {
                totalFiles: this.totalFilesCount,
                compressedFiles: this.compressedFilesCount,
                skippedFiles: this.skippedFilesCount
            };
        } catch (error) {
            console.error("批量压缩失败:", error.message);
            throw error;
        }
    }
}

// 示例调用
const compressor = new AudioCompressor({
    inputDir: resolve(__dirname, "../../../../public/music"),
    outputDir: resolve(__dirname, "../../../../public/music/compressed"),
    bitrate: "64k",
    concurrency: 10, // 同时压缩3个文件
    skipCompressedDir: true // 显式设置跳过compressed目录
});

export default compressor
/*compressor.compressDirectory()
    .then(result => {
        console.log(`压缩统计:`);
        console.log(`- 总音频文件: ${result.totalFiles}`);
        console.log(`- 成功压缩: ${result.compressedFiles}`);
        console.log(`- 跳过文件: ${result.skippedFiles}`);
    })
    .catch(console.error);*/
