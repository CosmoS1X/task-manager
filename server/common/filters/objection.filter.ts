import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common';
import type { Response } from 'express';
import { ForeignKeyViolationError, UniqueViolationError, NotNullViolationError } from 'objection';
import env from '../../../env';

@Catch(ForeignKeyViolationError, UniqueViolationError, NotNullViolationError)
export class ObjectionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ObjectionFilter.name);

  catch(error: Error, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    let status = HttpStatus.BAD_REQUEST;
    let message = 'Database error occurred';

    if (error instanceof ForeignKeyViolationError) {
      status = HttpStatus.CONFLICT;
      message = 'Cannot delete resource because it is referenced by other records';
    } else if (error instanceof UniqueViolationError) {
      status = HttpStatus.CONFLICT;
      message = 'Duplicate entry violates unique constraint';
    } else if (error instanceof NotNullViolationError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'A required field is missing';
    }

    this.logger.warn(`${error.name}: ${message}`);

    response.status(status).json({
      statusCode: status,
      error: error.name,
      message,
      ...env.isDevelopment && { details: error.message },
    });
  }
}
