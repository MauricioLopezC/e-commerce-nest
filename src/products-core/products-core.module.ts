import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { ProductSkusModule } from './product-skus/product-skus.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ImagesModule } from './images/images.module';

@Module({
  imports: [ProductsModule, ProductSkusModule, CloudinaryModule, ImagesModule],
})
export class ProductsCoreModule { }
