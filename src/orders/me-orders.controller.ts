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
import { CurrentUser } from '../common/current-user/current-user.decorator';
import { JwtPayload } from '../common/types/JwtPayload';

@UseGuards(OwnGuard)
@Controller('me/orders')
export class MeOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    try {
      return await this.ordersService.create(user.id, createOrderDto);
    } catch (error) {
      if (error instanceof NotFoundError)
        throw new NotFoundException(error.message);
      if (error instanceof ValidationError)
        throw new BadRequestException(error.message);
      throw new InternalServerError('Error! try again later');
    }
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
    try {
      return await this.ordersService.findOneByUserId(id, user.id);
    } catch (error) {
      if (error instanceof NotFoundError)
        throw new NotFoundException(error.message);
      throw new InternalServerError('Error! try again later');
    }
  }
}
