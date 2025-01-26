import { Transform } from "class-transformer"
import { IsArray, IsBoolean, IsDate, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength, Min } from "class-validator"

enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED'
}

enum ApplicableTo {
  PRODUCT = 'PRODUCT',
  CATEGORY = 'CATEGORY',
  GENERAL = 'GENERAL'
}

export class CreateDiscountDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  description: string

  @IsString()
  @IsNotEmpty()
  @IsEnum(DiscountType)
  discountType: string

  @IsNumber()
  @IsPositive()
  value: number

  @Transform(({ value }) => (new Date(value)))
  @IsDate()
  startDate: Date

  @Transform(({ value }) => (new Date(value)))
  @IsDate()
  endDate: Date

  @IsString()
  @IsEnum(ApplicableTo)
  applicableTo: string

  //TODO: instead optional, use 0 value
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  orderThreshold: number

  @IsOptional()
  @IsInt()
  @IsPositive()
  maxUses: number

  @IsOptional()
  @IsBoolean()
  isActive: boolean = true


  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  products: number[]

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  categories: number[]
}

