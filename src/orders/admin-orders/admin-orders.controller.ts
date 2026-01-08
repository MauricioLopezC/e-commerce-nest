import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/enums/role.enum';
import { OrdersService } from '../orders.service';
import { ListAllOrdersDto } from '../dto/list-all-orders.dto';
import { NotFoundError } from '../../common/errors/not-found-error';
import { UpdateOrderDto } from '../dto/update-order.dto';

@Roles(Role.Admin)
@Controller('orders')
export class AdminOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAll(@Query() query: ListAllOrdersDto) {
    return await this.ordersService.findAll(query);
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
    try {
      return await this.ordersService.update(id, updateOrderDto);
    } catch (error) {
      if (error instanceof NotFoundError)
        throw new NotFoundException(error.message);
      console.error(error);
      throw new InternalServerErrorException('Error! try again later');
    }
  }
}
