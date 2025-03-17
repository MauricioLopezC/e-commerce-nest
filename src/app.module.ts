import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { CoreModule } from './core/core.module';
import { SearchModule } from './search/search.module';
import { ProductsCoreModule } from './products-core/products-core.module';
import { StatisticsModule } from './statistics/statistics.module';

@Module({
  imports: [ProductsCoreModule, UsersModule, AuthModule, PrismaModule, CoreModule, SearchModule, StatisticsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
