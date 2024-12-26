import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ResendModule } from 'nestjs-resend';
import { OrdersAdminController } from './orders-admin/orders-admin.controller';
import { OrdersAdminService } from './orders-admin/orders-admin.service';

@Module({
  controllers: [OrdersController, OrdersAdminController],
  providers: [OrdersService, OrdersAdminService],
  imports: [
    PrismaModule,
    ResendModule.forRoot({
      //TODO: save apiKey in a .env file
      apiKey: "RESEND_API_KEY_REDACTED"
    })
  ]
})
export class OrdersModule { }
