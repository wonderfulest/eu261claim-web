import { prisma } from '../models/prisma';
import { UTMParams } from '../utils/utm';

/**
 * 点击事件数据接口
 */
export interface ClickEventData {
  shortId: string;
  ipAddress: string | null;
  userAgent: string | null;
  referrer?: string | null;
  utmParams: UTMParams;
}

/**
 * 短链接数据接口
 */
export interface ShortLinkData {
  shortId: string;
  longUrl: string;
}

/**
 * 点击统计接口
 */
export interface ClickStats {
  shortId: string;
  longUrl: string;
  totalClicks: number;
  totalButtonClicks: number;
  utmBreakdown: {
    source: Record<string, number>;
    medium: Record<string, number>;
    campaign: Record<string, number>;
  };
}

/**
 * TrackerService - 追踪系统核心业务逻辑
 * 
 * 负责处理短链接解析、点击事件记录和按钮点击追踪
 */
export class TrackerService {
  /**
   * 解析短链接，获取对应的长 URL
   * 
   * @param shortId - 短链接标识符
   * @returns 短链接数据，如果不存在则返回 null
   */
  async resolveShortLink(shortId: string): Promise<ShortLinkData | null> {
    const shortLink = await prisma.shortLink.findUnique({
      where: { shortId },
      select: {
        shortId: true,
        longUrl: true,
      },
    });

    return shortLink;
  }

  /**
   * 记录点击事件
   * 
   * @param data - 点击事件数据
   * @returns 创建的点击事件 ID
   */
  async recordClickEvent(data: ClickEventData): Promise<bigint> {
    const clickEvent = await prisma.clickEvent.create({
      data: {
        shortId: data.shortId,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        referrer: data.referrer,
        utmSource: data.utmParams.utm_source,
        utmMedium: data.utmParams.utm_medium,
        utmCampaign: data.utmParams.utm_campaign,
        utmContent: data.utmParams.utm_content,
        utmTerm: data.utmParams.utm_term,
      },
    });

    return clickEvent.id;
  }

  /**
   * 记录按钮点击
   * 
   * @param clickEventId - 关联的点击事件 ID
   * @param shortId - 短链接标识符
   */
  async recordButtonClick(clickEventId: bigint, shortId: string): Promise<void> {
    await prisma.buttonClick.create({
      data: {
        clickEventId,
        shortId,
      },
    });
  }

  /**
   * 创建新的短链接
   * 
   * @param shortId - 短链接标识符
   * @param longUrl - 目标长 URL
   * @returns 创建的短链接数据
   * @throws 如果短链接已存在
   */
  async createShortLink(shortId: string, longUrl: string): Promise<ShortLinkData> {
    const shortLink = await prisma.shortLink.create({
      data: {
        shortId,
        longUrl,
      },
      select: {
        shortId: true,
        longUrl: true,
      },
    });

    return shortLink;
  }

  /**
   * 获取短链接的点击统计
   * 
   * @param shortId - 短链接标识符
   * @returns 点击统计数据
   * @throws 如果短链接不存在
   */
  async getClickStats(shortId: string): Promise<ClickStats> {
    // 验证短链接存在
    const shortLink = await prisma.shortLink.findUnique({
      where: { shortId },
    });

    if (!shortLink) {
      throw new Error('Short link not found');
    }

    // 获取总点击数
    const totalClicks = await prisma.clickEvent.count({
      where: { shortId },
    });

    // 获取总按钮点击数
    const totalButtonClicks = await prisma.buttonClick.count({
      where: { shortId },
    });

    // 获取 UTM 来源分布
    const clickEvents = await prisma.clickEvent.findMany({
      where: { shortId },
      select: {
        utmSource: true,
        utmMedium: true,
        utmCampaign: true,
      },
    });

    // 统计 UTM 参数分布
    const utmBreakdown = {
      source: {} as Record<string, number>,
      medium: {} as Record<string, number>,
      campaign: {} as Record<string, number>,
    };

    for (const event of clickEvents) {
      if (event.utmSource) {
        utmBreakdown.source[event.utmSource] = 
          (utmBreakdown.source[event.utmSource] || 0) + 1;
      }
      if (event.utmMedium) {
        utmBreakdown.medium[event.utmMedium] = 
          (utmBreakdown.medium[event.utmMedium] || 0) + 1;
      }
      if (event.utmCampaign) {
        utmBreakdown.campaign[event.utmCampaign] = 
          (utmBreakdown.campaign[event.utmCampaign] || 0) + 1;
      }
    }

    return {
      shortId: shortLink.shortId,
      longUrl: shortLink.longUrl,
      totalClicks,
      totalButtonClicks,
      utmBreakdown,
    };
  }

  /**
   * 检查短链接是否存在
   * 
   * @param shortId - 短链接标识符
   * @returns 如果存在返回 true
   */
  async shortLinkExists(shortId: string): Promise<boolean> {
    const count = await prisma.shortLink.count({
      where: { shortId },
    });
    return count > 0;
  }

  /**
   * 获取点击事件详情
   * 
   * @param clickEventId - 点击事件 ID
   * @returns 点击事件数据，如果不存在则返回 null
   */
  async getClickEvent(clickEventId: bigint) {
    return await prisma.clickEvent.findUnique({
      where: { id: clickEventId },
    });
  }
}

// 导出单例实例
export const trackerService = new TrackerService();
