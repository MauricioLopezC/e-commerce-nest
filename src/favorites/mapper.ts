import { Prisma } from 'src/generated/prisma/client';
import {
  FavoriteResponseDto,
  FavoritesListResponseDto,
} from './dto/favorites-response.dto';
import { mapToProductResponseDto } from 'src/products-core/products/mapper';

export type FavoriteWithRelations = Prisma.FavoriteGetPayload<{
  include: {
    product: {
      include: {
        images: true;
        categories: true;
      };
    };
  };
}>;

export type FavoritesListWithRelations = {
  favorites: FavoriteWithRelations[];
  metadata: { _count: number };
};

export function mapToFavoriteResponse(
  favorite: FavoriteWithRelations,
): FavoriteResponseDto {
  return {
    id: favorite.id,
    productId: favorite.productId,
    userId: favorite.userId,
    createdAt: favorite.createdAt,
    updatedAt: favorite.updatedAt,
    product: mapToProductResponseDto(favorite.product),
  };
}

export function mapToFavoritesListResponse(
  data: FavoritesListWithRelations,
): FavoritesListResponseDto {
  return {
    favorites: data.favorites.map((f) => mapToFavoriteResponse(f)),
    metadata: data.metadata,
  };
}
