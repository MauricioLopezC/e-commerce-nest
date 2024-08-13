import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { CoreModule } from './core/core.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [ProductsModule, UsersModule, AuthModule, PrismaModule, CoreModule, SearchModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
