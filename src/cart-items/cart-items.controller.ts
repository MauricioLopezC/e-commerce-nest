import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CartItemsService } from './cart-items.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { StockError } from './errors/stock-error';
import { CurrentUser } from '../common/current-user/current-user.decorator';
import { JwtPayload } from '../common/types/JwtPayload';
import { NotFoundError } from 'src/common/errors/business-error';
import { mapToCartItemResponse } from './mapper';

@Controller('me/cart-items')
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) {}

  @Post()
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() createCartItemDto: CreateCartItemDto,
  ) {
    return mapToCartItemResponse(
      await this.cartItemsService.create(user.id, createCartItemDto),
    );
  }

  @Get()
  async findAll(@CurrentUser() user: JwtPayload) {
    const cartItems = await this.cartItemsService.findAllByUserId(user.id);
    return cartItems.map((item) => mapToCartItemResponse(item));
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return mapToCartItemResponse(
      await this.cartItemsService.findOneByUserId(user.id, id),
    );
  }

  @Patch(':id')
  async update(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    try {
      return mapToCartItemResponse(
        await this.cartItemsService.updateByUserId(
          user.id,
          id,
          updateCartItemDto,
        ),
      );
    } catch (error) {
      if (error instanceof NotFoundError)
        throw new NotFoundException(error.message);
      if (error instanceof StockError)
        throw new ConflictException(error.message);
      throw new InternalServerErrorException('Error! try again later');
    }
  }

  @Delete(':id')
  async remove(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return mapToCartItemResponse(
      await this.cartItemsService.remove(user.id, id),
    );
  }
}
