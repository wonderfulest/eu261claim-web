# 设计文档

## 概述

本文档描述了将短链接追踪系统从 Java Spring Boot 迁移到 TypeScript/Node.js 的技术设计。系统将集成到现有的 eu261claim-web Vue 项目中，提供短链接管理、点击追踪和 UTM 参数分析功能。

## 架构

### 技术栈选择

**后端框架**: Express.js
- 轻量级、成熟稳定
- 与 Vue 项目共享 TypeScript 类型
- 丰富的中间件生态

**ORM**: Prisma
- 类型安全的数据库访问
- 自动生成 TypeScript 类型
- 优秀的迁移工具
- 支持 MySQL

**数据库**: MySQL 8.x
- 与原 Java 项目保持一致
- 可复用现有数据库结构

### 项目结构

```
eu261claim-web/
├── src/
│   ├── api/          # 现有前端 API 调用
│   ├── components/   # Vue 组件
│   ├── views/        # Vue 页面
│   └── ...
├── server/           # 新增：后端服务
│   ├── controllers/  # 控制器层
│   ├── services/     # 业务逻辑层
│   ├── models/       # 数据模型
│   ├── middleware/   # 中间件
│   ├── utils/        # 工具函数
│   ├── routes/       # 路由定义
│   └── index.ts      # 服务入口
├── prisma/           # 新增：Prisma 配置
│   ├── schema.prisma # 数据库模式
│   └── migrations/   # 数据库迁移
└── package.json
```

## 组件和接口

### 1. 数据模型（Prisma Schema）

```prisma
// prisma/schema.prisma

model ShortLink {
  id         BigInt   @id @default(autoincrement())
  shortId    String   @unique @map("short_id") @db.VarChar(50)
  longUrl    String   @map("long_url") @db.VarChar(2048)
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")
  
  clickEvents   ClickEvent[]
  buttonClicks  ButtonClick[]
  
  @@index([shortId])
  @@map("short_links")
}

model ClickEvent {
  id          BigInt   @id @default(autoincrement())
  shortId     String   @map("short_id") @db.VarChar(50)
  ipAddress   String?  @map("ip_address") @db.VarChar(45)
  userAgent   String?  @map("user_agent") @db.VarChar(512)
  referrer    String?  @db.VarChar(2048)
  utmSource   String?  @map("utm_source") @db.VarChar(100)
  utmMedium   String?  @map("utm_medium") @db.VarChar(100)
  utmCampaign String?  @map("utm_campaign") @db.VarChar(100)
  utmContent  String?  @map("utm_content") @db.VarChar(100)
  utmTerm     String?  @map("utm_term") @db.VarChar(100)
  clickedAt   DateTime @default(now()) @map("clicked_at")
  
  shortLink     ShortLink     @relation(fields: [shortId], references: [shortId], onDelete: Cascade)
  buttonClicks  ButtonClick[]
  
  @@index([shortId])
  @@index([clickedAt])
  @@index([utmSource, utmMedium])
  @@map("click_events")
}

model ButtonClick {
  id            BigInt   @id @default(autoincrement())
  clickEventId  BigInt   @map("click_event_id")
  shortId       String   @map("short_id") @db.VarChar(50)
  clickedAt     DateTime @default(now()) @map("clicked_at")
  
  clickEvent  ClickEvent @relation(fields: [clickEventId], references: [id], onDelete: Cascade)
  shortLink   ShortLink  @relation(fields: [shortId], references: [shortId], onDelete: Cascade)
  
  @@index([clickEventId])
  @@index([shortId])
  @@index([clickedAt])
  @@map("button_clicks")
}
```

### 2. 服务层接口

```typescript
// server/services/TrackerService.ts

interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

interface ClickEventData {
  shortId: string;
  ipAddress: string;
  userAgent: string;
  referrer?: string;
  utmParams: UTMParams;
}

interface ShortLinkData {
  shortId: string;
  longUrl: string;
}

class TrackerService {
  // 解析短链接
  async resolveShortLink(shortId: string): Promise<ShortLinkData | null>;
  
  // 记录点击事件
  async recordClickEvent(data: ClickEventData): Promise<number>;
  
  // 记录按钮点击
  async recordButtonClick(clickEventId: number, shortId: string): Promise<void>;
  
  // 创建短链接
  async createShortLink(shortId: string, longUrl: string): Promise<ShortLinkData>;
  
  // 获取点击统计
  async getClickStats(shortId: string): Promise<ClickStats>;
}
```

### 3. 控制器层

```typescript
// server/controllers/TrackerController.ts

class TrackerController {
  // GET /:shortId - 短链接访问
  async handleShortLinkAccess(req: Request, res: Response): Promise<void>;
  
  // POST /api/tracker/button-click - 记录按钮点击
  async handleButtonClick(req: Request, res: Response): Promise<void>;
  
  // POST /api/tracker/short-links - 创建短链接
  async createShortLink(req: Request, res: Response): Promise<void>;
  
  // GET /api/tracker/stats/:shortId - 获取统计数据
  async getStats(req: Request, res: Response): Promise<void>;
}
```

### 4. 路由定义

```typescript
// server/routes/tracker.ts

router.get('/:shortId', trackerController.handleShortLinkAccess);
router.post('/api/tracker/button-click', trackerController.handleButtonClick);
router.post('/api/tracker/short-links', trackerController.createShortLink);
router.get('/api/tracker/stats/:shortId', trackerController.getStats);
```

