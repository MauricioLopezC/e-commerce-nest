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
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import {
  ProductListResponse,
  ProductResponseDto,
} from './dto/products-response.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiCreatedResponse({ type: ProductResponseDto })
  @Roles(Role.Admin)
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productsService.create(createProductDto);
  }

  @ApiOkResponse({ type: ProductListResponse })
  @PublicRoute()
  @Get()
  findAll(@Query() query: ListAllProductDto) {
    return this.productsService.findAll(query);
  }

  @ApiOkResponse({ type: ProductResponseDto })
  @PublicRoute()
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.findOne(id);
  }

  @ApiOkResponse({ type: ProductResponseDto })
  @Roles(Role.Admin)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productsService.update(id, updateProductDto);
  }

  @ApiOkResponse({ type: ProductResponseDto })
  @Roles(Role.Admin)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.remove(id);
  }

  @ApiOkResponse({ type: ProductResponseDto })
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

  @ApiOkResponse({ type: ProductResponseDto })
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

  @ApiOkResponse({ type: ProductResponseDto })
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
