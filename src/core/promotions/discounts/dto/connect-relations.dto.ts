import { IsArray, IsInt, IsNumber, IsPositive } from "class-validator";

export class ConnectOrDisconectProductsDto {
  @IsArray()
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  @IsInt({ each: true })
  productIds: number[]
}

export class ConnectOrDisconnectCategoriesDto {
  @IsArray()
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  @IsInt({ each: true })
  categoryIds: number[]
}
