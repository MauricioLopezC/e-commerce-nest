import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { MeOrdersController } from './me-orders.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PromotionsModule } from '../promotions/promotions.module';
import { OrderCreatedListener } from './listeners/order-created.listener';
import { AdminUserOrdersController } from './admin-user-orders/admin-user-orders.controller';
import { AdminOrdersController } from './admin-orders/admin-orders.controller';

@Module({
  controllers: [
    MeOrdersController,
    AdminOrdersController,
    AdminUserOrdersController,
    AdminOrdersController,
  ],
  providers: [OrdersService, OrderCreatedListener],
  imports: [PrismaModule, PromotionsModule],
})
export class OrdersModule {}
