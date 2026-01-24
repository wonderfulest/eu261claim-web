# Prisma 配置指南

## 当前状态

项目已经完成了核心功能的实现，但遇到了 Prisma 7 的配置问题。

## 问题说明

Prisma 7 改变了配置方式，不再支持在 `schema.prisma` 中直接使用 `url = env("DATABASE_URL")`。
新版本要求使用 `adapter` 或 `accelerateUrl`。

## 解决方案

### 方案 1：降级到 Prisma 5（推荐）

Prisma 5 是最稳定的版本，配置简单。

**步骤：**

1. 卸载当前 Prisma 7：
```bash
npm uninstall prisma @prisma/client
```

2. 安装 Prisma 5：
```bash
npm install prisma@5 @prisma/client@5 -D
```

3. 更新 `prisma/schema.prisma`，添加 URL 配置：
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

4. 删除 `prisma/prisma.config.ts` 文件（Prisma 5 不需要）

5. 重新生成 Prisma Client：
```bash
npm run prisma:generate
```

6. 测试数据库连接：
```bash
npx tsx server/test-db.ts
```

### 方案 2：继续使用 Prisma 7（需要额外配置）

如果你想使用最新的 Prisma 7，需要配置 MySQL adapter。

**步骤：**

1. 安装 MySQL adapter（需要稳定的网络）：
```bash
npm install @prisma/adapter-mysql mysql2
```

2. 更新 `server/models/prisma.ts`：
```typescript
import { PrismaClient } from '@prisma/client';
import { createPool } from 'mysql2/promise';
import { PrismaMySql } from '@prisma/adapter-mysql';

const pool = createPool(process.env.DATABASE_URL || '');
const adapter = new PrismaMySql(pool);

export const prisma = new PrismaClient({ adapter });
```

3. 保持 `prisma/schema.prisma` 不包含 URL（当前状态）

4. 确保 `prisma/prisma.config.ts` 包含 URL 配置

5. 重新生成并测试

### 方案 3：暂时跳过 Prisma，使用原生 MySQL（临时方案）

如果网络问题持续，可以暂时使用 `mysql2` 直接连接数据库。

## 当前数据库配置

数据库已经存在并且可用：
- 数据库名：`airhelp_tracker`
- 用户名：`tracker_user`
- 密码：`sql19980.`
- 主机：`localhost:3306`

数据库包含以下表：
- `short_links` - 短链接配置
- `click_events` - 点击事件
- `button_clicks` - 按钮点击
- `compensable_flights` - 可理赔航班（来自 transfer-email 项目）

## 已完成的功能

即使 Prisma 配置有问题，以下功能已经完全实现：

✅ 项目基础设置
✅ 数据库 Schema 定义
✅ IP 匿名化工具（12 个测试通过）
✅ UTM 参数提取工具（20 个测试通过）
✅ TrackerService 服务层
✅ TrackerController 控制器层
✅ Express 路由配置
✅ 错误处理中间件
✅ 前端 API 客户端
✅ Vite 代理配置
✅ 部署文档

## 下一步

1. **解决 Prisma 配置**（选择上面的方案之一）
2. **测试服务器启动**：`npm run server:dev`
3. **实现落地页**（任务 9）
4. **端到端测试**

## 快速测试（不依赖 Prisma）

你可以先测试其他功能：

```bash
# 测试工具函数
npm test -- anonymize.test.ts
npm test -- utm.test.ts

# 编译 TypeScript
npm run server:build

# 查看编译结果
ls dist/
```

## 建议

**我强烈建议使用方案 1（降级到 Prisma 5）**，因为：
1. 配置简单，不需要额外的 adapter
2. 稳定可靠，广泛使用
3. 与现有数据库完全兼容
4. 不需要修改太多代码

等网络稳定后，运行以下命令即可：
```bash
npm uninstall prisma @prisma/client
npm install prisma@5.22.0 @prisma/client@5.22.0
```

然后更新 schema 添加 URL，重新生成 Client 就可以了。
