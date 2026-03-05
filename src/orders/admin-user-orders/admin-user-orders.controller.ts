import { Controller, Delete, Get, Param, ParseIntPipe } from '@nestjs/common';
import { OrdersService } from '../orders.service';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/enums/role.enum';
import { mapToOrderListResponse, mapToOrderResponse } from '../mapper';

@Roles(Role.Admin)
@Controller('users/:userId/orders')
export class AdminUserOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAll(@Param('userId', ParseIntPipe) userId: number) {
    return mapToOrderListResponse(
      await this.ordersService.findAllByUserId(userId),
    );
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return mapToOrderResponse(await this.ordersService.findOne(id));
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return mapToOrderResponse(await this.ordersService.delete(id));
  }
}
