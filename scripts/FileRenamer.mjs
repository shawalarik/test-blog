// FileRenamer.js
import {promises as fs} from "fs";
import path from "path";

class FileRenamer {
    constructor(options = {}) {
        this.options = {
            directory: '.',          // 默认处理当前目录
            extensions: [],          // 需要处理的文件后缀，如 ['.jpg', '.png']
            prefix: 'file',          // 重命名前缀
            startNumber: 1,          // 起始编号
            numberLength: 2,         // 编号最小长度，不足时补零
            dryRun: false,           // 预览模式，不实际执行重命名
            sortFiles: true,         // 是否按文件修改时间排序
            ...options
        };
    }

    // 执行文件重命名
    async execute() {
        try {
            // 验证目录是否存在
            await fs.access(this.options.directory);

            // 读取目录中的文件
            const files = await fs.readdir(this.options.directory);

            // 筛选出符合条件的文件
            const targetFiles = this._filterFiles(files);

            // 排序文件（如果需要）
            const sortedFiles = this.options.sortFiles
                ? await this._sortFilesByModifiedTime(targetFiles)
                : targetFiles;

            // 执行重命名
            const results = await this._renameFiles(sortedFiles);

            return results;
        } catch (error) {
            console.error('执行文件重命名时出错:', error);
            throw error;
        }
    }

    // 筛选符合条件的文件
    _filterFiles(files) {
        return files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return this.options.extensions.includes(ext);
        });
    }

    // 按文件修改时间排序
    async _sortFilesByModifiedTime(files) {
        const fileStats = await Promise.all(
            files.map(file =>
                fs.stat(path.join(this.options.directory, file))
                    .then(stat => ({ file, mtime: stat.mtime }))
                    .catch(() => null)
            )
        );

        // 过滤掉无法获取信息的文件并排序
        return fileStats
            .filter(stat => stat !== null)
            .sort((a, b) => a.mtime - b.mtime)
            .map(stat => stat.file);
    }

    // 生成格式化的编号
    _formatNumber(number) {
        const length = this.options.numberLength;
        return number.toString().padStart(length, '0');
    }

    // 执行文件重命名
    async _renameFiles(files) {
        const results = [];
        let currentNumber = this.options.startNumber;

        for (const file of files) {
            const oldPath = path.join(this.options.directory, file);
            const ext = path.extname(file);

            // 生成新文件名
            const newFileName = `${this.options.prefix}${this._formatNumber(currentNumber)}${ext}`;
            const newPath = path.join(this.options.directory, newFileName);

            // 记录操作结果
            results.push({
                oldName: file,
                newName: newFileName,
                oldPath,
                newPath
            });

            // 如果不是预览模式，则执行实际重命名
            if (!this.options.dryRun) {
                await fs.rename(oldPath, newPath);
            }

            currentNumber++;
        }

        return results;
    }

    // 打印重命名结果
    printResults(results) {
        console.log(`\n共处理 ${results.length} 个文件:`);

        if (this.options.dryRun) {
            console.log("⚠️ 预览模式，未实际执行重命名 ⚠️\n");
        }

        results.forEach((result, index) => {
            const status = this.options.dryRun ? '将重命名' : '已重命名';
            console.log(`${index + 1}. ${status}: ${result.oldName} → ${result.newName}`);
        });

        if (!this.options.dryRun) {
            console.log("\n✅ 文件重命名完成");
        }
    }
}

async function main() {
    // 配置选项
    const options = {
        directory: '../docs/public/blogImg',     // 要处理的目录
        extensions: ['.webp'],    // 要处理的文件后缀
        prefix: '',                     // 文件名前缀
        startNumber: 1,                   // 起始编号
        numberLength: 2,                  // 编号最小长度
        dryRun: false                      // 预览模式，不实际执行重命名
    };

    // 创建文件重命名器实例
    const renamer = new FileRenamer(options);

    try {
        // 执行重命名
        const results = await renamer.execute();

        // 打印结果
        renamer.printResults(results);

        // 如果预览模式满意，可以取消 dryRun 再次执行
        if (options.dryRun) {
            console.log("\n💡 提示: 若对预览结果满意，请将 dryRun 设为 false 再次运行");
        }
    } catch (error) {
        console.error("重命名过程中发生错误:", error);
    }
}

await main();

export default FileRenamer;
