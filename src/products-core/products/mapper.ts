import { Prisma } from 'src/generated/prisma/client';
import {
  ProductListResponse,
  ProductResponseDto,
} from './dto/products-response.dto';
import { Sex } from './enums/sex.enum';

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: { categories: true; images: true };
}>;

export type ProductListWithRelations = {
  products: ProductWithRelations[];
  metadata: { _count: number };
};

export function mapToProductResponseDto(
  product: ProductWithRelations,
): ProductResponseDto {
  return {
    id: product.id,
    name: product.name,
    price: product.price.toNumber(),
    description: product.description,
    sex: product.sex as Sex,
    unitsOnOrder: product.unitsOnOrder,
    totalCollected: product.totalCollected,
    images: product.images ?? [],
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    categories: product.categories ?? [],
  };
}

export function mapToProductListResponse(
  data: ProductListWithRelations,
): ProductListResponse {
  return {
    products: data.products.map((p) => this.mapToProductResponseDto(p)),
    metadata: data.metadata,
  };
}
