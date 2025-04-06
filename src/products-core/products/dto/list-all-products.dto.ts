import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from "class-validator";
import { Sex } from "../enums/sex.enum";
export class ListAllProductDto {
  //pagination secction
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  @IsNotEmpty()
  @Transform(({ value }) => Number(value)) //el atributo viene como un string y lo pasamos a number
  limit: number = 10;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  page: number = 1;

  //filters seccion
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  category: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  sex: Sex;

  //order secction
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  orderBy: string;

  //search secction
}
