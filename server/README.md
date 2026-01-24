# Server - 追踪系统后端

## 目录结构

```
server/
├── controllers/    # 控制器层 - 处理 HTTP 请求和响应
├── services/       # 服务层 - 业务逻辑
├── models/         # 数据模型
├── middleware/     # 中间件 - 错误处理、验证等
├── routes/         # 路由定义
├── utils/          # 工具函数
└── index.ts        # 服务入口
```

## 开发命令

### 启动开发服务器
```bash
npm run server:dev
```
使用 nodemon 和 tsx 实现热重载，修改代码后自动重启。

### 构建生产版本
```bash
npm run server:build
```
编译 TypeScript 到 `dist/` 目录。

### 启动生产服务器
```bash
npm run server:start
```
运行编译后的 JavaScript 代码。

### 运行测试
```bash
npm test              # 运行所有测试
npm run test:watch    # 监听模式
npm run test:coverage # 生成覆盖率报告
```

## 技术栈

- **Express.js** - Web 框架
- **TypeScript** - 类型安全
- **Prisma** - ORM 数据库访问
- **Jest** - 单元测试
- **fast-check** - 属性测试

## 环境变量

创建 `.env` 文件配置环境变量：

```env
PORT=3001
DATABASE_URL="mysql://user:password@localhost:3306/tracker_db"
NODE_ENV=development
```

## 部署指南

### 前置条件

1. **Node.js** >= 18.x
2. **MySQL** >= 8.x
3. **npm** 或 **yarn**

### 步骤 1: 安装依赖

```bash
npm install
```

### 步骤 2: 配置环境变量

复制 `.env.example` 为 `.env` 并配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件：
```env
PORT=3001
DATABASE_URL="mysql://root:password@localhost:3306/tracker_db"
NODE_ENV=production
```

### 步骤 3: 设置数据库

创建数据库：
```sql
CREATE DATABASE tracker_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

运行数据库迁移：
```bash
npm run prisma:migrate
```

生成 Prisma Client：
```bash
npm run prisma:generate
```

（可选）插入测试数据：
```bash
npm run prisma:seed
```

### 步骤 4: 构建应用

```bash
npm run server:build
```

### 步骤 5: 启动服务器

开发环境：
```bash
npm run server:dev
```

生产环境：
```bash
npm run server:start
```

### 使用 PM2 部署（推荐）

安装 PM2：
```bash
npm install -g pm2
```

创建 `ecosystem.config.js`：
```javascript
module.exports = {
  apps: [{
    name: 'tracker-server',
    script: './dist/index.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
};
```

启动应用：
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Nginx 反向代理配置

```nginx
server {
    listen 80;
    server_name tracker.example.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## API 端点

### 短链接访问
```
GET /:shortId?utm_source=...&utm_medium=...
```

### 记录按钮点击
```
POST /api/tracker/button-click
Body: { clickEventId: string, shortId: string }
```

### 创建短链接
```
POST /api/tracker/short-links
Body: { shortId: string, longUrl: string }
```

### 获取统计数据
```
GET /api/tracker/stats/:shortId
```

### 健康检查
```
GET /health
```

## 监控和日志

### 查看 PM2 日志
```bash
pm2 logs tracker-server
```

### 查看 PM2 状态
```bash
pm2 status
```

### 重启应用
```bash
pm2 restart tracker-server
```

## 故障排除

### 数据库连接失败
- 检查 DATABASE_URL 配置
- 确认 MySQL 服务运行中
- 验证数据库用户权限

### 端口被占用
- 修改 .env 中的 PORT 配置
- 或停止占用端口的进程

### Prisma Client 错误
- 重新生成 Client：`npm run prisma:generate`
- 检查 schema.prisma 语法

## 性能优化

1. **启用数据库连接池**
2. **添加 Redis 缓存**（可选）
3. **使用 PM2 集群模式**
4. **配置 Nginx 缓存**
5. **启用 GZIP 压缩**

## 安全建议

1. 使用强密码保护数据库
2. 启用 HTTPS（生产环境必须）
3. 定期更新依赖包
4. 限制 API 请求频率
5. 配置防火墙规则
