import { Router } from 'express';
import { trackerController } from '../controllers/TrackerController';

const router = Router();

/**
 * 按钮点击记录路由
 * POST /button-click
 */
router.post('/button-click', (req, res) => {
  trackerController.handleButtonClick(req, res);
});

/**
 * 创建短链接路由
 * POST /short-links
 */
router.post('/short-links', (req, res) => {
  trackerController.createShortLink(req, res);
});

/**
 * 获取短链接统计路由
 * GET /stats/:shortId
 */
router.get('/stats/:shortId', (req, res) => {
  trackerController.getStats(req, res);
});

export default router;
