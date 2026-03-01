import { ProductResponseDto } from 'src/products-core/products/dto/products-response.dto';
import { ApplicableTo, DiscountType } from '../enums/enums';
import { CategoryResponseDto } from 'src/products-core/categories/dto/categories-response.dto';

export class DiscountResponseDto {
  id: number;
  name: string;
  description?: string;
  discountType: DiscountType;
  value: number;
  startDate: Date;
  endDate: Date;
  applicableTo: ApplicableTo;
  orderThreshold?: number;
  maxUses?: number;
  currentUses: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  products: ProductResponseDto[];
  categories: CategoryResponseDto[];
}
