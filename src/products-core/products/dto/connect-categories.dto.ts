import { IsArray, IsNumber, Min, min } from "class-validator";

export class ConnectCategoriesDto {
  @IsArray()
  @IsNumber({}, { each: true })
  @Min(0, { each: true })
  categoryIds: number[]
}
