import { Module } from '@nestjs/common';
import { CartModule } from './cart/cart.module';
import { FavoritesModule } from './favorites/favorites.module';
import { PurchasesModule } from './purchases/purchases.module';
import { CartItemsModule } from './cart-items/cart-items.module';

@Module({
  imports: [CartModule, FavoritesModule, PurchasesModule, CartItemsModule]
})
export class CoreModule {}
