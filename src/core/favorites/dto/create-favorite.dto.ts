import { Transform } from "class-transformer";
import { IsNumber } from "class-validator";
export class CreateFavoriteDto {
  @IsNumber()
  productId: number;
}
