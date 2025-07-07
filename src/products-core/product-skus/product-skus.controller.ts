import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, NotFoundException, UseFilters } from '@nestjs/common';
import { ProductSkusService } from './product-skus.service';
import { CreateBatchProductSkusDto, CreateProductSkusDto } from './dto/create-product-skus.dto';
import { UpdateProductSkusDto } from './dto/update-product-skus.dto';
import { PublicRoute } from 'src/auth/decorators/public-routes.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { PrismaClientExceptionFilter } from 'src/common/filters/prisma-client-exception/prisma-client-exception.filter';

@UseFilters(PrismaClientExceptionFilter)
@Controller('products/:productId/product-skus')
export class ProductSkusController {
  //images could be passes in array on crateProductskuDto
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
  async update(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductSkusDto: UpdateProductSkusDto) {
    return await this.productSkusService.update(productId, id, updateProductSkusDto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async remove(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('id', ParseIntPipe) id: number) {
    return await this.productSkusService.remove(productId, id);
  }

  @Roles(Role.Admin)
  @Post('batch')
  async batchCreate(@Param('productId', ParseIntPipe) productId: number, @Body() createbatchdto: CreateBatchProductSkusDto) {
    const productSkus = await this.productSkusService.batchCreate(productId, createbatchdto)
    return productSkus
  }
}
