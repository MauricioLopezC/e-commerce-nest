import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { ProductSkusModule } from './product-skus/product-skus.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [ProductsModule, ProductSkusModule, CloudinaryModule],
})
export class ProductsCoreModule { }
