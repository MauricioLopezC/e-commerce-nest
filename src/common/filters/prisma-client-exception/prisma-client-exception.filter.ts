import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from 'src/generated/prisma/client';
import { Response } from 'express';

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
      case 'P2002': {
        const status = HttpStatus.CONFLICT;
        response.status(status).json({
          statusCode: status,
          message: `Unique constraint failed`,
        });
        break;
      }
      case 'P2001': {
        const status = HttpStatus.NOT_FOUND;
        response.status(status).json({
          statusCode: status,
          message,
        });
        break;
      }
      case 'P2025': {
        const status = HttpStatus.NOT_FOUND;
        response.status(status).json({
          satusCode: status,
          message: `${exception.meta.modelName ?? ''} not found, ${exception.meta?.cause}`,
        });
        break;
      }
      case 'P2003': {
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
