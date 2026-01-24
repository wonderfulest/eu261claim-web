import { Request, Response, NextFunction } from 'express';
import {
  ShortLinkNotFoundError,
  DatabaseError,
  ValidationError,
  NetworkTimeoutError,
  ConflictError,
} from './errors';

/**
 * 错误响应接口
 */
interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  fields?: string[];
  timestamp: string;
}

/**
 * 全局错误处理中间件
 * 
 * 捕获所有错误并返回适当的 HTTP 响应
 */
export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // 记录错误（生产环境应使用专业的日志系统）
  console.error('Error occurred:', {
    name: error.name,
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
  });

  // 默认错误响应
  let response: ErrorResponse = {
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
    statusCode: 500,
    timestamp: new Date().toISOString(),
  };

  // 根据错误类型定制响应
  if (error instanceof ShortLinkNotFoundError) {
    response = {
      error: 'Not Found',
      message: error.message,
      statusCode: error.statusCode,
      timestamp: new Date().toISOString(),
    };
  } else if (error instanceof ValidationError) {
    response = {
      error: 'Validation Error',
      message: error.message,
      statusCode: error.statusCode,
      fields: error.fields,
      timestamp: new Date().toISOString(),
    };
  } else if (error instanceof DatabaseError) {
    response = {
      error: 'Database Error',
      message: process.env.NODE_ENV === 'development' 
        ? error.message 
        : 'A database error occurred',
      statusCode: error.statusCode,
      timestamp: new Date().toISOString(),
    };
  } else if (error instanceof NetworkTimeoutError) {
    response = {
      error: 'Timeout',
      message: error.message,
      statusCode: error.statusCode,
      timestamp: new Date().toISOString(),
    };
  } else if (error instanceof ConflictError) {
    response = {
      error: 'Conflict',
      message: error.message,
      statusCode: error.statusCode,
      timestamp: new Date().toISOString(),
    };
  } else if (error.name === 'PrismaClientKnownRequestError') {
    // Prisma 特定错误处理
    response = {
      error: 'Database Error',
      message: 'A database operation failed',
      statusCode: 500,
      timestamp: new Date().toISOString(),
    };
  }

  // 发送错误响应
  res.status(response.statusCode).json(response);
}

/**
 * 404 Not Found 处理器
 */
export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found',
    statusCode: 404,
    timestamp: new Date().toISOString(),
  });
}

/**
 * 异步路由处理器包装器
 * 自动捕获异步错误并传递给错误处理中间件
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
