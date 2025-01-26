import { IsNotEmpty, IsString, Max } from "class-validator"

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @Max(30)
  name: string

  @IsString()
  @IsNotEmpty()
  @Max(100)
  description: string
}
