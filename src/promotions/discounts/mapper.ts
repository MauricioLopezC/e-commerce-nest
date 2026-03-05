import { Prisma } from 'src/generated/prisma/client';
import {
  DiscountResponseDto,
  DiscountsListResponseDto,
} from './dto/discounts-response.dto';
import { mapToProductResponseDto } from 'src/products-core/products/mapper';
import { mapToCategoryResponseDto } from 'src/products-core/categories/mapper';
import { ApplicableTo, DiscountType } from './enums/enums';

type DiscountWithRelations = Prisma.DiscountGetPayload<{
  include: {
    categories: true;
    products: {
      include: {
        images: true;
        categories: true;
      };
    };
  };
}>;

export type DiscountsListWithRelations = {
  discounts: DiscountWithRelations[];
  metadata: { _count: number };
};

export function mapToDiscountResponse(
  discount: DiscountWithRelations,
): DiscountResponseDto {
  return {
    id: discount.id,
    name: discount.name,
    description: discount.description,
    discountType: discount.discountType as DiscountType,
    value: discount.value,
    startDate: discount.startDate,
    endDate: discount.endDate,
    applicableTo: discount.applicableTo as ApplicableTo,
    orderThreshold: discount.orderThreshold
      ? discount.orderThreshold
      : undefined,
    maxUses: discount.maxUses,
    currentUses: discount.currentUses,
    isActive: discount.isActive,
    createdAt: discount.createdAt,
    updatedAt: discount.updatedAt,
    products: discount.products
      ? discount.products.map((p) => mapToProductResponseDto(p))
      : [],
    categories: discount.categories
      ? discount.categories.map((c) => mapToCategoryResponseDto(c))
      : [],
  };
}

export function mapToDiscountsListResponse(
  data: DiscountsListWithRelations,
): DiscountsListResponseDto {
  return {
    discounts: data.discounts.map((d) => mapToDiscountResponse(d)),
    metadata: data.metadata,
  };
}
