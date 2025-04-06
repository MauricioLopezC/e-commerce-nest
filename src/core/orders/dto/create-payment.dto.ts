import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { PaymentProvider } from "../enums/payment-provider.enum";
export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(PaymentProvider)
  provider: PaymentProvider;
}
