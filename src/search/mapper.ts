import { SearchResponseDto } from './dto/search-response.dto';
import {
  mapToProductResponseDto,
  ProductWithRelations,
} from 'src/products-core/products/mapper';

export type SearchWithRelations = {
  products: ProductWithRelations[];
  metadata: { _count: number };
};

export function mapToSearchResponse(
  data: SearchWithRelations,
): SearchResponseDto {
  return {
    products: data.products.map((p) => mapToProductResponseDto(p)),
    metadata: data.metadata,
  };
}
