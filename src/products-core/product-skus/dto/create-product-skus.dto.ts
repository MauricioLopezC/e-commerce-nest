import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
export class CreateProductSkusDto {
  @IsString()
  @IsNotEmpty()
  size: string;

  @IsString()
  @IsNotEmpty()
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
