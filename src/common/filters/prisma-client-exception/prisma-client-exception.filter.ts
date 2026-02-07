import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from 'src/generated/prisma/client';
import { Response } from 'express';
import {
  foreignKeyConstraint,
  operationFailedRecordNotFound,
  recordNotFound,
  uniqueConstraint,
} from 'src/common/prisma-erros';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  //TODO: enable this filter globaly
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    console.log('*******************');
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = exception.message.replace(/\n/g, '');

    console.log(exception);

    switch (exception.code) {
      case uniqueConstraint: {
        const status = HttpStatus.CONFLICT;
        response.status(status).json({
          statusCode: status,
          message: `Unique constraint failed`,
        });
        break;
      }
      case recordNotFound: {
        const status = HttpStatus.NOT_FOUND;
        response.status(status).json({
          statusCode: status,
          message,
        });
        break;
      }
      case operationFailedRecordNotFound: {
        const status = HttpStatus.NOT_FOUND;
        response.status(status).json({
          satusCode: status,
          message: `${exception.meta.modelName ?? ''} not found, ${exception.meta?.cause}`,
        });
        break;
      }
      case foreignKeyConstraint: {
        const status = HttpStatus.CONFLICT;
        response.status(status).json({
          statusCode: status,
          message: 'Foreing key constraint failed',
        });
      }
      default: {
        // default 500 error code
        console.log('****** DEFAULT *****');
        super.catch(exception, host);
        break;
      }
    }
  }
}
