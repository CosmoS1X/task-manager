import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggingMiddleware.name);

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const userId = req.session?.userId || 'Guest';

    const start = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length') || 0;
      const responseTime = Date.now() - start;

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${responseTime}ms - ${contentLength} - ${userAgent} - ${ip} - User ID: ${userId}`,
      );
    });

    next();
  }
}
