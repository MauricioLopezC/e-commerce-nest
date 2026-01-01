import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
}

export enum ApplicableTo {
  PRODUCT = 'PRODUCT',
  CATEGORY = 'CATEGORY',
  GENERAL = 'GENERAL',
}

export class UpdateDiscountDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  description: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsEnum(DiscountType)
  discountType: DiscountType;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  value: number;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  startDate: Date;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  endDate: Date;

  @IsOptional()
  @IsString()
  @IsEnum(ApplicableTo)
  applicableTo: ApplicableTo;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  orderThreshold: number;

  @IsOptional()
  @IsOptional()
  @IsInt()
  @IsPositive()
  maxUses: number;

  @IsOptional()
  @IsOptional()
  @IsBoolean()
  isActive: boolean = true;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  @IsInt({ each: true })
  products: number[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  @IsInt({ each: true })
  categories: number[];
}
