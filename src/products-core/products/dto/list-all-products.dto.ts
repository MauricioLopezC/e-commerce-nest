import { Transform } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Sex } from '../enums/sex.enum';

@ValidatorConstraint({ name: 'isValidOrderBy', async: false })
class IsValidOrderByConstraint implements ValidatorConstraintInterface {
  private readonly allowedValues = [
    'price',
    'createdAt',
    'unitsOnOrder',
    'totalCollected',
    'updatedAt',
  ];

  validate(values: string[]): boolean {
    return values.every(
      (value) =>
        this.allowedValues.includes(value) ||
        this.allowedValues.includes(value.slice(1)),
    );
  }

  defaultMessage(): string {
    return `Each value in orderby must be one of: ${this.allowedValues.toString()}.`;
  }
}

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
  @Transform(({ value }) => (Array.isArray(value) ? value : [value])) // Asegurarse de que siempre sea un array
  @IsArray()
  @IsString({ each: true })
  @Validate(IsValidOrderByConstraint)
  orderBy: string[];

  //search secction
}
