import { IsNumber, IsOptional } from "class-validator";

export class UpdateFavoriteDto {
  @IsNumber()
  @IsOptional()
  productId: number;
  @IsNumber()
  @IsOptional()
  userId: number;
}
