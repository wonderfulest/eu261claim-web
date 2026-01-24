# 🧪 快速测试指南

## 当前状态
- ✅ 后端服务器运行中（端口 3001）
- ✅ 数据库已连接
- ✅ 落地页已实现

---

## 测试步骤

### 1️⃣ 测试后端 API

#### 健康检查
```powershell
curl http://localhost:3001/health
```
**预期结果：**
```json
{"status":"ok","timestamp":"2026-01-24T..."}
```

#### 测试现有短链接
数据库中已有 3 个短链接，测试其中一个：
```powershell
curl http://localhost:3001/abc123
```
**预期结果：**
```json
{
  "shortId": "abc123",
  "longUrl": "https://www.airhelp.com/en/claim/?partner=test123",
  "clickEventId": "...",
  "utmParams": {}
}
```

#### 带 UTM 参数测试
```powershell
curl "http://localhost:3001/abc123?utm_source=email&utm_medium=newsletter"
```

---

### 2️⃣ 启动前端并测试落地页

#### 启动前端（在新终端）
```bash
npm run dev
```

#### 访问落地页
在浏览器中打开：
```
http://localhost:3000/abc123
```

**你应该看到：**
1. 🎨 漂亮的渐变背景
2. 📄 白色卡片显示目标 URL
3. 🔵 "继续访问"按钮
4. ℹ️ 安全提示

#### 带 UTM 参数测试
```
http://localhost:3000/abc123?utm_source=email&utm_medium=newsletter&utm_campaign=test
```

**你应该看到：**
- UTM 标签显示在页面上（来源、媒介、活动）

---

### 3️⃣ 测试完整流程

1. **访问短链接**
   ```
   http://localhost:3000/test456
   ```

2. **点击"继续访问"按钮**
   - 系统会记录按钮点击
   - 自动跳转到目标 URL

3. **查看统计数据**
   ```powershell
   curl http://localhost:3001/api/tracker/stats/abc123
   ```
   
   **预期结果：**
   ```json
   {
     "shortId": "abc123",
     "longUrl": "...",
     "totalClicks": 5,
     "totalButtonClicks": 10,
     "utmBreakdown": {
       "source": {...},
       "medium": {...},
       "campaign": {...}
     }
   }
   ```

---

### 4️⃣ 测试创建新短链接

```powershell
Invoke-WebRequest -Uri http://localhost:3001/api/tracker/short-links `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"shortId":"mytest","longUrl":"https://google.com"}' `
  -UseBasicParsing
```

然后访问：
```
http://localhost:3000/mytest
```

---

### 5️⃣ 测试错误处理

#### 不存在的短链接
```
http://localhost:3000/notexist
```
**预期结果：** 显示错误页面，提示"链接无效"

---

## 🎯 成功标准

✅ 所有 API 返回正确的 JSON 数据
✅ 落地页正常显示
✅ 点击按钮能正常跳转
✅ UTM 参数正确显示
✅ 错误页面正常显示
✅ 统计数据正确累加

---

## 📱 移动端测试

1. 打开浏览器开发者工具（F12）
2. 切换到移动设备模式
3. 访问短链接
4. 检查响应式布局是否正常

---

## 🐛 如果遇到问题

### 后端无响应
```bash
# 检查后端进程
npm run server:dev
```

### 前端无法访问后端
检查 Vite 代理配置：
```typescript
// vite.config.ts
proxy: {
  '^/api/tracker/.*': {
    target: 'http://localhost:3001',
    changeOrigin: true,
  }
}
```

### 数据库连接失败
检查 `.env` 文件：
```env
DATABASE_URL="mysql://tracker_user:sql19980.@localhost:3306/airhelp_tracker"
```

---

## 🎉 测试完成后

恭喜！如果所有测试都通过，说明追踪系统已经完全可用了！

你可以：
1. 📊 查看数据库中的追踪数据
2. 🎨 自定义落地页样式
3. 📈 添加更多统计功能
4. 🚀 部署到生产环境
