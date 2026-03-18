import {
  Catch,
  ExceptionFilter,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ForeignKeyError,
  NotFoundError,
  UniqueConstraintError,
} from 'src/common/errors/business-error';
import { Prisma } from 'src/generated/prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);
  catch(error: Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2025') {
      this.logger.warn(
        `Prisma P2025: ${error.meta?.cause ?? 'Record not found'}`,
      );
      throw new NotFoundError('The requested resource was not found.');
    }

    if (error.code === 'P2002') {
      const fields = (error.meta as any)?.target?.join(', ') ?? 'unknown field';

      this.logger.warn(
        `Prisma P2002 (unique constraint) on field(s): ${fields}`,
      );
      throw new UniqueConstraintError(
        'One or more fields already exist. Please check your data and try again.',
      );
    }

    if (error.code === 'P2003') {
      const field = (error.meta as any)?.target ?? 'unknown field';
      this.logger.warn(
        `Prisma P2003 (foreign key constraint) on field: ${field}`,
      );

      throw new ForeignKeyError(
        'This operation cannot be completed because a related record is missing or restricted.',
      );
    }

    this.logger.error(`Unhandled Prisma error (${error.code})`, error.stack);

    throw new InternalServerErrorException('An unexpected database error occurred.');
  }
}
