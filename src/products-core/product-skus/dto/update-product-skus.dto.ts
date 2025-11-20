import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class UpdateProductSkusDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  size: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  color: string;

  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => Number(value)) //el atributo viene como un string y lo pasamos a number
  quantity: number;
}
