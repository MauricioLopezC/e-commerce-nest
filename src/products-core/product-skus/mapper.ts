import { Prisma } from 'src/generated/prisma/client';
import { ProductSkuResponseDto } from './dto/product-skus-response.dto';

export type ProductSkuWithImages = Prisma.ProductSkuGetPayload<{
  include: { images: true };
}>;

export function mapToProductSkuResponseDto(
  sku: ProductSkuWithImages,
): ProductSkuResponseDto {
  return {
    id: sku.id,
    productId: sku.productId,
    size: sku.size,
    color: sku.color,
    quantity: sku.quantity,
    createdAt: sku.createdAt,
    updatedAt: sku.updatedAt,
    images: sku.images || [],
  };
}
