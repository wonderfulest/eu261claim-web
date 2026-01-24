# Prisma 数据库配置

## 前置条件

确保你已经安装并运行了 MySQL 数据库。

## 配置步骤

### 1. 创建 .env 文件

复制 `.env.example` 并重命名为 `.env`，然后配置你的数据库连接：

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
```

示例：
```env
DATABASE_URL="mysql://root:password@localhost:3306/tracker_db"
```

### 2. 创建数据库

在 MySQL 中创建数据库：

```sql
CREATE DATABASE tracker_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. 运行数据库迁移

执行以下命令创建表结构：

```bash
npm run prisma:migrate
```

这会：
- 创建 `short_links` 表
- 创建 `click_events` 表
- 创建 `button_clicks` 表
- 创建所有必要的索引和外键约束

### 4. 生成 Prisma Client

```bash
npm run prisma:generate
```

### 5. （可选）插入测试数据

```bash
npm run prisma:seed
```

## 常用命令

### 查看数据库
```bash
npm run prisma:studio
```
在浏览器中打开 Prisma Studio 可视化界面。

### 推送 schema 变更（开发环境）
```bash
npm run prisma:push
```
直接将 schema 变更推送到数据库，不创建迁移文件。

### 创建新迁移
```bash
npm run prisma:migrate
```

### 重置数据库（危险！）
```bash
npx prisma migrate reset
```

## 数据库结构

### short_links（短链接表）
- `id`: 主键
- `short_id`: 唯一短链接标识符
- `long_url`: 目标长 URL
- `created_at`: 创建时间
- `updated_at`: 更新时间

### click_events（点击事件表）
- `id`: 主键
- `short_id`: 关联的短链接 ID
- `ip_address`: 匿名化的 IP 地址
- `user_agent`: 用户代理字符串
- `referrer`: 引荐来源
- `utm_source`: UTM 来源
- `utm_medium`: UTM 媒介
- `utm_campaign`: UTM 活动
- `utm_content`: UTM 内容
- `utm_term`: UTM 关键词
- `clicked_at`: 点击时间

### button_clicks（按钮点击表）
- `id`: 主键
- `click_event_id`: 关联的点击事件 ID
- `short_id`: 关联的短链接 ID
- `clicked_at`: 点击时间

## 故障排除

### 连接错误
确保：
1. MySQL 服务正在运行
2. DATABASE_URL 配置正确
3. 数据库已创建
4. 用户有足够的权限

### 迁移失败
如果迁移失败，可以：
1. 检查数据库连接
2. 查看错误日志
3. 必要时重置数据库：`npx prisma migrate reset`
