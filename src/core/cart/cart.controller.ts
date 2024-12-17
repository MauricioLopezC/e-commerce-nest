import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { OwnGuard } from '../guards/own.guard';

@UseGuards(OwnGuard)
@Controller('users/:userId/cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Post()
  create(@Param('userId', ParseIntPipe) userId: number, @Body() createCartDto: CreateCartDto) {
    return this.cartService.create(userId);
  }

  @Get()
  findAll(@Param('userId', ParseIntPipe) userId: number) {
    return this.cartService.findAll(userId);
  }

  // @Get(':id')
  // findOne(@Param('userId', ParseIntPipe) userId: number, @Param('id') id: string) {
  //   return this.cartService.findOne(+id);
  // }
  //
  // @Patch(':id')
  // update(@Param('userId', ParseIntPipe) userId: number, @Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
  //   return this.cartService.update(+id, updateCartDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('userId', ParseIntPipe) userId: number, @Param('id') id: string) {
  //   return this.cartService.remove(+id);
  // }
}
