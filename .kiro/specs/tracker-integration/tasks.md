# 实施计划: 追踪系统集成

## 概述

将 Java 版短链接追踪系统迁移到 TypeScript/Node.js，集成到现有的 eu261claim-web Vue 项目中。

## 任务

- [x] 1. 项目基础设置
  - 安装必要的依赖包（Express、Prisma、TypeScript 相关）
  - 配置 TypeScript 编译选项
  - 创建 server 目录结构
  - _需求: 10.1, 10.2, 10.5_

- [x] 2. 数据库配置和迁移
  - [x] 2.1 配置 Prisma
    - 创建 prisma/schema.prisma 文件
    - 定义 ShortLink、ClickEvent、ButtonClick 模型
    - 配置数据库连接
    - _需求: 6.1, 6.2, 6.3, 6.4_
  
  - [ ]* 2.2 编写属性测试：短链接唯一性
    - **属性 1: 短链接唯一性**
    - **验证: 需求 1.4**
  
  - [x] 2.3 运行数据库迁移
    - 执行 prisma migrate dev
    - 验证表结构正确创建
    - 插入测试数据
    - _需求: 6.5_

- [x] 3. 工具函数实现
  - [x] 3.1 实现 IP 地址匿名化函数
    - 创建 server/utils/anonymize.ts
    - 实现 anonymizeIP 函数（移除最后一段）
    - _需求: 9.1_
  
  - [ ]* 3.2 编写属性测试：IP 匿名化
    - **属性 3: IP 地址匿名化**
    - **验证: 需求 9.1**
  
  - [x] 3.3 实现 UTM 参数提取函数
    - 创建 server/utils/utm.ts
    - 实现 extractUTMParams 函数
    - _需求: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_
  
  - [ ]* 3.4 编写属性测试：UTM 参数提取
    - **属性 4: UTM 参数提取完整性**
    - **验证: 需求 3.1-3.6**

- [x] 4. 服务层实现
  - [x] 4.1 实现 TrackerService
    - 创建 server/services/TrackerService.ts
    - 实现 resolveShortLink 方法
    - 实现 recordClickEvent 方法
    - 实现 recordButtonClick 方法
    - 实现 createShortLink 方法
    - _需求: 1.2, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 5.1, 5.2, 5.3, 5.4_
  
  - [ ]* 4.2 编写单元测试：TrackerService
    - 测试短链接解析
    - 测试点击事件记录
    - 测试按钮点击记录
    - _需求: 1.2, 2.1, 5.1_
  
  - [ ]* 4.3 编写属性测试：点击事件关联性
    - **属性 2: 点击事件关联性**
    - **验证: 需求 2.7**
  
  - [ ]* 4.4 编写属性测试：按钮点击关联性
    - **属性 5: 按钮点击关联性**
    - **验证: 需求 5.2**
  
  - [ ]* 4.5 编写属性测试：时间戳单调性
    - **属性 6: 时间戳单调性**
    - **验证: 需求 5.3**

- [ ] 5. 检查点 - 确保核心逻辑测试通过
  - 确保所有测试通过，如有问题请询问用户。

- [x] 6. 控制器层实现
  - [x] 6.1 实现 TrackerController
    - 创建 server/controllers/TrackerController.ts
    - 实现 handleShortLinkAccess 方法
    - 实现 handleButtonClick 方法
    - 实现 createShortLink 方法
    - 实现 getStats 方法
    - _需求: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_
  
  - [ ]* 6.2 编写单元测试：TrackerController
    - 测试请求参数验证
    - 测试响应格式
    - 测试错误处理
    - _需求: 7.4, 7.5, 7.6_

- [x] 7. 路由配置
  - [x] 7.1 创建路由文件
    - 创建 server/routes/tracker.ts
    - 配置 GET /:shortId 路由
    - 配置 POST /api/tracker/button-click 路由
    - 配置 POST /api/tracker/short-links 路由
    - 配置 GET /api/tracker/stats/:shortId 路由
    - _需求: 7.1, 7.2, 7.3_
  
  - [x] 7.2 集成路由到主应用
    - 在 server/index.ts 中注册路由
    - 配置中间件（body-parser、cors 等）
    - _需求: 10.5_

- [x] 8. 错误处理中间件
  - [x] 8.1 实现错误处理器
    - 创建 server/middleware/errorHandler.ts
    - 实现 ShortLinkNotFoundError 处理
    - 实现 DatabaseError 处理
    - 实现 ValidationError 处理
    - 实现 NetworkTimeoutError 处理
    - _需求: 8.1, 8.2, 8.3, 8.4, 8.5_
  
  - [ ]* 8.2 编写单元测试：错误处理
    - 测试各种错误场景
    - 验证错误响应格式
    - _需求: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 9. 落地页实现
  - [x] 9.1 创建 Vue 落地页组件
    - 创建 src/views/tracker/Landing.vue
    - 实现响应式设计
    - 添加 CTA 按钮
    - 集成按钮点击追踪
    - _需求: 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [x] 9.2 配置落地页路由
    - 在 src/router/index.ts 中添加路由
    - 配置动态路由参数
    - _需求: 4.1_

- [x] 10. 前端 API 集成
  - [x] 10.1 创建追踪 API 客户端
    - 创建 src/api/tracker.ts
    - 实现 recordButtonClick 方法
    - 实现 getShortLinkInfo 方法
    - _需求: 7.1, 7.2_
  
  - [x] 10.2 更新 Vite 代理配置
    - 修改 vite.config.ts
    - 添加 /api/tracker 代理规则
    - _需求: 10.5_

- [ ] 11. 检查点 - 端到端测试
  - 确保所有测试通过，如有问题请询问用户。

- [ ] 12. 集成测试
  - [ ]* 12.1 编写 API 集成测试
    - 测试短链接访问流程
    - 测试按钮点击记录流程
    - 测试错误场景
    - _需求: 7.1, 7.2, 8.1, 8.2_
  
  - [ ]* 12.2 编写数据库集成测试
    - 测试 Prisma 查询
    - 测试事务处理
    - 测试外键约束
    - _需求: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_
  
  - [ ]* 12.3 编写属性测试：数据库事务原子性
    - **属性 7: 数据库事务原子性**
    - **验证: 需求 6.6**

- [x] 13. 环境配置和部署准备
  - [x] 13.1 配置环境变量
    - 创建 .env.example
    - 配置数据库连接
    - 配置服务器端口
    - _需求: 6.1_
  
  - [x] 13.2 更新 package.json 脚本
    - 添加 server:dev 脚本
    - 添加 server:build 脚本
    - 添加 server:start 脚本
    - _需求: 10.2_
  
  - [x] 13.3 创建部署文档
    - 编写 server/README.md
    - 说明部署步骤
    - 说明环境变量配置

- [ ] 14. 最终检查点
  - 运行所有测试
  - 验证功能完整性
  - 确认无遗留问题

## 注意事项

- 标记 `*` 的任务为可选任务，可以跳过以加快 MVP 开发
- 每个任务都引用了具体的需求编号以便追溯
- 检查点任务用于确保增量验证
- 属性测试每个至少运行 100 次迭代
