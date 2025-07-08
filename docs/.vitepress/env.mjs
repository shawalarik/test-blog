// utils/config.js
const config = {
    development: {
        VISIT_URL: '/api/visit/record', // 访问信息统计api
        DEBUG: true,
        TITLE: "威威 Blog"
    },
    production: {
        VISIT_URL: '/api/visit/record', // 访问信息统计api
        DEBUG: false,
        TITLE: "威威 Blog"
    }
};



export default config;
