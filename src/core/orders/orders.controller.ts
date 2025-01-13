import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, NotFoundException, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { NotFoundError } from 'src/common/errors/not-found-error';
import { OwnGuard } from '../guards/own.guard';

@UseGuards(OwnGuard)
@Controller('users/:userId/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  async create(@Param('userId', ParseIntPipe) userId: number, @Body() createOrderDto: CreateOrderDto) {
    try {
      return await this.ordersService.create(userId, createOrderDto);
    } catch (error) {
      if (error instanceof NotFoundError) throw new NotFoundException(error.message)
      else { console.log((error)) }
    }
  }

  @Get()
  findAll(@Param('userId', ParseIntPipe) userId: number) {
    return this.ordersService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
  //   return this.ordersService.update(+id, updateOrderDto);
  // }
  //
}
