/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // 明确设置为 'class'，否则暗色模式将依赖系统偏好（而非手动添加的 dark 类）
  content: [
    './docs/.vitepress/theme/**/*.{js,ts,vue}',
    './docs/**/*.{md,html}'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
