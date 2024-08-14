import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty, IsString } from "class-validator";
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
