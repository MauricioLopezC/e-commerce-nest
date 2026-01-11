import { DiscountType } from 'src/generated/prisma/client';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
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
import { ApplicableTo } from './update-discount.dto';

@ValidatorConstraint({ name: 'isValidOrderBy', async: false })
class IsValidOrderByConstraint implements ValidatorConstraintInterface {
  private readonly allowedValues = ['value', 'createdAt'];

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

export class ListAllDiscountsDto {
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
  @Transform(({ value }) => value === 'true') //el atributo viene como un string y lo pasamos a number
  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsEnum(DiscountType)
  discountType: DiscountType;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsEnum(ApplicableTo)
  applicableTo: ApplicableTo;

  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value])) // Asegurarse de que siempre sea un array
  @IsArray()
  @IsString({ each: true })
  @Validate(IsValidOrderByConstraint)
  orderBy: string[];
}
