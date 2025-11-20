import { IsInt, IsPositive } from 'class-validator';
export class CreateCartItemDto {
  @IsInt()
  productId: number;

  @IsInt()
  productSkuId: number;

  @IsInt()
  @IsPositive()
  quantity: number;
}
