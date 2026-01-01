import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { SearchModule } from './search/search.module';
import { ProductsCoreModule } from './products-core/products-core.module';
import { StatisticsModule } from './statistics/statistics.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import { CartModule } from './cart/cart.module';
import { CartItemsModule } from './cart-items/cart-items.module';
import { FavoritesModule } from './favorites/favorites.module';
import { MailsModule } from './mails/mails.module';
import { PromotionsModule } from './promotions/promotions.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ProductsCoreModule,
    UsersModule,
    AuthModule,
    PrismaModule,
    SearchModule,
    CartModule,
    CartItemsModule,
    FavoritesModule,
    MailsModule,
    PromotionsModule,
    OrdersModule,
    StatisticsModule,
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
