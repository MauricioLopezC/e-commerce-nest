import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class SearchDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  productName: string
}
