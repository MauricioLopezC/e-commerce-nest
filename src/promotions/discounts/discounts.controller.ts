import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { PublicRoute } from 'src/auth/decorators/public-routes.decorator';
import { ListAllDiscountsDto } from './dto/list-all-discounts.dto';

@Controller('promotions/discounts')
export class DiscountsController {
  constructor(private readonly discountsService: DiscountsService) {}

  @Roles(Role.Admin)
  @Post()
  async create(@Body() createDiscountDto: CreateDiscountDto) {
    return await this.discountsService.create(createDiscountDto);
  }

  @PublicRoute()
  @Get()
  async findAll(@Query() query: ListAllDiscountsDto) {
    return await this.discountsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.discountsService.findOne(id);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDiscountDto: UpdateDiscountDto,
  ) {
    return await this.discountsService.update(id, updateDiscountDto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.discountsService.delete(id);
  }
}
