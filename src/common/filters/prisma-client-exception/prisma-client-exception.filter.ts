import { Catch, ExceptionFilter, Logger, InternalServerErrorException } from '@nestjs/common';
import {
  NotFoundError,
  UniqueConstraintError,
} from 'src/common/errors/business-error';
import { Prisma } from 'src/generated/prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);
  catch(error: Prisma.PrismaClientKnownRequestError) {
    console.log(error.meta);
    console.log(error.name);
    if (error.code === 'P2025') {
      this.logger.warn(
        `Prisma P2025: ${error.meta?.cause ?? 'Record not found'}`,
      );
      throw new NotFoundError('Resource not found');
    }

    if (error.code === 'P2002') {
      const fields = (error.meta as any)?.target?.join(', ') ?? 'unknown field';

      this.logger.warn(
        `Prisma P2002 (unique constraint) on field(s): ${fields}`,
      );
      throw new UniqueConstraintError(
        `Unique contraint on field(s): ${fields}`,
      );
    }

    this.logger.error(`Unhandled Prisma error (${error.code})`, error.stack);

    throw new InternalServerErrorException();
  }
}
