import { Module } from '@nestjs/common';
import { MailsService } from './mails.service';
import { MailsController } from './mails.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [MailsService],
  controllers: [MailsController],
  imports: [PrismaModule],
})
export class MailsModule {}
