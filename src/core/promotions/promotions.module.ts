import { Module } from '@nestjs/common';
import { DiscountsService } from './discounts/discounts.service';
import { DiscountsCodesService } from './discounts-codes/discounts-codes.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DiscountsController } from './discounts/discounts.controller';

@Module({
  providers: [DiscountsService, DiscountsCodesService],
  imports: [PrismaModule],
  exports: [DiscountsCodesService, DiscountsService],
  controllers: [DiscountsController],
})
export class PromotionsModule {}
