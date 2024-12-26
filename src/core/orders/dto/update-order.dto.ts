import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { OrderStatus } from "../enums/order-status.enum";

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  status: string;
}
