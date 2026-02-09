import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsDefined,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { IsProductSize } from '../decorators/is-product-size.decorator';
import { Color } from '../enums/color.enum';

export class CreateProductSkusDto {
  @IsProductSize()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toUpperCase())
  size: string;

  @IsEnum(Color)
  @IsNotEmpty()
  @Transform(({ value }) => value?.toUpperCase())
  color: string;

  @IsInt()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value)) //el atributo viene como un string y lo pasamos a number
  quantity: number;
}

export class CreateBatchProductSkusDto {
  @ArrayNotEmpty()
  @IsDefined({ each: true })
  @IsObject({ each: true })
  @ValidateNested()
  @Type(() => CreateProductSkusDto)
  productSkus: CreateProductSkusDto[];
}
