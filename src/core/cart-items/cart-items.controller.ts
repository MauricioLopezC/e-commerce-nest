import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Req, UseGuards, NotFoundException, ConflictException } from '@nestjs/common';
import { CartItemsService } from './cart-items.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { OwnCartGuard } from './own-cart/own-cart.guard';
import { AlreadyIncludedError } from 'src/common/errors/already-included-error';
import { NotFoundError } from 'src/common/errors/not-found-error';
import { StockError } from './errors/stock-error';

@UseGuards(OwnCartGuard)
@Controller('cart/:cartId/cart-items')
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) { }

  @Post()
  async create(@Param('cartId', ParseIntPipe) cartId: number, @Body() createCartItemDto: CreateCartItemDto) {
    try {
      return await this.cartItemsService.create(cartId, createCartItemDto);
    } catch (error) {
      if (error instanceof AlreadyIncludedError) throw new ConflictException(error.message)
      if (error instanceof StockError) throw new ConflictException(error.message)
      if (error instanceof NotFoundError) throw new NotFoundException(error.message)
    }
  }

  @Get()
  async findAll(@Param('cartId', ParseIntPipe) cartId: number) {
    return await this.cartItemsService.findAll(cartId);
  }

  @Get(':id')
  async findOne(@Param('cartId', ParseIntPipe) cartId: number, @Param('id', ParseIntPipe) id: number) {
    return await this.cartItemsService.findOne(cartId, id);
  }

  @Patch(':id')
  async update(
    @Param('cartId', ParseIntPipe) cartId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCartItemDto: UpdateCartItemDto
  ) {
    try {
      return await this.cartItemsService.update(cartId, id, updateCartItemDto);
    } catch (error) {
      //many errors types could be here
      if (error instanceof NotFoundError) throw new NotFoundException(error.message)
      if (error instanceof StockError) throw new ConflictException(error.message)
    }
  }

  @Delete(':id')
  async remove(@Param('cartId', ParseIntPipe) cartId: number, @Param('id', ParseIntPipe) id: number) {
    try {
      return await this.cartItemsService.remove(cartId, id);
    } catch (error) {
      if (error instanceof NotFoundError) throw new NotFoundException(error.message)
    }
  }
}
