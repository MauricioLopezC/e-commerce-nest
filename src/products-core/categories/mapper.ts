import { Prisma } from 'src/generated/prisma/client';
import { CategoryResponseDto } from './dto/categories-response.dto';

type CategoryModel = Prisma.CategoryGetPayload<{}>;

export function mapToCategoryResponseDto(category: any): CategoryResponseDto {
  return {
    id: category.id,
    name: category.name,
    description: category.description,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}
