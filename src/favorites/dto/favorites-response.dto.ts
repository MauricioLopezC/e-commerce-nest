import { ProductResponseDto } from 'src/products-core/products/dto/products-response.dto';

export interface FavoriteResponseDto {
  id: number;
  productId: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  product: ProductResponseDto;
}
