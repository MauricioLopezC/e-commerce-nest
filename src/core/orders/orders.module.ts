import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ResendModule } from 'nestjs-resend';
import { OrdersAdminController } from './orders-admin/orders-admin.controller';
import { OrdersAdminService } from './orders-admin/orders-admin.service';
import { PromotionsModule } from '../promotions/promotions.module';

@Module({
  controllers: [OrdersController, OrdersAdminController],
  providers: [OrdersService, OrdersAdminService],
  imports: [
    PrismaModule,
    PromotionsModule,
    ResendModule.forRoot({
      //TODO: save apiKey in a .env file
      apiKey: "re_d4pkNey4_PvNot3fwc7c8kDfDymYNhgnF"
    })
  ]
})
export class OrdersModule { }
