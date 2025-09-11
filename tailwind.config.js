/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // 明确设置为 'class'，否则暗色模式将依赖系统偏好（而非手动添加的 dark 类）
  // 关键：告诉 Tailwind 扫描哪些文件中的 Tailwind 工具类（必须覆盖所有用到的文件）
  content: ["./docs/.vitepress/theme/components/**/*.{js,ts,vue}"],
  theme: {
    // 扩展主题（如自定义颜色、字体）
    extend: {}
  },
  // 启用 Tailwind 插件（如 @tailwindcss/forms，可选）
  plugins: []
};
