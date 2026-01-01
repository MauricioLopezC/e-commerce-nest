import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

export class ListAllFavoritesDto {
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

  @IsOptional()
  @IsInt()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  productId: number;
}
