import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { ProductSkusService } from './product-skus.service';
import { CreateProductSkusDto } from './dto/create-product-skus.dto';
import { UpdateProductSkusDto } from './dto/update-product-skus.dto';
import { PublicRoute } from 'src/auth/decorators/public-routes.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('products/:productId/product-skus')
export class ProductSkusController {
  //images could be passes in array on crateProductskuDto
  //TODO:http Exceptions from custom Errors in Service
  constructor(private readonly productSkusService: ProductSkusService) { }

  @Roles(Role.Admin)
  @Post()
  async create(@Param('productId', ParseIntPipe) productId: number, @Body() createProductSkusDto: CreateProductSkusDto) {
    return await this.productSkusService.create(productId, createProductSkusDto);
  }

  @PublicRoute()
  @Get()
  async findAll(@Param('productId', ParseIntPipe) productId: number,) {
    return await this.productSkusService.findAll(productId);
  }

  @PublicRoute()
  @Get(':id')
  async findOne(@Param('productId', ParseIntPipe) productId: number, @Param('id', ParseIntPipe) id: number) {
    const productSkuFound = await this.productSkusService.findOne(productId, id)
    if (!productSkuFound) throw new NotFoundException("Product Sku not found")
    return productSkuFound
  }

  @Roles(Role.Admin)
  @Patch(':id')
  update(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductSkusDto: UpdateProductSkusDto) {
    return this.productSkusService.update(productId, id, updateProductSkusDto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  remove(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('id', ParseIntPipe) id: number) {
    return this.productSkusService.remove(productId, id);
  }
}
