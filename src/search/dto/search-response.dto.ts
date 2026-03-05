import { ProductResponseDto } from 'src/products-core/products/dto/products-response.dto';

export class SearchResponseDto {
  products: ProductResponseDto[];
  metadata: { _count: number };
}
