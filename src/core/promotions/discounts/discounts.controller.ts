import { BadRequestException, Body, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { PublicRoute } from 'src/auth/decorators/public-routes.decorator';
import { ConnectOrDisconectProductsDto, ConnectOrDisconnectCategoriesDto } from './dto/connect-relations.dto';
import { NotFoundError } from 'src/common/errors/not-found-error';
import { ValidationError } from 'src/common/errors/validation-error';

@Controller('promotions/discounts')
export class DiscountsController {
  constructor(private readonly discountsService: DiscountsService) { }

  @Roles(Role.Admin)
  @Post()
  async create(@Body() createDiscountDto: CreateDiscountDto) {
    return await this.discountsService.create(createDiscountDto)
  }

  @PublicRoute()
  @Get()
  async findAll() {
    return await this.discountsService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.discountsService.findOne(id)
    } catch (error) {
      throw new NotFoundException('discount not found')
    }
  }

  @Roles(Role.Admin)
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateDiscountDto: UpdateDiscountDto) {
    try {
      return await this.discountsService.update(id, updateDiscountDto)
    } catch (error) {
      if (error instanceof ValidationError) throw new BadRequestException(error.message)
    }
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.discountsService.delete(id)
    } catch (error) {
      if (error instanceof NotFoundError) throw new NotFoundException(error.message)
    }
  }

  @Roles(Role.Admin)
  @Post(':id/products')
  async connectProducts(
    @Param('id', ParseIntPipe) id: number,
    @Body() connectProductDto: ConnectOrDisconectProductsDto
  ) {
    try {
      return await this.discountsService.connectProducts(id, connectProductDto)
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException(error.message)
      }
    }
  }

  @Roles(Role.Admin)
  @Post(':id/categories')
  async connectCateogories(
    @Param('id', ParseIntPipe) id: number,
    @Body() connectCateogoriesDto: ConnectOrDisconnectCategoriesDto
  ) {
    try {
      return await this.discountsService.connectCategories(id, connectCateogoriesDto)
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException(error.message)
      }
    }
  }

  @Roles(Role.Admin)
  @Delete(':id/products')
  async disconnectProducts(
    @Param('id', ParseIntPipe) id: number,
    @Body() disconnectProductsDto: ConnectOrDisconectProductsDto
  ) {
    return await this.discountsService.disconnectProducts(id, disconnectProductsDto)
  }

  @Roles(Role.Admin)
  @Delete(':id/categories')
  async disconnectCategories(
    @Param('id', ParseIntPipe) id: number,
    @Body() disconnectCategoriesDto: ConnectOrDisconnectCategoriesDto
  ) {
    return await this.discountsService.disconnectCategories(id, disconnectCategoriesDto)
  }

}

