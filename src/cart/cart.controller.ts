import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-CartItem.dto';
import { CreateCartDto } from './dto/create-Cart.dto';

@Controller('cart')
export class CartController {

  @Get(':id')
  getUserCart(@Param('id') id: string): string {
    return `carrito del usuario ${id}`
  }

  @Post()
  createUserCart(@Body() createCartDto: CreateCartDto): string {
    return 'creado el carrito del usuario'
  }

  @Post('/cartItem')
  testFunction(@Body() createCartItemDto: CreateCartItemDto): string {
    return 'Agregando un producto al carrito'
  }

}
