import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { Product } from '@prisma/client';
import { ProductsService } from './products.service';
import { ListAllEntitiesDto } from './dtos/ListAllEntities';
import { CreateProductDto } from './dtos/CreateProductDto';
import { UpdateProductDto } from './dtos/UpdateProductDto';
import { PublicRoute } from 'src/auth/decorators/public-routes.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) { }

  @PublicRoute()
  @Get()
  getAllProducts(@Query() query: ListAllEntitiesDto): Promise<Product[]> {
    console.log(query)
    return this.productsService.getFiltered(query)
  }

  @Roles(Role.Admin)
  @Post()
  createProduct(@Body() product: CreateProductDto) {
    return this.productsService.createProduct(product)
  }

  @PublicRoute()
  @Get(':id')
  async getOneProduct(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    const productFound = await this.productsService.getProductById(id)
    if (!productFound) throw new NotFoundException("Product does not exist")
    return productFound
  }

  @Roles(Role.Admin)
  @Patch(':id')
  async updateProduct(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
    try {
      return await this.productsService.updateProduct(id, updateProductDto)
    } catch (error) {
      throw new NotFoundException("Product does not exist")
    }
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async removeProduct(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    //if no product has the id, prisma will crash
    try {
      return await this.productsService.removeProduct(id)
    } catch (error) {
      throw new NotFoundException("Product does not exist")
    }
  }

  // pensar en una ruta para agregar un product sku
  // puese ser @Post(':id/:sku')
  // o @Post(':id/skus')
  // @Get(':id/skus/:id')

}
