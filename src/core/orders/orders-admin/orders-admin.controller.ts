import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { OrdersService } from '../orders.service';
import { ListAllOrdersDto } from '../dto/list-all-orders.dto';


@Controller('orders')
export class OrdersAdminController {
  constructor(private readonly ordersService: OrdersService) { }

  // @Post()
  // async create(@Param('userId', ParseIntPipe) userId: number, @Body() createOrderDto: CreateOrderDto) {
  //   return await this.ordersService.create(userId, createOrderDto);
  //   // return await this.ordersService.testEmail()
  // }

  @Get()
  findAll(@Query() query: ListAllOrdersDto) {
    return this.ordersService.findAllOrders(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
  //   return this.ordersService.update(+id, updateOrderDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.ordersService.remove(+id);
  // }
}
