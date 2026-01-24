/**
 * IP 地址匿名化工具
 * 
 * 根据隐私要求，移除 IP 地址的最后一段以保护用户隐私
 * 符合 GDPR 和其他隐私法规要求
 */

/**
 * 匿名化 IPv4 地址
 * 移除最后一段，替换为 0
 * 
 * @param ip - IPv4 地址字符串
 * @returns 匿名化后的 IP 地址
 * 
 * @example
 * anonymizeIPv4('192.168.1.100') // returns '192.168.1.0'
 * anonymizeIPv4('10.0.0.1') // returns '10.0.0.0'
 */
export function anonymizeIPv4(ip: string): string {
  const parts = ip.split('.');
  
  if (parts.length !== 4) {
    throw new Error('Invalid IPv4 address format');
  }
  
  // 验证每一段都是有效的数字
  for (const part of parts) {
    const num = parseInt(part, 10);
    if (isNaN(num) || num < 0 || num > 255) {
      throw new Error('Invalid IPv4 address format');
    }
  }
  
  // 替换最后一段为 0
  parts[3] = '0';
  return parts.join('.');
}

/**
 * 匿名化 IPv6 地址
 * 移除最后 64 位（后 4 组）
 * 
 * @param ip - IPv6 地址字符串
 * @returns 匿名化后的 IP 地址
 * 
 * @example
 * anonymizeIPv6('2001:0db8:85a3:0000:0000:8a2e:0370:7334') 
 * // returns '2001:0db8:85a3:0000::'
 */
export function anonymizeIPv6(ip: string): string {
  // 简化的 IPv6 处理：保留前 64 位（前 4 组）
  const parts = ip.split(':');
  
  if (parts.length < 3) {
    throw new Error('Invalid IPv6 address format');
  }
  
  // 保留前 4 组，其余替换为 0
  const anonymized = parts.slice(0, 4).concat(['', '']);
  return anonymized.join(':');
}

/**
 * 自动检测并匿名化 IP 地址（IPv4 或 IPv6）
 * 
 * @param ip - IP 地址字符串
 * @returns 匿名化后的 IP 地址，如果输入无效则返回 null
 * 
 * @example
 * anonymizeIP('192.168.1.100') // returns '192.168.1.0'
 * anonymizeIP('2001:0db8:85a3::7334') // returns '2001:0db8:85a3:0000::'
 * anonymizeIP('invalid') // returns null
 */
export function anonymizeIP(ip: string | null | undefined): string | null {
  if (!ip) {
    return null;
  }
  
  try {
    // 检测是 IPv4 还是 IPv6
    if (ip.includes(':')) {
      return anonymizeIPv6(ip);
    } else if (ip.includes('.')) {
      return anonymizeIPv4(ip);
    } else {
      return null;
    }
  } catch (error) {
    // 如果格式无效，返回 null
    return null;
  }
}

/**
 * 从请求中提取并匿名化 IP 地址
 * 考虑代理和负载均衡器的情况
 * 
 * @param headers - 请求头对象
 * @param remoteAddress - 远程地址
 * @returns 匿名化后的 IP 地址
 */
export function extractAndAnonymizeIP(
  headers: Record<string, string | string[] | undefined>,
  remoteAddress?: string
): string | null {
  // 尝试从各种头部获取真实 IP
  const forwardedFor = headers['x-forwarded-for'];
  const realIP = headers['x-real-ip'];
  
  let ip: string | undefined;
  
  if (typeof forwardedFor === 'string') {
    // X-Forwarded-For 可能包含多个 IP，取第一个
    ip = forwardedFor.split(',')[0].trim();
  } else if (Array.isArray(forwardedFor) && forwardedFor.length > 0) {
    ip = forwardedFor[0].split(',')[0].trim();
  } else if (typeof realIP === 'string') {
    ip = realIP;
  } else if (Array.isArray(realIP) && realIP.length > 0) {
    ip = realIP[0];
  } else {
    ip = remoteAddress;
  }
  
  return anonymizeIP(ip);
}
