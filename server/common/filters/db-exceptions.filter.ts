import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common';
import type { Response } from 'express';
import { ForeignKeyViolationError, UniqueViolationError, NotNullViolationError } from 'objection';
import env from '../../../env';

@Catch(ForeignKeyViolationError, UniqueViolationError, NotNullViolationError)
export class DbExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(DbExceptionsFilter.name);

  catch(error: Error, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    let status;
    let message;

    switch (error.constructor) {
      case ForeignKeyViolationError:
        status = HttpStatus.CONFLICT;
        message = 'Referenced resource is in use by other records or does not exist';
        break;
      /* istanbul ignore next */ // unreachable if services have passed all checks
      case UniqueViolationError:
        status = HttpStatus.CONFLICT;
        message = 'Duplicate entry violates unique constraint';
        break;
      /* istanbul ignore next */ // unreachable if nest validation is triggered
      case NotNullViolationError:
        status = HttpStatus.BAD_REQUEST;
        message = 'A required field is missing';
        break;
      /* istanbul ignore next */
      default:
        status = HttpStatus.BAD_REQUEST;
        message = 'Database error occurred';
    }

    this.logger.warn(`${error.name}: ${message}`);

    response.status(status).json({
      statusCode: status,
      error: error.name,
      message,
      ...(!env.isProduction && { details: error.message }),
    });
  }
}
