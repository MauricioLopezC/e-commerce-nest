import { Favorites } from "@prisma/client";
import { IsNumber } from "class-validator";
export class CreateFavoriteDto {
  @IsNumber()
  productId: number;
}
