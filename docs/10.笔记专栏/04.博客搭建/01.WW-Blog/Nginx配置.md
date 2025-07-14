---
date: 2025-07-13 17:58:51
title: Nginx配置
permalink: /pages/nginx-config
categories:
  - 笔记专栏
  - 博客搭建
  - WW-Blog
coverImg: /home/bg11.webp
---

{{titile}}

本文分享一下本博客使用`Nginx`反向代理的一些心得

主要涉及ssl，连接优化，vitepress路径处理和通用处理二级域名等。

通过`map`和`upstream`指令可以实现通过一个server块通用处理二级域名



```nginx
# 1. 定义二级域名到 upstream 的映射表
map $subdomain $upstream_name {
    default "";                          # 默认空值（不转发）
    "twikoo" "twikoo_backend";           # twikoo.dl-web.top → 8080
}

# 2. 定义 upstream 块（管理后端服务）
upstream twikoo_backend {
    server localhost:8080;
    keepalive 32;  # 启用长连接
}


server {
    listen 80;
    listen 443 ssl http2;
    # 同时匹配主域名和子域名
    server_name dl-web.top ~^(?<subdomain>.+)\.dl-web\.top$;

    # 公共配置
    index index.php index.html index.htm default.php default.htm default.html;
    access_log /www/sites/dl-web.top/log/access.log;
    error_log /www/sites/dl-web.top/log/error.log;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";

    resolver 8.8.8.8 ipv6=off;

    # HTTP 跳转 HTTPS
    if ($scheme = http) {
        return 301 https://$host$request_uri;
    }

    # SSL 配置
    ssl_certificate /www/sites/dl-web.top/ssl/fullchain.pem;
    ssl_certificate_key /www/sites/dl-web.top/ssl/privkey.pem;
    ssl_protocols TLSv1.3 TLSv1.2 TLSv1.1 TLSv1;
    ssl_ciphers 省略;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_stapling on;
    ssl_stapling_verify on;
    add_header Strict-Transport-Security "max-age=31536000";

    # 错误页处理
    error_page 497 https://$host$request_uri;

    # 限流配置
    limit_conn perserver 300;
    limit_conn perip 25;
    limit_rate 512k;

    location / {
        proxy_set_header Host $host;  # 关键：传递原始域名（status.dl-web.top）给后端
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;  # 传递协议（http/https），避免后端误判
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;

        # 逻辑1：有效二级域名 → 转发到对应服务
        if ($upstream_name != "") {
            proxy_pass http://$upstream_name;
            break;  # 终止后续处理
        }

        # 逻辑2：无效二级域名（非主域名且无映射） → 直接返回404/502
        if ($subdomain != "") {  # $subdomain有值 → 是二级域名但未匹配映射
            return 404;  # 或 return 502; 按需选择
        }
        
        # 逻辑3：主域名 → 处理静态资源（仅当$subdomain为空时执行）
        charset utf-8;
        root /www/sites/dl-web.top/index/dist;
        try_files $uri $uri.html $uri/ =404;
        error_page 404 /404.html;
        error_page 403 /404.html;

        # 静态资源缓存（仅主域名生效）
        location ~* ^/assets/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # 新增：确保二级域名的所有路径都被转发到后端
    location ~ ^/(assets|api|socket.io|dashboard|login) {
        if ($upstream_name != "") {
            proxy_pass http://$upstream_name$request_uri;
            break;
        }
    }

    # 3. 主域名的 /api 转发（子域名不生效）
    location /api {
            proxy_pass http://localhost:9123;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header Referer $http_referer;
    }
}


# 独立的 status.dl-web.top 配置
server {
    listen 80;
    listen 443 ssl http2;
    server_name status.dl-web.top;

    # 共用 SSL 配置
    ssl_certificate /www/sites/dl-web.top/ssl/fullchain.pem;
    ssl_certificate_key /www/sites/dl-web.top/ssl/privkey.pem;

    # 所有请求直接转发到 Uptime Kuma
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}


server {
    listen 80;
    listen 443 ssl http2;
    server_name umami.dl-web.top;

    # 共用 SSL 配置
    ssl_certificate /www/sites/dl-web.top/ssl/fullchain.pem;
    ssl_certificate_key /www/sites/dl-web.top/ssl/privkey.pem;

    # 所有请求直接转发到 Uptime Kuma
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

```

