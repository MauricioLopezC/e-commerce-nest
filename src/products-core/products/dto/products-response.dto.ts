import { CategoryResponseDto } from 'src/products-core/categories/dto/categories-response.dto';
import { Sex } from '../enums/sex.enum';
import { ProductSkuResponseDto } from 'src/products-core/product-skus/dto/product-skus-response.dto';
import { Image } from 'src/products-core/images/types';

export class ProductResponseDto {
  id: number;
  name: string;
  price: number;
  description: string;
  sex: Sex;
  unitsOnOrder: number;
  totalCollected: number;
  images: Image[];
  createdAt: Date;
  updatedAt: Date;
  productSkus?: ProductSkuResponseDto[];
  categories: CategoryResponseDto[];
}

export class Metadata {
  _count: number;
}

export class ProductListResponse {
  products: ProductResponseDto[];
  metadata: Metadata;
}
