import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { Product } from '@prisma/client';
import { ProductsService } from './products.service';
import { ListAllEntitiesDto } from './dtos/ListAllEntities';
import { CreateProductDto } from './dtos/CreateProductDto';
import { UpdateProductDto } from './dtos/UpdateProductDto';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) { }

  @Get()
  getAllProducts(@Query() query: ListAllEntitiesDto): Promise<Product[]> {
    console.log(query)
    return this.productsService.getFiltered(query)
  }

  @Post()
  createProduct(@Body() product: CreateProductDto) {
    return this.productsService.createProduct(product)
  }

  @Get(':id')
  async getOneProduct(@Param('id') id: string): Promise<Product> {
    const productFound = await this.productsService.getProductById(Number(id))
    if (!productFound) throw new NotFoundException("Product does not exist")
    return productFound
  }

  @Patch(':id')
  async updateProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    try {
      return await this.productsService.updateProduct(id, updateProductDto)
    } catch (error) {
      throw new NotFoundException("Product does not exist")
    }
  }

  @Delete(':id')
  async removeProduct(@Param('id') id: string): Promise<Product> {
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
