import {
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { OrdersService } from '../orders.service';
import { NotFoundError } from '../../common/errors/not-found-error';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/enums/role.enum';

@Roles(Role.Admin)
@Controller('users/:userId/orders')
export class AdminUserOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAll(@Param('userId', ParseIntPipe) userId: number) {
    return await this.ordersService.findAllByUserId(userId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.ordersService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundError)
        throw new NotFoundException('order not found');
      throw new InternalServerErrorException('server error');
    }
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.ordersService.delete(id);
    } catch (error) {
      if (error instanceof NotFoundError)
        throw new NotFoundException('order not found');
      throw new InternalServerErrorException('server error');
    }
  }
}
