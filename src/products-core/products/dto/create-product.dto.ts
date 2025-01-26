import { IsString, IsNotEmpty, IsNumber, IsPositive, IsArray, Min } from "class-validator";
export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  // @IsString()
  // @IsNotEmpty()
  // category: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @Min(0, { each: true })
  categories: number[]

  @IsString()
  @IsNotEmpty()
  sex: string;
}
