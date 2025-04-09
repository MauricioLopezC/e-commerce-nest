import { IsDefined, IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from "class-validator";
import { CreatePaymentDto } from "./create-payment.dto";
import { CreateShippingDto } from "./create-shipping.dto";
import { Type } from "class-transformer";

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateShippingDto)
  shipping: CreateShippingDto;

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => CreatePaymentDto)
  payment: CreatePaymentDto;
}