## 数据模型

### 实体关系图

```
ShortLink (1) ----< (N) ClickEvent (1) ----< (N) ButtonClick
```

### 数据流

1. **短链接访问流程**:
   ```
   用户点击短链接 
   → 提取 UTM 参数 
   → 记录点击事件 
   → 返回落地页（包含 clickEventId）
   ```

2. **按钮点击流程**:
   ```
   用户点击 CTA 按钮 
   → 异步发送 POST 请求 
   → 记录按钮点击 
   → 重定向到目标 URL
   ```

## 正确性属性

*属性是一个特征或行为，应该在系统的所有有效执行中保持为真——本质上是关于系统应该做什么的正式陈述。属性作为人类可读规范和机器可验证正确性保证之间的桥梁。*

### 属性 1: 短链接唯一性

*对于任意*两个不同的短链接记录，它们的 shortId 必须不同

**验证: 需求 1.4**

### 属性 2: 点击事件关联性

*对于任意*点击事件，必须存在对应的短链接记录

**验证: 需求 2.7**

### 属性 3: IP 地址匿名化

*对于任意*记录的 IP 地址，最后一段必须被移除或替换为 0

**验证: 需求 9.1**

### 属性 4: UTM 参数提取完整性

*对于任意*包含 UTM 参数的 URL，所有存在的 UTM 参数都必须被正确提取

**验证: 需求 3.1-3.6**

### 属性 5: 按钮点击关联性

*对于任意*按钮点击记录，必须存在对应的点击事件记录

**验证: 需求 5.2**

### 属性 6: 时间戳单调性

*对于任意*按钮点击，其时间戳必须晚于或等于对应点击事件的时间戳

**验证: 需求 5.3**

### 属性 7: 数据库事务原子性

*对于任意*点击事件记录操作，要么完全成功，要么完全失败（不存在部分记录）

**验证: 需求 6.6**

## 错误处理

### 错误类型

1. **ShortLinkNotFoundError** (404)
   - 短链接不存在
   - 返回友好的 404 页面

2. **DatabaseError** (500)
   - 数据库连接失败
   - 查询执行失败
   - 记录错误日志，返回通用错误页面

3. **ValidationError** (400)
   - 请求参数无效
   - 返回具体的验证错误信息

4. **NetworkTimeoutError** (504)
   - 数据库查询超时
   - 返回超时错误页面

### 错误处理策略

```typescript
// server/middleware/errorHandler.ts

class ErrorHandler {
  handle(error: Error, req: Request, res: Response, next: NextFunction) {
    if (error instanceof ShortLinkNotFoundError) {
      return res.status(404).render('error/404');
    }
    
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: error.message });
    }
    
    // 记录错误但不暴露细节
    logger.error(error);
    return res.status(500).render('error/500');
  }
}
```

## 测试策略

### 单元测试

使用 **Jest** 进行单元测试：

1. **服务层测试**
   - 测试短链接解析逻辑
   - 测试 UTM 参数提取
   - 测试 IP 地址匿名化
   - 测试数据验证逻辑

2. **工具函数测试**
   - 测试 URL 解析
   - 测试日期格式化
   - 测试字符串处理

### 属性测试

使用 **fast-check** 进行属性测试（最少 100 次迭代）：

1. **属性 1: 短链接唯一性测试**
   - **功能: tracker-integration, 属性 1: 短链接唯一性**
   - 生成随机短链接数据
   - 验证数据库约束防止重复

2. **属性 3: IP 匿名化测试**
   - **功能: tracker-integration, 属性 3: IP 地址匿名化**
   - 生成随机 IP 地址
   - 验证匿名化后最后一段被移除

3. **属性 4: UTM 提取测试**
   - **功能: tracker-integration, 属性 4: UTM 参数提取完整性**
   - 生成随机 UTM 参数组合
   - 验证所有参数都被正确提取

4. **属性 6: 时间戳单调性测试**
   - **功能: tracker-integration, 属性 6: 时间戳单调性**
   - 生成随机点击和按钮点击序列
   - 验证时间戳顺序正确

### 集成测试

1. **API 端点测试**
   - 测试短链接访问流程
   - 测试按钮点击记录
   - 测试错误场景

2. **数据库集成测试**
   - 测试 Prisma 查询
   - 测试事务处理
   - 测试外键约束

### 测试配置

```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

## 实施注意事项

### 1. 数据库迁移

- 使用 Prisma Migrate 管理数据库变更
- 保持与原 Java 项目的数据库兼容性
- 提供回滚方案

### 2. 性能优化

- 使用数据库索引优化查询
- 异步处理点击记录，不阻塞用户
- 考虑添加 Redis 缓存（可选）

### 3. 安全考虑

- 所有数据库查询使用参数化
- 验证和清理用户输入
- IP 地址自动匿名化
- 不记录 PII 信息

### 4. 部署策略

- 前后端可以部署在同一服务器
- 使用 PM2 管理 Node.js 进程
- 配置 Nginx 反向代理
- 设置环境变量管理配置

### 5. 监控和日志

- 使用 Winston 记录应用日志
- 记录所有错误和异常
- 监控数据库连接状态
- 追踪 API 响应时间
