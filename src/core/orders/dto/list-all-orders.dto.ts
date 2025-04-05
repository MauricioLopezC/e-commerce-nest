import { Transform } from "class-transformer";
import { IsArray, IsDate, IsDateString, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, Validate, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { OrderStatus } from "../enums/order-status.enum";

/**
 * class used for validate orderBy query param for check only allowedValues
 * TODO: use this validation in all list-all-entities DTO's
  */
@ValidatorConstraint({ name: 'isValidOrderBy', async: false })
class IsValidOrderByConstraint implements ValidatorConstraintInterface {
  private readonly allowedValues = ['total', 'createdAt', 'unitsOnOrder'];

  validate(values: string[]): boolean {
    return values.every((value) => this.allowedValues.includes(value) || this.allowedValues.includes(value.slice(1)));
  }

  defaultMessage(): string {
    return `Each value in orderby must be one of: total, createdAt, unitsOnOrder.`;
  }
}

export class ListAllOrdersDto {
  //pagination section
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

  //filters section
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  status: OrderStatus

  @IsString()
  @IsOptional()
  email: string //search for emails 

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  startDate: Date;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  endDate: Date;


  //order secction
  @IsOptional()
  @Transform(({ value }) =>
    Array.isArray(value) ? value : [value]
  ) // Asegurarse de que siempre sea un array
  @IsArray()
  @IsString({ each: true })
  @Validate(IsValidOrderByConstraint)
  orderBy: string[];
}
