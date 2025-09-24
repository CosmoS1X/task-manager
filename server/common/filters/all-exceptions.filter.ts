import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
  Logger,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { ForeignKeyViolationError } from 'objection';
import Rollbar from 'rollbar';
import env from '../../../env';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  private readonly rollbar = new Rollbar({
    enabled: env.isProduction,
    accessToken: env.ROLLBAR_ACCESS_TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true,
  });

  catch(error: Error, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    if (error instanceof ForeignKeyViolationError) {
      this.logger.warn('Foreign key violation');

      const status = HttpStatus.CONFLICT;

      response.status(status).json({
        statusCode: status,
        error: 'ForeignKeyViolation',
        message: 'Cannot delete resource because it is referenced by other records',
      });

      return;
    }

    if (error instanceof HttpException) {
      const status = error.getStatus();
      const errorResponse = error.getResponse();

      if (status >= 500) {
        this.logger.error(`Error ${status}:`, error.stack);
        this.rollbar.error(error, request);
      } else {
        this.logger.warn(`Error ${status}: ${error.message}`);
      }

      response.status(status).json(errorResponse);

      return;
    }

    this.logger.error('An unexpected error occurred', error.stack);
    this.rollbar.error(error, request);

    const status = HttpStatus.INTERNAL_SERVER_ERROR;

    response
      .status(status)
      .json({ statusCode: status, error: 'InternalServerError', message: 'Internal Server Error' })
      .end();
  }
}
