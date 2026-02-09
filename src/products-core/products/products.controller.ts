import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ListAllProductDto } from './dto/list-all-products.dto';
import { PublicRoute } from 'src/auth/decorators/public-routes.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { ConnectCategoriesDto } from './dto/connect-categories.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Roles(Role.Admin)
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productsService.create(createProductDto);
  }

  @PublicRoute()
  @Get()
  findAll(@Query() query: ListAllProductDto) {
    return this.productsService.findAll(query);
  }

  @PublicRoute()
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.findOne(id);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productsService.update(id, updateProductDto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.remove(id);
  }

  @Roles(Role.Admin)
  @Post(':id/categories')
  async connectCategories(
    @Param('id', ParseIntPipe) id: number,
    @Body() connectCategoriesDto: ConnectCategoriesDto,
  ) {
    return await this.productsService.connectCategories(
      id,
      connectCategoriesDto,
    );
  }

  @Roles(Role.Admin)
  @Delete(':id/categories')
  async disconnectCategories(
    @Param('id', ParseIntPipe) id: number,
    @Body() connectCategoriesDto: ConnectCategoriesDto,
  ) {
    return await this.productsService.disconnectCategories(
      id,
      connectCategoriesDto,
    );
  }

  @Roles(Role.Admin)
  @Put(':id/categories')
  async replaceCategories(
    @Param('id', ParseIntPipe) id: number,
    @Body() connectCategoriesDto: ConnectCategoriesDto,
  ) {
    return await this.productsService.replaceCategories(
      id,
      connectCategoriesDto,
    );
  }
}
