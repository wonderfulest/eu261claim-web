import axios from 'axios';

/**
 * 追踪 API 客户端
 */

const API_BASE_URL = import.meta.env.VITE_TRACKER_API_URL || '/api/tracker';

/**
 * UTM 参数接口
 */
export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

/**
 * 短链接信息接口
 */
export interface ShortLinkInfo {
  shortId: string;
  longUrl: string;
  clickEventId: string;
  utmParams: UTMParams;
}

/**
 * 按钮点击请求接口
 */
export interface ButtonClickRequest {
  clickEventId: string;
  shortId: string;
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
 * 获取短链接信息
 * 
 * @param shortId - 短链接标识符
 * @param utmParams - UTM 参数（可选）
 * @returns 短链接信息
 */
export async function getShortLinkInfo(
  shortId: string,
  utmParams?: UTMParams
): Promise<ShortLinkInfo> {
  const params = new URLSearchParams();
  
  if (utmParams?.utm_source) params.set('utm_source', utmParams.utm_source);
  if (utmParams?.utm_medium) params.set('utm_medium', utmParams.utm_medium);
  if (utmParams?.utm_campaign) params.set('utm_campaign', utmParams.utm_campaign);
  if (utmParams?.utm_content) params.set('utm_content', utmParams.utm_content);
  if (utmParams?.utm_term) params.set('utm_term', utmParams.utm_term);
  
  const queryString = params.toString();
  const url = `/${shortId}${queryString ? `?${queryString}` : ''}`;
  
  const response = await axios.get<ShortLinkInfo>(url);
  return response.data;
}

/**
 * 记录按钮点击
 * 
 * @param shortId - 短链接标识符
 * @param clickEventId - 点击事件ID（可选）
 */
export async function recordButtonClick(shortId: string, clickEventId?: string): Promise<void> {
  await axios.post(`${API_BASE_URL}/button-click`, {
    shortId,
    clickEventId: clickEventId || null
  });
}

/**
 * 创建短链接
 * 
 * @param shortId - 短链接标识符
 * @param longUrl - 目标长 URL
 * @returns 创建的短链接信息
 */
export async function createShortLink(
  shortId: string,
  longUrl: string
): Promise<{ shortId: string; longUrl: string }> {
  const response = await axios.post(`${API_BASE_URL}/short-links`, {
    shortId,
    longUrl,
  });
  return response.data.shortLink;
}

/**
 * 获取短链接统计
 * 
 * @param shortId - 短链接标识符
 * @returns 点击统计数据
 */
export async function getClickStats(shortId: string): Promise<ClickStats> {
  const response = await axios.get<ClickStats>(`${API_BASE_URL}/stats/${shortId}`);
  return response.data;
}
