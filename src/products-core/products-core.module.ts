import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { ProductSkusModule } from './product-skus/product-skus.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ImagesModule } from './images/images.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ProductsModule,
    ProductSkusModule,
    CloudinaryModule,
    ImagesModule,
    CategoriesModule,
  ],
})
export class ProductsCoreModule {}
