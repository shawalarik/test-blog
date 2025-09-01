import { spawn } from "child_process";
import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";
import { basename, dirname, join, resolve } from "path";
import { fileURLToPath } from "url";
import { promises as fs } from "fs";
import path from "path";

// 获取当前模块目录（兼容 ESM）
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * 音频压缩工具类
 * 支持批量压缩指定目录下的所有音频文件，跳过compressed目录和已压缩文件
 */
class AudioCompressor {
  // 显式声明类属性
  private options: {
    inputDir: string;
    outputDir: string;
    concurrency: number;
    audioExtensions: string[];
    skipCompressedDir: boolean;
    isCover: boolean;
  };
  private runningTasks: number;
  private taskQueue: string[];
  // 总文件数
  private totalFilesCount: number;
  // 成功压缩的文件数
  private compressedFilesCount: number;
  // 跳过的文件数
  private skippedFilesCount: number;

  constructor(options = {}) {
    // 获取当前模块目录（兼容 ESM）
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    this.options = {
      inputDir: resolve(__dirname, "../public/music"),
      outputDir: resolve(__dirname, "../public/music/compressed"),
      concurrency: 10,
      audioExtensions: [".mp3", ".wav", ".flac", ".aac"],
      skipCompressedDir: true, // 跳过compressed目录
      isCover: false, // 是否覆盖输出
      ...options,
    };

    this.runningTasks = 0;
    this.taskQueue = [];

    // 新增计数器属性
    this.totalFilesCount = 0; // 总文件数
    this.compressedFilesCount = 0; // 成功压缩的文件数
    this.skippedFilesCount = 0; // 跳过的文件数
  }

  /**
   * 初始化压缩器
   */
  async init() {
    // 确保目录存在
    await this.ensureDirectoryExists(this.options.inputDir);
    await this.ensureDirectoryExists(this.options.outputDir);
    console.log(`音频压缩器初始化完成`);
    console.log(`输入目录: ${this.options.inputDir}`);
    console.log(`输出目录: ${this.options.outputDir}`);
  }

  /**
   * 确保目录存在
   */
  async ensureDirectoryExists(directory: string) {
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
  async compressFile(inputPath: string) {
    this.runningTasks++;
    this.totalFilesCount++; // 增加总文件计数
    console.log(`开始压缩: ${inputPath}`);

    try {
      const filename = basename(inputPath);
      const outputFilename = filename.replace(/\.\w+$/, "") + ".opus";
      const outputPath = join(this.options.outputDir, outputFilename);

      if (!this.options.isCover) {
        // 检查输出文件是否已存在
        const outputExists = await this.fileExists(outputPath);
        if (outputExists) {
          this.skippedFilesCount++; // 增加跳过计数
          console.log(`已存在压缩文件: ${outputPath}`);
          this.runningTasks--;
          return outputPath;
        }
      }

      // 执行压缩命令
      const process = spawn(ffmpegPath, [
        "-i",
        inputPath, // 输入文件路径
        "-c:a",
        "libopus", // 使用 LAME MP3 编码器（兼容性好，但压缩效率低于 Opus）libmp3lame 和 libopus
        "-b:a",
        "48k", // 音频比特率（例如 128k）
        "-vn", // 不处理视频流
        "-vbr",
        "on", // 启用可变比特率（VBR），比固定比特率（CBR）更高效
        //"-q:a", "9",                     // 质量等级（0-9，5 约等于 128k CBR）- 与 -b:a 冲突，应移除
        "-compression_level",
        "10", // 压缩级别（0-10，越高体积越小，但可能增加编码时间）
        "-joint_stereo",
        "on", // 启用联合立体声（节省 10-20% 体积，适合人声为主的音乐）
        "-preset",
        "fast", // 加快编码速度（仅对部分编码器有效，LAME 中可能无效）
        "-y", // 覆盖输出文件
        "-threads",
        "0", // 自动使用所有可用线程（提升编码速度）
        "-application",
        "audio", // 针对音频优化（对 LAME 可能无效）
        //"-af", "volume=0.7",             // 直接设置缩放系数（0.5=降低6dB）
        // I: 综合响度目标 (-16dB LUFS 适合流媒体)
        // # LRA: 动态范围 (11dB 是广播标准)
        // TP: 峰值限制 (-1.5dBTP 避免削波)
        // 0.316	-10dB	显著降低，适合背景音
        "-af",
        "loudnorm=I=-16:LRA=11:TP=-1.5,volume=0.1",
        outputPath,
      ]);

      // 处理进程输出（可选：取消注释以显示详细日志）
      /*
            process.stderr.on("data", (data) => {
              console.error(`FFmpeg 错误: ${data.toString()}`);
            });
            */

      process.stdout.on("data", data => {
        // 提取进度时间
        const output = data.toString();
        const timeMatch = output.match(/time=(\d{2}:\d{2}:\d{2})/);
        if (timeMatch) {
          console.log(`压缩进度: ${timeMatch[1]}`);
        }
      });

      // 等待进程结束
      await new Promise((resolve, reject) => {
        process.on("close", code => {
          if (code !== 0) {
            reject(new Error(`压缩失败，错误码: ${code}`));
          } else {
            this.compressedFilesCount++; // 增加成功压缩计数
            console.log(`压缩完成: ${outputPath}`);
            resolve(outputPath);
          }
        });
      });

      this.runningTasks--;
      return outputPath;
    } catch (error) {
      this.runningTasks--;
      if (error instanceof Error) {
        console.error(`压缩文件 ${inputPath} 失败: ${error.message}`);
      } else {
        console.error(`压缩文件 ${inputPath} 失败: 未知错误`, error);
      }
      throw error;
    }
  }

  /**
   * 检查文件是否存在
   */
  async fileExists(filePath: string) {
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
  async scanDirectory(directory: string): Promise<string[]> {
    const files = await fs.readdir(directory);
    const audioFiles = [];

    for (const file of files) {
      const filePath = join(directory, file);
      const stats = await fs.stat(filePath);

      // 跳过compressed目录
      if (this.options.skipCompressedDir && basename(filePath).toLowerCase() === "compressed") {
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
  addTask(filePath: string) {
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
        if (file) {
          await this.compressFile(file);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(`处理任务失败: ${error.message}`);
        } else {
          console.error(`处理任务失败: 未知错误`, error);
        }
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
      audioFiles.forEach((file: string) => this.addTask(file));

      // 等待所有任务完成
      while (this.runningTasks > 0 || this.taskQueue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      console.log("\n所有音频压缩完成");
      return {
        totalFiles: this.totalFilesCount,
        compressedFiles: this.compressedFilesCount,
        skippedFiles: this.skippedFilesCount,
      };
    } catch (error) {
      if (error instanceof Error) {
        console.error("批量压缩失败:", error.message);
      } else {
        console.error("批量压缩失败:", error);
      }
      throw error;
    }
  }
}

// 示例调用
const compressor = new AudioCompressor({
  inputDir: resolve(__dirname, "../../../../public/music"),
  outputDir: resolve(__dirname, "../../../../public/music/compressed"),
  concurrency: 10, // 同时压缩3个文件
  skipCompressedDir: true, // 显式设置跳过compressed目录
  isCover: false,
});

export default compressor;
/*compressor.compressDirectory()
    .then(result => {
        console.log(`压缩统计:`);
        console.log(`- 总音频文件: ${result.totalFiles}`);
        console.log(`- 成功压缩: ${result.compressedFiles}`);
        console.log(`- 跳过文件: ${result.skippedFiles}`);
    })
    .catch(console.error);*/
