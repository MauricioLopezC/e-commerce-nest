import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  NotFoundException,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { NotFoundError } from 'src/common/errors/not-found-error';
import { OwnGuard } from '../guards/own.guard';
import { InternalServerError } from 'src/common/errors/internal-server-error';
import { ValidationError } from 'src/common/errors/validation-error';

@UseGuards(OwnGuard)
@Controller('users/:userId/orders')
export class MeOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    try {
      return await this.ordersService.create(userId, createOrderDto);
    } catch (error) {
      if (error instanceof NotFoundError)
        throw new NotFoundException(error.message);
      if (error instanceof ValidationError)
        throw new BadRequestException(error.message);
      throw new InternalServerError('Error! try again later');
    }
  }

  @Get()
  async findAll(@Param('userId', ParseIntPipe) userId: number) {
    return await this.ordersService.findAllByUserId(userId);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    try {
      return await this.ordersService.findOneByUserId(id, userId);
    } catch (error) {
      if (error instanceof NotFoundError)
        throw new NotFoundException(error.message);
      throw new InternalServerError('Error! try again later');
    }
  }
}
