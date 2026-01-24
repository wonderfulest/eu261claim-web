/**
 * UTM 参数提取工具
 * 
 * 用于从 URL 或查询字符串中提取营销追踪参数
 * 支持标准的 UTM 参数：source, medium, campaign, content, term
 */

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
 * 从 URL 字符串中提取 UTM 参数
 * 
 * @param url - 完整的 URL 字符串
 * @returns UTM 参数对象
 * 
 * @example
 * extractUTMFromURL('https://example.com?utm_source=email&utm_medium=newsletter')
 * // returns { utm_source: 'email', utm_medium: 'newsletter' }
 */
export function extractUTMFromURL(url: string): UTMParams {
  try {
    const urlObj = new URL(url);
    return extractUTMFromSearchParams(urlObj.searchParams);
  } catch (error) {
    // 如果 URL 无效，返回空对象
    return {};
  }
}

/**
 * 从 URLSearchParams 对象中提取 UTM 参数
 * 
 * @param searchParams - URLSearchParams 对象
 * @returns UTM 参数对象
 */
export function extractUTMFromSearchParams(searchParams: URLSearchParams): UTMParams {
  const params: UTMParams = {};
  
  const utmSource = searchParams.get('utm_source');
  if (utmSource) params.utm_source = utmSource;
  
  const utmMedium = searchParams.get('utm_medium');
  if (utmMedium) params.utm_medium = utmMedium;
  
  const utmCampaign = searchParams.get('utm_campaign');
  if (utmCampaign) params.utm_campaign = utmCampaign;
  
  const utmContent = searchParams.get('utm_content');
  if (utmContent) params.utm_content = utmContent;
  
  const utmTerm = searchParams.get('utm_term');
  if (utmTerm) params.utm_term = utmTerm;
  
  return params;
}

/**
 * 从查询字符串对象中提取 UTM 参数
 * 
 * @param query - 查询参数对象（如 Express req.query）
 * @returns UTM 参数对象
 * 
 * @example
 * extractUTMFromQuery({ utm_source: 'email', utm_medium: 'newsletter', other: 'value' })
 * // returns { utm_source: 'email', utm_medium: 'newsletter' }
 */
export function extractUTMFromQuery(
  query: Record<string, string | string[] | undefined>
): UTMParams {
  const params: UTMParams = {};
  
  // 辅助函数：获取字符串值（处理数组情况）
  const getString = (value: string | string[] | undefined): string | undefined => {
    if (typeof value === 'string') return value;
    if (Array.isArray(value) && value.length > 0) return value[0];
    return undefined;
  };
  
  const utmSource = getString(query.utm_source);
  if (utmSource) params.utm_source = utmSource;
  
  const utmMedium = getString(query.utm_medium);
  if (utmMedium) params.utm_medium = utmMedium;
  
  const utmCampaign = getString(query.utm_campaign);
  if (utmCampaign) params.utm_campaign = utmCampaign;
  
  const utmContent = getString(query.utm_content);
  if (utmContent) params.utm_content = utmContent;
  
  const utmTerm = getString(query.utm_term);
  if (utmTerm) params.utm_term = utmTerm;
  
  return params;
}

/**
 * 检查是否包含任何 UTM 参数
 * 
 * @param params - UTM 参数对象
 * @returns 如果包含至少一个 UTM 参数则返回 true
 */
export function hasUTMParams(params: UTMParams): boolean {
  return Object.keys(params).length > 0;
}

/**
 * 验证 UTM 参数值的长度
 * 防止过长的参数值
 * 
 * @param params - UTM 参数对象
 * @param maxLength - 最大长度（默认 100）
 * @returns 验证后的 UTM 参数对象（截断过长的值）
 */
export function validateUTMParams(params: UTMParams, maxLength: number = 100): UTMParams {
  const validated: UTMParams = {};
  
  if (params.utm_source) {
    validated.utm_source = params.utm_source.substring(0, maxLength);
  }
  
  if (params.utm_medium) {
    validated.utm_medium = params.utm_medium.substring(0, maxLength);
  }
  
  if (params.utm_campaign) {
    validated.utm_campaign = params.utm_campaign.substring(0, maxLength);
  }
  
  if (params.utm_content) {
    validated.utm_content = params.utm_content.substring(0, maxLength);
  }
  
  if (params.utm_term) {
    validated.utm_term = params.utm_term.substring(0, maxLength);
  }
  
  return validated;
}

/**
 * 将 UTM 参数转换为查询字符串
 * 
 * @param params - UTM 参数对象
 * @returns 查询字符串（不包含 ?）
 * 
 * @example
 * utmParamsToQueryString({ utm_source: 'email', utm_medium: 'newsletter' })
 * // returns 'utm_source=email&utm_medium=newsletter'
 */
export function utmParamsToQueryString(params: UTMParams): string {
  const searchParams = new URLSearchParams();
  
  if (params.utm_source) searchParams.set('utm_source', params.utm_source);
  if (params.utm_medium) searchParams.set('utm_medium', params.utm_medium);
  if (params.utm_campaign) searchParams.set('utm_campaign', params.utm_campaign);
  if (params.utm_content) searchParams.set('utm_content', params.utm_content);
  if (params.utm_term) searchParams.set('utm_term', params.utm_term);
  
  return searchParams.toString();
}
