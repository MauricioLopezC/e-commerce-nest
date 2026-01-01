import { Controller, Get, UseGuards, NotFoundException } from '@nestjs/common';
import { CartService } from './cart.service';
import { OwnGuard } from '../guards/own.guard';
import { InternalServerError } from 'src/common/errors/internal-server-error';
import { NotFoundError } from '../common/errors/not-found-error';
import { CurrentUser } from '../common/current-user/current-user.decorator';
import { JwtPayload } from '../common/types/JwtPayload';

@UseGuards(OwnGuard)
@Controller('me/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async findCart(@CurrentUser() user: JwtPayload) {
    try {
      return await this.cartService.findOneByUserId(user.id);
    } catch (error) {
      if (error instanceof NotFoundError)
        throw new NotFoundException('Carts Not found');
      throw new InternalServerError('Error! try again later');
    }
  }

  @Get('/total-discount')
  async calculateDiscounts(@CurrentUser() user: JwtPayload) {
    try {
      return await this.cartService.checkDiscounts(user.id);
    } catch (error) {
      throw new InternalServerError('Error! try again later');
    }
  }
}
