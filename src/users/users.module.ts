import { Module } from '@nestjs/common';
import { UsersController } from './users.admin.controller';
import { UsersService } from './users.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MeController } from './me/me.controller';

@Module({
  controllers: [UsersController, MeController],
  providers: [UsersService],
  imports: [PrismaModule],
  exports: [UsersService],
})
export class UsersModule {}
