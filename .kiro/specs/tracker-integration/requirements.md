# 需求文档

## 简介

本文档概述了将 Java 版 transfer-email 项目的链接追踪功能集成到 eu261claim-web Vue/TypeScript 应用的需求。目标是将核心追踪功能（短链接、点击追踪、UTM 参数）从 Java Spring Boot 迁移到现有 Vue 项目中的 TypeScript 实现。

## 术语表

- **短链接（Short_Link）**: 缩短的 URL 标识符，将用户重定向到更长的目标 URL
- **点击事件（Click_Event）**: 用户点击短链接时的记录，包括 IP、用户代理和 UTM 参数等元数据
- **按钮点击（Button_Click）**: 用户在落地页上点击行动号召按钮的记录
- **UTM参数（UTM_Parameters）**: 营销追踪参数（utm_source、utm_medium、utm_campaign、utm_content、utm_term）
- **追踪服务（Tracker_Service）**: 处理链接解析和事件记录的后端服务
- **落地页（Landing_Page）**: 在重定向到最终目标之前向用户展示的中间页面

## 需求

### 需求 1: 短链接管理

**用户故事:** 作为营销经理，我想创建和管理短链接，以便追踪来自不同营销渠道的用户参与度。

#### 验收标准

1. THE 系统 SHALL 存储具有唯一标识符的短链接配置
2. WHEN 访问短链接时，THE 系统 SHALL 检索对应的长 URL
3. THE 系统 SHALL 支持通过 API 创建新的短链接
4. THE 系统 SHALL 验证短链接标识符的唯一性
5. THE 系统 SHALL 记录每个短链接的创建和更新时间戳

### 需求 2: 点击事件追踪

**用户故事:** 作为数据分析师，我想追踪短链接上的所有点击，以便分析用户行为和营销活动效果。

#### 验收标准

1. WHEN 用户点击短链接时，THE 系统 SHALL 记录点击事件
2. THE 系统 SHALL 捕获用户的 IP 地址（匿名化为前 3 段）
3. THE 系统 SHALL 捕获用户代理字符串
4. THE 系统 SHALL 捕获 HTTP 引荐来源
5. THE 系统 SHALL 从 URL 中提取并存储所有 UTM 参数
6. THE 系统 SHALL 记录点击的精确时间戳
7. THE 系统 SHALL 将每个点击事件与对应的短链接 ID 关联

### 需求 3: UTM 参数提取

**用户故事:** 作为营销经理，我想追踪 UTM 参数，以便衡量不同营销活动的效果。

#### 验收标准

1. WHEN 短链接 URL 包含 UTM 参数时，THE 系统 SHALL 提取它们
2. THE 系统 SHALL 支持提取 utm_source 参数
3. THE 系统 SHALL 支持提取 utm_medium 参数
4. THE 系统 SHALL 支持提取 utm_campaign 参数
5. THE 系统 SHALL 支持提取 utm_content 参数
6. THE 系统 SHALL 支持提取 utm_term 参数
7. THE 系统 SHALL 优雅地处理缺失的 UTM 参数（存储为 null）

### 需求 4: 落地页展示

**用户故事:** 作为用户，我想在点击短链接时看到落地页，以便了解我将被重定向到哪里。

#### 验收标准

1. WHEN 用户访问有效的短链接时，THE 系统 SHALL 显示落地页
2. THE 落地页 SHALL 显示目标信息
3. THE 落地页 SHALL 包含行动号召按钮
4. THE 落地页 SHALL 具有响应式设计并适配移动设备
5. THE 落地页 SHALL 在 2 秒内加载完成

### 需求 5: 按钮点击追踪

**用户故事:** 作为数据分析师，我想追踪落地页上的按钮点击，以便衡量转化率。

#### 验收标准

1. WHEN 用户点击落地页上的 CTA 按钮时，THE 系统 SHALL 记录按钮点击事件
2. THE 系统 SHALL 将按钮点击与原始点击事件关联
3. THE 系统 SHALL 记录按钮点击的时间戳
4. THE 系统 SHALL 存储按钮点击的短链接 ID
5. THE 系统 SHALL 异步处理按钮点击，不阻塞重定向

### 需求 6: 数据库集成

**用户故事:** 作为系统管理员，我想将所有追踪数据持久化到数据库，以便数据不会丢失并可以稍后分析。

#### 验收标准

1. THE 系统 SHALL 使用 MySQL 作为主数据库
2. THE 系统 SHALL 创建 short_links 表用于链接配置
3. THE 系统 SHALL 创建 click_events 表用于点击追踪
4. THE 系统 SHALL 创建 button_clicks 表用于按钮点击追踪
5. THE 系统 SHALL 使用适当的索引以提高查询性能
6. THE 系统 SHALL 优雅地处理数据库连接失败

### 需求 7: API 接口

**用户故事:** 作为前端开发者，我想要 RESTful API 接口，以便将追踪功能集成到 Vue 应用中。

#### 验收标准

1. THE 系统 SHALL 提供 GET 接口用于短链接解析
2. THE 系统 SHALL 提供 POST 接口用于记录按钮点击
3. THE 系统 SHALL 提供 GET 接口用于检索点击统计（可选）
4. THE 系统 SHALL 返回适当的 HTTP 状态码（200、404、500）
5. THE 系统 SHALL 验证所有 API 请求参数
6. THE 系统 SHALL 为 API 接口返回 JSON 响应

### 需求 8: 错误处理

**用户故事:** 作为用户，我想在出错时看到清晰的错误消息，以便了解发生了什么。

#### 验收标准

1. WHEN 短链接不存在时，THE 系统 SHALL 显示 404 错误页面
2. WHEN 发生数据库错误时，THE 系统 SHALL 显示 500 错误页面
3. THE 系统 SHALL 记录所有错误以便调试
4. THE 系统 SHALL 不在错误消息中暴露敏感信息
5. THE 系统 SHALL 优雅地处理网络超时

### 需求 9: 隐私和安全

**用户故事:** 作为隐私官，我想安全地处理用户数据，以便遵守隐私法规。

#### 验收标准

1. THE 系统 SHALL 通过删除最后一段来匿名化 IP 地址
2. THE 系统 SHALL 不存储任何个人身份信息（PII）
3. THE 系统 SHALL 使用参数化查询防止 SQL 注入
4. THE 系统 SHALL 验证和清理所有用户输入
5. THE 系统 SHALL 在生产环境中对所有 API 通信使用 HTTPS

### 需求 10: TypeScript 实现

**用户故事:** 作为开发者，我想用 TypeScript 实现追踪系统，以便与现有的 Vue 代码库无缝集成。

#### 验收标准

1. THE 系统 SHALL 使用 TypeScript 实现
2. THE 系统 SHALL 使用 Node.js 后端框架（Express 或类似框架）
3. THE 系统 SHALL 使用 TypeScript ORM 进行数据库操作
4. THE 系统 SHALL 遵循 TypeScript 最佳实践和类型安全
5. THE 系统 SHALL 与现有的 Vue 项目结构集成
