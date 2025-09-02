// utils/config.js
const config = {
  development: {
    BLOG_URL: "http://localhost:5173/",
    SITE_ID: "LOCALHOST",
    VISIT_URL: "/api/visit/record", // 访问信息统计api
    DEBUG: true,
    TITLE: "威威 Blog"
  },
  production: {
    BLOG_URL: "https://dl-web.top/",
    SITE_ID: "dl-web.top",
    VISIT_URL: "/api/visit/record", // 访问信息统计api
    DEBUG: false,
    TITLE: "威威 Blog"
  }
};

export default config;
