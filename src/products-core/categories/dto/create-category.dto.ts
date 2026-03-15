import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @Transform(({ value }) => (value as string).trim().toLowerCase())
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  description: string;
}
