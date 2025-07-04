import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, NotFoundException } from '@nestjs/common';
import { CartService } from './cart.service';
import { OwnGuard } from '../guards/own.guard';
import { InternalServerError } from 'src/common/errors/internal-server-error';

@UseGuards(OwnGuard)
@Controller('users/:userId/cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Get()
  async findCart(@Param('userId', ParseIntPipe) userId: number) {
    try {
      return await this.cartService.findOne(userId)
    } catch (error) {
      throw new NotFoundException('Carts Not found')
    };
  }

  @Get('/total-discount')
  async calculateDiscounts(@Param('userId', ParseIntPipe) userId: number) {
    try {
      return await this.cartService.checkDiscounts(userId);
    } catch (error) {
      throw new InternalServerError("Error al obtener el total")
    }
  }

}
