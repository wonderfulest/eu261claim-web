import express, { Application } from 'express';
import trackerRoutes from './routes/tracker';
import flightRoutes from './routes/flights';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS 配置（允许前端访问）
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  
  next();
});

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Debug middleware - log all requests
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  next();
});

// 注册路由（顺序很重要！）
// 先注册所有 API 路由
app.use('/api/flights', flightRoutes);
app.use('/api/tracker', trackerRoutes);

// 最后注册 tracker 的短链接路由（通配符 /:shortId）
app.get('/:shortId', (req, res) => {
  // 排除特殊路径
  if (req.params.shortId === 'api' || req.params.shortId === 'health') {
    return res.status(404).json({ error: 'Not Found' });
  }
  // 导入 controller 处理
  const { trackerController } = require('./controllers/TrackerController');
  trackerController.handleShortLinkAccess(req, res);
});

// Debug: Log registered routes
console.log('✅ Routes registered:');
console.log('  - Flight routes: /api/flights');
console.log('  - Tracker API routes: /api/tracker');
console.log('  - Tracker shortlink routes: /:shortId');

// 404 处理
app.use(notFoundHandler);

// 错误处理中间件
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
