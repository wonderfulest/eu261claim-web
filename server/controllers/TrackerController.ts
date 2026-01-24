import { Request, Response } from 'express';
import { trackerService } from '../services/TrackerService.mysql';
import { extractAndAnonymizeIP } from '../utils/anonymize';
import { extractUTMFromQuery, validateUTMParams } from '../utils/utm';

/**
 * TrackerController - 处理追踪相关的 HTTP 请求
 */
export class TrackerController {
  /**
   * 处理短链接访问
   * GET /:shortId
   * 
   * 记录点击事件并返回落地页数据
   */
  async handleShortLinkAccess(req: Request, res: Response): Promise<void> {
    try {
      const { shortId } = req.params;

      // 验证 shortId 类型
      if (Array.isArray(shortId)) {
        res.status(400).json({
          error: 'Invalid shortId format',
        });
        return;
      }

      // 验证短链接存在
      const shortLink = await trackerService.resolveShortLink(shortId);
      
      if (!shortLink) {
        res.status(404).json({
          error: 'Short link not found',
          shortId,
        });
        return;
      }

      // 提取并匿名化 IP 地址
      const ipAddress = extractAndAnonymizeIP(
        req.headers as Record<string, string | string[] | undefined>,
        req.ip
      );

      // 提取 UTM 参数
      const utmParams = validateUTMParams(
        extractUTMFromQuery(req.query as Record<string, string | string[] | undefined>)
      );

      // 记录点击事件
      const clickEventId = await trackerService.recordClickEvent({
        shortId,
        ipAddress,
        userAgent: req.get('user-agent') || null,
        referrer: req.get('referer') || null,
        utmParams,
      });

      // 返回落地页数据
      res.json({
        shortId,
        longUrl: shortLink.longUrl,
        clickEventId: clickEventId.toString(),
        utmParams,
      });
    } catch (error) {
      console.error('Error handling short link access:', error);
      res.status(500).json({
        error: 'Internal server error',
      });
    }
  }

  /**
   * 处理按钮点击
   * POST /api/tracker/button-click
   * 
   * Body: { clickEventId: string, shortId: string }
   */
  async handleButtonClick(req: Request, res: Response): Promise<void> {
    try {
      const { clickEventId, shortId } = req.body;

      // 验证请求参数
      if (!clickEventId || !shortId) {
        res.status(400).json({
          error: 'Missing required parameters',
          required: ['clickEventId', 'shortId'],
        });
        return;
      }

      // 验证 clickEventId 格式
      let clickEventIdNumber: number;
      try {
        clickEventIdNumber = parseInt(clickEventId, 10);
        if (isNaN(clickEventIdNumber)) {
          throw new Error('Invalid number');
        }
      } catch {
        res.status(400).json({
          error: 'Invalid clickEventId format',
        });
        return;
      }

      // 验证点击事件存在
      const clickEvent = await trackerService.getClickEvent(clickEventIdNumber);
      if (!clickEvent) {
        res.status(404).json({
          error: 'Click event not found',
        });
        return;
      }

      // 验证短链接匹配
      if (clickEvent.shortId !== shortId) {
        res.status(400).json({
          error: 'Short ID does not match click event',
        });
        return;
      }

      // 记录按钮点击
      await trackerService.recordButtonClick(clickEventIdNumber, shortId);

      res.json({
        success: true,
        message: 'Button click recorded',
      });
    } catch (error) {
      console.error('Error handling button click:', error);
      res.status(500).json({
        error: 'Internal server error',
      });
    }
  }

  /**
   * 创建短链接
   * POST /api/tracker/short-links
   * 
   * Body: { shortId: string, longUrl: string }
   */
  async createShortLink(req: Request, res: Response): Promise<void> {
    try {
      const { shortId, longUrl } = req.body;

      // 验证请求参数
      if (!shortId || !longUrl) {
        res.status(400).json({
          error: 'Missing required parameters',
          required: ['shortId', 'longUrl'],
        });
        return;
      }

      // 验证 shortId 格式（只允许字母、数字、连字符、下划线）
      if (!/^[a-zA-Z0-9_-]+$/.test(shortId)) {
        res.status(400).json({
          error: 'Invalid shortId format',
          message: 'Only alphanumeric characters, hyphens, and underscores are allowed',
        });
        return;
      }

      // 验证 longUrl 格式
      try {
        new URL(longUrl);
      } catch {
        res.status(400).json({
          error: 'Invalid longUrl format',
          message: 'Must be a valid URL',
        });
        return;
      }

      // 检查短链接是否已存在
      const exists = await trackerService.shortLinkExists(shortId);
      if (exists) {
        res.status(409).json({
          error: 'Short link already exists',
          shortId,
        });
        return;
      }

      // 创建短链接
      const shortLink = await trackerService.createShortLink(shortId, longUrl);

      res.status(201).json({
        success: true,
        shortLink,
      });
    } catch (error) {
      console.error('Error creating short link:', error);
      res.status(500).json({
        error: 'Internal server error',
      });
    }
  }

  /**
   * 获取短链接统计
   * GET /api/tracker/stats/:shortId
   */
  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const { shortId } = req.params;

      // 验证 shortId 类型
      if (Array.isArray(shortId)) {
        res.status(400).json({
          error: 'Invalid shortId format',
        });
        return;
      }

      const stats = await trackerService.getClickStats(shortId);

      res.json(stats);
    } catch (error) {
      if (error instanceof Error && error.message === 'Short link not found') {
        res.status(404).json({
          error: 'Short link not found',
        });
        return;
      }

      console.error('Error getting stats:', error);
      res.status(500).json({
        error: 'Internal server error',
      });
    }
  }
}

// 导出单例实例
export const trackerController = new TrackerController();
