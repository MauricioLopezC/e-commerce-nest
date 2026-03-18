import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import {
  BusinessError,
  ForeignKeyError,
  NotAllowedError,
  NotFoundError,
  UniqueConstraintError,
  UploadImageError,
  ValidationError,
} from 'src/common/errors/business-error';

@Catch(BusinessError)
export class BusinessExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(BusinessExceptionFilter.name);

  catch(exception: BusinessError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    let status = HttpStatus.BAD_REQUEST;

    if (exception instanceof NotFoundError) {
      status = HttpStatus.NOT_FOUND;
    } else if (exception instanceof UniqueConstraintError) {
      status = HttpStatus.CONFLICT;
    } else if (exception instanceof ValidationError) {
      status = HttpStatus.BAD_REQUEST;
    } else if (exception instanceof NotAllowedError) {
      status = HttpStatus.FORBIDDEN;
    } else if (exception instanceof UploadImageError) {
      status = HttpStatus.BAD_REQUEST;
    } else if (exception instanceof ForeignKeyError) {
      status = HttpStatus.CONFLICT;
    }

    this.logger.warn(
      `Business Error: ${exception.name} - ${exception.message}`,
    );

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      error: exception.name,
    });
  }
}
