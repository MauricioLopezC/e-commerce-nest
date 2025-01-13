import { Module } from '@nestjs/common';
import { CartModule } from './cart/cart.module';
import { FavoritesModule } from './favorites/favorites.module';
import { PurchasesModule } from './purchases/purchases.module';
import { CartItemsModule } from './cart-items/cart-items.module';
import { OrdersModule } from './orders/orders.module';
import { PromotionsModule } from './promotions/promotions.module';

@Module({
  imports: [CartModule, FavoritesModule, PurchasesModule, CartItemsModule, OrdersModule, PromotionsModule]
})
export class CoreModule { }
