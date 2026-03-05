import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/enums/role.enum';
import { OrdersService } from '../orders.service';
import { ListAllOrdersDto } from '../dto/list-all-orders.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { mapToOrderListResponse, mapToOrderResponse } from '../mapper';

@Roles(Role.Admin)
@Controller('orders')
export class AdminOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAll(@Query() query: ListAllOrdersDto) {
    return mapToOrderListResponse(await this.ordersService.findAll(query));
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return mapToOrderResponse(await this.ordersService.findOne(id));
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return mapToOrderResponse(
      await this.ordersService.update(id, updateOrderDto),
    );
  }
}
