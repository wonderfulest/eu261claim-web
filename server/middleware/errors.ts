/**
 * 自定义错误类
 */

/**
 * 短链接未找到错误
 */
export class ShortLinkNotFoundError extends Error {
  statusCode = 404;
  
  constructor(shortId: string) {
    super(`Short link not found: ${shortId}`);
    this.name = 'ShortLinkNotFoundError';
  }
}

/**
 * 数据库错误
 */
export class DatabaseError extends Error {
  statusCode = 500;
  
  constructor(message: string, public originalError?: Error) {
    super(message);
    this.name = 'DatabaseError';
  }
}

/**
 * 验证错误
 */
export class ValidationError extends Error {
  statusCode = 400;
  
  constructor(message: string, public fields?: string[]) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * 网络超时错误
 */
export class NetworkTimeoutError extends Error {
  statusCode = 504;
  
  constructor(message: string = 'Request timeout') {
    super(message);
    this.name = 'NetworkTimeoutError';
  }
}

/**
 * 冲突错误（如重复的短链接）
 */
export class ConflictError extends Error {
  statusCode = 409;
  
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}
