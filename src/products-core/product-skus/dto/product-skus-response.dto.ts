import { Image } from 'src/products-core/images/types';

export class ProductSkuResponseDto {
  id: number;
  productId: number;
  size: string;
  color: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  images?: Image[];
}

export class ProductSkuBatchUpdateResponse {
  count: number;
}
