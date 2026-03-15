import { Image } from 'src/products-core/images/dto/images-response.dto';

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

export class ProductSkuBatchUpdateResponseDto {
  count: number;
}
