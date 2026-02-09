import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CurrentUser } from '../common/current-user/current-user.decorator';
import { JwtPayload } from '../common/types/JwtPayload';
import { Throttle } from '@nestjs/throttler';

@Throttle({ default: { ttl: 60000, limit: 5 } })
@Controller('me/orders')
export class MeOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return await this.ordersService.create(user.id, createOrderDto);
  }

  @Get()
  async findAll(@CurrentUser() user: JwtPayload) {
    return await this.ordersService.findAllByUserId(user.id);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return await this.ordersService.findOneByUserId(id, user.id);
  }
}
