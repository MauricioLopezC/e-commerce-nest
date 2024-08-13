import { IsInt, IsNotEmpty, IsPositive, IsString } from "class-validator";
export class CreateCartItemDto {
  @IsInt()
  productId: number;

  @IsInt()
  productSkuId: number;

  @IsInt()
  @IsPositive()
  quantity: number;
}
