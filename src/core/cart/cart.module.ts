import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PromotionsModule } from '../promotions/promotions.module';

@Module({
  controllers: [CartController],
  providers: [CartService],
  imports: [PrismaModule, PromotionsModule],
  exports: [CartService]
})
export class CartModule { }
