import { ProductResponseDto } from 'src/products-core/products/dto/products-response.dto';

export class FavoriteResponseDto {
  id: number;
  productId: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  product: ProductResponseDto;
}
