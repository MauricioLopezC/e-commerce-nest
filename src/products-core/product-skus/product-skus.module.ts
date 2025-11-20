import { Module } from '@nestjs/common';
import { ProductSkusService } from './product-skus.service';
import { ProductSkusController } from './product-skus.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ProductSkusController],
  providers: [ProductSkusService],
  imports: [PrismaModule],
})
export class ProductSkusModule {}
