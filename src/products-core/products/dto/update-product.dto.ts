import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { Sex } from "../enums/sex.enum";
export class UpdateProductDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @IsOptional()
  price: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  category: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  sex: Sex;

}
