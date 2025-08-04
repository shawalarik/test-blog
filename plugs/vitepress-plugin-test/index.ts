import type { Plugin, ViteDevServer } from "vite";
import createPermalinks, { standardLink } from "./helper";
import { dirname, join } from 'node:path';
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { DefaultTheme } from "vitepress";
import {PermalinkOption} from "./types";
import logger from "./log";

/**
 * 扫描项目目录，生成 permalink
 */
export function VitePluginVitePressRewrites(options: PermalinkOption = {}): Plugin & { name: string } {
    let isExecute = false;

    return {
        name: "vite-plugin-vitepress-rewrites",
        // 在 Vite 配置解析完成后执行
        config(config: any) {
            console.log("configResolved 执行")

            // 防止 vitepress build 时重复执行
            if (isExecute) return;
            isExecute = true;

            // VitePress 的配置在 config.vitepress 中
            const vitepressConfig = config.vitepress;
            if (!vitepressConfig) return;


            console.log("用户的路由重写配置", vitepressConfig.userConfig.rewrites);


            // 动态生成路由重写规则（示例：从 options 或接口获取）
            const dynamicRewrites = generateDynamicRewrites(options, config);

            // 初始化用户原有配置（确保结构完整）
            const originalRewrites = vitepressConfig.userConfig.rewrites || { map: {}, inv: {} };

            // 合并用户手动配置的 rewrites 和动态生成的 rewrites
            vitepressConfig.rewrites = {
                map: {
                    ...originalRewrites.map,  // 保留原有map规则
                    ...dynamicRewrites.map    // 合并动态map规则
                },
                inv: {
                    ...originalRewrites.inv,  // 保留原有inv规则
                    ...dynamicRewrites.inv    // 合并动态inv规则
                }
            };

            logger.info("Injected Route Rewriting Data Successfully. 注入路由重写数据成功!");
        },

        // 仅限 dev 环境生效
        configureServer(server: ViteDevServer) {
            console.log("configureServer 执行")
        },
    };

    // 动态生成路由重写规则的函数（核心逻辑）
    function generateDynamicRewrites(options: PermalinkOption, config: any) {

        const {
            site: { themeConfig, cleanUrls, locales },
            srcDir,
            rewrites,
        } = config.vitepress;

        console.log("options", options)

        const baseDir = options.path ? join(srcDir, options.path) : srcDir;
        const permalinks = createPermalinks({ ...options, path: baseDir }, cleanUrls);
        //console.log("permalinks", permalinks)

        // Key 为 path，Value 为 permalink
        const pathToPermalink: Record<string, string> = {};
        // Key 为 permalink，Value 为 path
        const permalinkToPath: Record<string, string> = {};
        // 国际化多语言 key 数组
        const localesKeys = Object.keys(locales || {});

        for (const [filePath, permalink] of Object.entries(permalinks)) {
            if (permalinkToPath[permalink]) {
                console.warn(`永久链接 '${permalink}' 已存在，其对应的 '${permalinkToPath[permalink]}' 将会被 '${filePath}' 覆盖`)
            }

            pathToPermalink[filePath] = permalink;
            permalinkToPath[permalink] = filePath;
        }

        console.log("============== 路由重写规则生成完毕 ==============")
        console.log("pathToPermalink", pathToPermalink)
        console.log("permalinkToPath", permalinkToPath)

        return {
            map: {
                /*'99.功能页/关于我.md': 'about-me.md',
                '99.功能页/相册.md': 'photo.md'*/
                ...pathToPermalink
            },
            inv: {
                /*'about-me.md': '99.功能页/关于我.md',
                'photo.md': '99.功能页/相册.md'*/
                ...permalinkToPath
            }
        }
    }
}
