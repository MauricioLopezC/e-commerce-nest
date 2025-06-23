import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseFilters, NotFoundException, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ListAllProductDto } from './dto/list-all-products.dto';
import { PublicRoute } from 'src/auth/decorators/public-routes.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { PrismaClientExceptionFilter } from 'src/common/filters/prisma-client-exception/prisma-client-exception.filter';
import { ConnectCategoriesDto } from './dto/connect-categories.dto';
import { NotFoundError } from 'src/common/errors/not-found-error';

@UseFilters(PrismaClientExceptionFilter)
@Controller('products')
export class ProductsController {
  //NOTE: PrismaClientExceptionFilter catch all PrismaClientKnownRequestError
  //exceptions
  constructor(private readonly productsService: ProductsService) { }

  @Roles(Role.Admin)
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productsService.create(createProductDto);
  }

  @PublicRoute()
  @Get()
  findAll(@Query() query: ListAllProductDto) {
    console.log("NEW")
    return this.productsService.findAll(query);
  }

  @PublicRoute()
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const productFound = await this.productsService.findOne(id)
    if (!productFound) throw new NotFoundException('Product not found')
    return productFound
  }

  @Roles(Role.Admin)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto
  ) {
    const updatedProduct = await this.productsService.update(id, updateProductDto)
    return updatedProduct
  }

  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }

  @Roles(Role.Admin)
  @Post(':id/categories')
  async connectCategories(@Param('id', ParseIntPipe) id: number, @Body() connectCategoriesDto: ConnectCategoriesDto) {
    try {
      return await this.productsService.connectCategories(id, connectCategoriesDto)
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException(error.message)
      }
    }
  }

  @Roles(Role.Admin)
  @Delete(':id/categories')
  async disconnectCategories(@Param('id', ParseIntPipe) id: number, @Body() connectCategoriesDto: ConnectCategoriesDto) {
    try {
      return await this.productsService.disconnectCategories(id, connectCategoriesDto)
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException(error.message)
      }
    }
  }

  @Roles(Role.Admin)
  @Put(':id/categories')
  async replaceCategories(@Param('id', ParseIntPipe) id: number, @Body() connectCategoriesDto: ConnectCategoriesDto) {
    try {
      return await this.productsService.replaceCategories(id, connectCategoriesDto)
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException(error.message)
      }
    }
  }
}
