import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ListAllOrdersDto } from '../dto/list-all-orders.dto';
import { OrdersAdminService } from './orders-admin.service';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { NotFoundError } from 'src/common/errors/not-found-error';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Roles(Role.Admin)
@Controller('orders')
export class OrdersAdminController {
  constructor(private readonly ordersService: OrdersAdminService) {}

  @Get()
  async findAll(@Query() query: ListAllOrdersDto) {
    return await this.ordersService.findAllOrders(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.ordersService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundError)
        throw new NotFoundException(error.message);
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return await this.ordersService.update(id, updateOrderDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.ordersService.remove(+id);
  // }
}
