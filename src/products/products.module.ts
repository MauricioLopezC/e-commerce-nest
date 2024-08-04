import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductSkusModule } from './product-skus/product-skus.module';
import { ImagesModule } from './images/images.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [PrismaModule, ProductSkusModule, ImagesModule]
})
export class ProductsModule { }
