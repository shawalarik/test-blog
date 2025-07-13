---
date: 2025-07-16 00:23:26
title: umami部署和配置
permalink: /pages/umami
categories:
  - 笔记专栏
  - 博客搭建
  - WW-Blog
coverImg: /home/bg06.webp
---

{{titile}}





### 一、Docker Compose 配置解析

你提供的配置是基于 **PostgreSQL** 的 Umami 部署方案。让我解释关键部分：

1. **服务结构**：
   - `umami` 容器：运行 Umami 应用，监听 `3000` 端口
   - `db` 容器：运行 PostgreSQL 数据库，数据存储在卷 `umami-db-data`
2. **环境变量**：
   - `DATABASE_URL`：数据库连接字符串（格式：`数据库类型://用户名:密码@主机:端口/数据库名`）
   - `DATABASE_TYPE`：指定数据库类型（`postgresql` 或 `mysql`）
   - `APP_SECRET`：用于会话加密的随机字符串（建议生成高强度值）
3. **健康检查**：
   - Umami 通过 `/api/heartbeat` 端点检查状态
   - PostgreSQL 使用 `pg_isready` 命令检查服务可用性

### 二、如何修改配置以使用已有的 MySQL

如果你已经通过 Docker 安装了 MySQL，只需修改 `umami` 服务的配置，**无需创建新的数据库容器**。以下是修改步骤：

#### 1. **修改数据库连接配置**

将 `umami` 服务的环境变量修改为 MySQL 连接信息：

```yaml
version: '3'
services:
  umami:
    image: ghcr.io/umami-software/umami:postgresql-latest  # 使用兼容 MySQL 的镜像
    ports:
      - "25565:3000"  # 主机端口:容器端口
    environment:
      DATABASE_URL: mysql://username:password@host:port/umami  # 修改为你的 MySQL 连接信息
      DATABASE_TYPE: mysql  # 指定为 MySQL
      APP_SECRET: replace-me-with-a-random-string  # 生成随机字符串（至少 32 个字符）
    restart: always
    depends_on:
      db:
        condition: service_healthy

# 移除原有的 db 服务（因为你已使用外部 MySQL）
volumes:
  umami-db-data:
```

#### 2. **替换连接参数**

将 `DATABASE_URL` 中的占位符替换为你的实际 MySQL 信息：

- `username`：MySQL 用户名（例如 `root` 或专门为 Umami 创建的用户）
- `password`：MySQL 密码
- `host`：MySQL 容器的名称或 IP（如果在同一网络中，可使用容器名）
- `port`：MySQL 端口（默认 `3306`）
- `umami`：数据库名（需提前在 MySQL 中创建）

#### 3. **确保 MySQL 已准备好**

在启动 Umami 前，需要：

1. **创建数据库**：

   ```sql
   CREATE DATABASE umami CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. **授予用户权限**：

   ```sql
   GRANT ALL PRIVILEGES ON umami.* TO 'username'@'%';
   FLUSH PRIVILEGES;
   ```

#### 4. **可选：将 MySQL 容器加入同一网络**

如果 Umami 和 MySQL 不在同一个 Docker 网络中，需要：

1. 创建共享网络：

   ```bash
   docker network create umami-network
   ```

2. 将现有 MySQL 容器加入网络：

   ```bash
   docker network connect umami-network 你的MySQL容器名
   ```

3. 在 Umami 的 `docker-compose.yml` 中指定网络：

   ```yaml
   networks:
     default:
       external:
         name: umami-network
   ```

### 三、生成安全的 APP_SECRET

使用以下命令生成随机字符串：



```bash
openssl rand -base64 32  # 生成 32 字节（256 位）的随机字符串
```

### 四、完整配置示例

假设你的 MySQL 容器名为 `mysql-server`，用户名为 `umami`，密码为 `your-strong-password`：

```yaml
version: '3'
services:
  umami:
    image: ghcr.io/umami-software/umami:postgresql-latest
    ports:
      - "25565:3000"
    environment:
      DATABASE_URL: mysql://umami:your-strong-password@mysql-server:3306/umami
      DATABASE_TYPE: mysql
      APP_SECRET: $(openssl rand -base64 32)  # 自动生成随机密钥
    restart: always
    depends_on:
      mysql-server:
        condition: service_healthy

networks:
  default:
    external:
      name: umami-network  # 与 MySQL 容器共享的网络
```

### 五、启动服务

修改配置后，执行：

```bash
docker compose up -d
```

首次启动时，Umami 会自动创建所需的表结构。登录后记得立即修改默认密码（用户名：`admin`，密码：`umami`）。

### 六、故障排除

1. **检查日志**：

   ```bash
   docker logs umami  # 查看 Umami 日志
   docker logs mysql-server  # 查看 MySQL 日志
   ```

2. **测试连接**：

   

   ```bash
   # 进入 Umami 容器内部测试 MySQL 连接
   docker exec -it umami bash
   mysql -h mysql-server -u umami -p
   ```

如果遇到问题，请提供错误日志，我会进一步帮助你排查！
