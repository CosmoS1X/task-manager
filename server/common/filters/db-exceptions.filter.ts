import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import { QueryFailedError } from 'typeorm';
import env from '../../../env';

interface DriverError {
  code?: string;
  errno?: string | number;
  message?: string;
}

enum DbErrorCode {
  ForeignKeyViolation = '23503',
  UniqueViolation = '23505',
  NotNullViolation = '23502',
}

@Catch(QueryFailedError)
export class DbExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(DbExceptionsFilter.name);

  catch(error: QueryFailedError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const driverError = error.driverError as DriverError;
    const errorCode = driverError.code || driverError.errno;
    const errorMessage = driverError.message || error.message;

    let status: HttpStatus;
    let message: string;
    let errorName: string;

    switch (errorCode) {
      case DbErrorCode.ForeignKeyViolation:
        status = HttpStatus.CONFLICT;
        message = 'Referenced resource is in use by other records or does not exist';
        errorName = 'ForeignKeyViolationError';
        break;
      /* istanbul ignore next */ // unreachable if services have passed all checks
      case DbErrorCode.UniqueViolation:
        status = HttpStatus.CONFLICT;
        message = 'Duplicate entry violates unique constraint';
        errorName = 'UniqueViolationError';
        break;
      /* istanbul ignore next */ // unreachable if nest validation is triggered
      case DbErrorCode.NotNullViolation:
        status = HttpStatus.BAD_REQUEST;
        message = 'A required field is missing';
        errorName = 'NotNullViolationError';
        break;
      /* istanbul ignore next */
      default:
        if (error instanceof HttpException) {
          throw error;
        }

        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Database error occurred';
        errorName = 'QueryFailedError';

        this.logger.error(`Unhandled database error: ${errorCode} - ${errorMessage}`);
    }

    this.logger.warn(`${errorName} (${errorCode}): ${message}`);

    const responseBody = {
      statusCode: status,
      error: errorName,
      message,
      ...(!env.isProduction && { debugMessage: errorMessage }),
    };

    response.status(status).json(responseBody);
  }
}
