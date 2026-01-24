import pool from '../models/db';
import { UTMParams } from '../utils/utm';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

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
 * TrackerService - 使用原生 MySQL 查询
 */
export class TrackerService {
  /**
   * 解析短链接
   */
  async resolveShortLink(shortId: string): Promise<ShortLinkData | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT short_id as shortId, long_url as longUrl FROM short_links WHERE short_id = ?',
      [shortId]
    );
    
    return rows.length > 0 ? rows[0] as ShortLinkData : null;
  }

  /**
   * 记录点击事件
   */
  async recordClickEvent(data: ClickEventData): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO click_events 
       (short_id, ip_address, user_agent, referrer, utm_source, utm_medium, utm_campaign, utm_content, utm_term) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.shortId,
        data.ipAddress,
        data.userAgent,
        data.referrer,
        data.utmParams.utm_source,
        data.utmParams.utm_medium,
        data.utmParams.utm_campaign,
        data.utmParams.utm_content,
        data.utmParams.utm_term,
      ]
    );
    
    return result.insertId;
  }

  /**
   * 记录按钮点击
   */
  async recordButtonClick(clickEventId: number, shortId: string): Promise<void> {
    await pool.query(
      'INSERT INTO button_clicks (click_event_id, short_id) VALUES (?, ?)',
      [clickEventId, shortId]
    );
  }

  /**
   * 创建短链接
   */
  async createShortLink(shortId: string, longUrl: string): Promise<ShortLinkData> {
    await pool.query(
      'INSERT INTO short_links (short_id, long_url) VALUES (?, ?)',
      [shortId, longUrl]
    );
    
    return { shortId, longUrl };
  }

  /**
   * 检查短链接是否存在
   */
  async shortLinkExists(shortId: string): Promise<boolean> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM short_links WHERE short_id = ?',
      [shortId]
    );
    
    return rows[0].count > 0;
  }

  /**
   * 获取点击事件
   */
  async getClickEvent(clickEventId: number) {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM click_events WHERE id = ?',
      [clickEventId]
    );
    
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * 获取点击统计
   */
  async getClickStats(shortId: string) {
    // 验证短链接存在
    const shortLink = await this.resolveShortLink(shortId);
    if (!shortLink) {
      throw new Error('Short link not found');
    }

    // 获取总点击数
    const [clickRows] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM click_events WHERE short_id = ?',
      [shortId]
    );
    const totalClicks = clickRows[0].count;

    // 获取总按钮点击数
    const [buttonRows] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM button_clicks WHERE short_id = ?',
      [shortId]
    );
    const totalButtonClicks = buttonRows[0].count;

    // 获取 UTM 统计
    const [utmRows] = await pool.query<RowDataPacket[]>(
      'SELECT utm_source, utm_medium, utm_campaign FROM click_events WHERE short_id = ?',
      [shortId]
    );

    const utmBreakdown = {
      source: {} as Record<string, number>,
      medium: {} as Record<string, number>,
      campaign: {} as Record<string, number>,
    };

    for (const row of utmRows) {
      if (row.utm_source) {
        utmBreakdown.source[row.utm_source] = (utmBreakdown.source[row.utm_source] || 0) + 1;
      }
      if (row.utm_medium) {
        utmBreakdown.medium[row.utm_medium] = (utmBreakdown.medium[row.utm_medium] || 0) + 1;
      }
      if (row.utm_campaign) {
        utmBreakdown.campaign[row.utm_campaign] = (utmBreakdown.campaign[row.utm_campaign] || 0) + 1;
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
}

// 导出单例
export const trackerService = new TrackerService();
