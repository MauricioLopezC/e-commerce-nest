import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsArray,
  Min,
  IsEnum,
} from 'class-validator';
import { Sex } from '../enums/sex.enum';
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

  @IsArray()
  @IsNumber({}, { each: true })
  @Min(0, { each: true })
  categories: number[];

  @IsString()
  @IsNotEmpty()
  @IsEnum(Sex)
  sex: Sex;
}
