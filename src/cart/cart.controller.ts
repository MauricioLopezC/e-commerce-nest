import { Controller, Get } from '@nestjs/common';
import { CartService } from './cart.service';
import { CurrentUser } from '../common/current-user/current-user.decorator';
import { JwtPayload } from '../common/types/JwtPayload';

@Controller('me/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async findCart(@CurrentUser() user: JwtPayload) {
    return await this.cartService.findOneByUserId(user.id);
  }

  @Get('/total-discount')
  async calculateDiscounts(@CurrentUser() user: JwtPayload) {
    return await this.cartService.checkDiscounts(user.id);
  }
}
