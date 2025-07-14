---
date: 2025-07-13 21:58:51
title: Uptime Kuma部署和配置
permalink: /pages/Uptime-Kuma
categories:
  - 笔记专栏
  - 博客搭建
  - WW-Blog
coverImg: /home/bg20.webp
---

{{titile}}



Uptime Kuma 是一款强大的自托管服务监控工具，支持多种安装方式，以下是常见的安装和部署方法：

### Docker 部署

1. 首先确保已安装 Docker。在终端中执行以下命令安装 Docker（以 Ubuntu 系统为例）：

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

1. 运行以下命令安装 Uptime Kuma：

```bash
docker run -d --restart=always -p 3001:3001 -v /uptime-kuma:/app/data --name uptime-kuma louislam/uptime-kuma:1
```

此命令将 Uptime Kuma 容器在后台运行，并将容器的 3001 端口映射到主机的 3001 端口，同时挂载数据卷以保存配置数据。

3. 安装完成后，通过浏览器访问`http://localhost:3001`（若在远程服务器上部署，需使用服务器 IP 代替[localhost](https://localhost/)），首次访问需设置管理员账户，之后即可进入 Uptime Kuma 界面进行使用。

### Docker Compose 部署

1. 创建一个新目录，例如`uptime-kuma`，并在该目录下创建`docker-compose.yaml`文件，内容如下：

```yaml
version: '3.3'
services:
  uptime-kuma:
    image: louislam/uptime-kuma
    container_name: uptime-kuma
    restart: unless-stopped
    volumes:
      -./uptime-kuma:/app/data
    ports:
      - 8000:3001
```

上述配置将容器的 3001 端口映射到主机的 8000 端口，可根据需求修改。

2. 在包含`docker-compose.yaml`文件的目录下，打开终端并执行以下命令启动 Uptime Kuma：

```bash
docker-compose up -d
```

1. 启动后，通过浏览器访问`http://IP:8000`（IP 为服务器地址），按照提示设置管理员账户后即可使用。

### 源码部署

1. 检查系统是否安装 Node.js。若未安装，可下载安装包（以 Linux 系统为例，下载 v20.15.1 版本）：

```bash
wget https://nodejs.org/dist/v20.15.1/node-v20.15.1-linux-x64.tar.xz
tar -xf node-v20.15.1-linux-x64.tar.xz
```

1. 复制二进制文件并配置环境变量：

```bash
cp -af /usr/local/applocation/node-v20.15.1-linux-x64/bin/node /usr/local/bin/
cp -af /usr/local/applocation/node-v20.15.1-linux-x64/bin/npm /usr/local/bin/
```

在`/etc/profile`文件最下方，新增以下内容：

```bash
export NODE_HOME=/usr/local/applocation/node-v20.15.1-linux-x64/bin/
export PATH=$PATH:$NODE_HOME:/usr/local/bin/
```

使变量生效：

```bash
source /etc/profile
```

1. 下载 Uptime Kuma 源码包：

```bash
git clone https://github.com/louislam/uptime-kuma.git
```

1. 进入项目目录并准备项目环境：

```bash
cd uptime-kuma/
npm run setup
```

1. 启动服务，可直接使用命令：

```bash
node server/server.js &
```

也可以安装 pm2 来管理服务：

```bash
npm install pm2 -g && pm2 install pm2-logrotate
pm2 start server/server.js --name uptime-kuma
```

1. 服务启动后，通过浏览器访问`http://IP:3001`（IP 为服务器地址），设置管理员账户后即可开始使用。





### 配置监控

点击添加监控项，监控类型选择HTTP(s)，配置URL地址（地址可以是博客首页），然后配置一个合适的心跳间隔时间

在下方的`高级`设置中勾选



- 证书到期时通知
- 忽略 HTTPS 站点的 TLS/SSL 错误

### 配置状态页面

点击右上角的状态页面，然后新增一个新的状态页面，配置一个名称和路径

在左侧设置中勾选`显示证书有效期`即可

还可以继续配置自定义文本等
