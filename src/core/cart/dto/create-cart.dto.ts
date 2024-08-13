import { Cart } from "@prisma/client";
import { IsInt, IsPositive } from "class-validator";
export class CreateCartDto {
  @IsInt()
  @IsPositive()
  userId: number;
}
