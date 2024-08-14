import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { ProductSkusModule } from './product-skus/product-skus.module';

@Module({
  imports: [ProductsModule, ProductSkusModule],
})
export class ProductsCoreModule { }
