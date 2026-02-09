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

@Controller('me/cart-items')
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) {}

  @Post()
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() createCartItemDto: CreateCartItemDto,
  ) {
    return await this.cartItemsService.create(user.id, createCartItemDto);
  }

  @Get()
  async findAll(@CurrentUser() user: JwtPayload) {
    return await this.cartItemsService.findAllByUserId(user.id);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return await this.cartItemsService.findOneByUserId(user.id, id);
  }

  @Patch(':id')
  async update(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    try {
      return await this.cartItemsService.updateByUserId(
        user.id,
        id,
        updateCartItemDto,
      );
    } catch (error) {
      //many errors types could be here
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
    return await this.cartItemsService.remove(user.id, id);
  }
}
