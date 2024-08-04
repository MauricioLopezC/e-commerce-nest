import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { ProductSkusService } from './product-skus.service';
import { ProductSku } from '@prisma/client';
import { CreateProductSkuDto } from './dtos/CreateProductSkuDto';
import { UpdateProductSkuDto } from './dtos/UpdateProductSkuDto';

@Controller('products/:id/skus')
export class ProductSkusController {
  constructor(private productSkusService: ProductSkusService) { }

  @Get()
  getAllProducts(@Param('id') id: string): Promise<ProductSku[]> {
    console.log("hola XD")
    return this.productSkusService.getAll(Number(id))
  }

  @Post()
  createProduct(@Param('id') id: string, @Body() productSku: CreateProductSkuDto) {
    return this.productSkusService.createSku(Number(id), productSku)
  }

  @Get(':skuId')
  async getOneProduct(@Param('id') id: string, @Param('skuId') skuId: string): Promise<ProductSku> {
    const productFound = await this.productSkusService.getSkuById(Number(skuId), Number(id))
    if (!productFound) throw new NotFoundException("Product does not exist")
    return productFound
  }

  @Patch(':skuId')
  async updateProduct(@Param('skuId') skuId: string, @Param('id') id: string, @Body() updateSkuDto: UpdateProductSkuDto) {
    try {
      return await this.productSkusService.updateSku(Number(skuId), Number(id), updateSkuDto)
    } catch (error) {
      throw new NotFoundException("Product does not exist")
    }
  }
  //
  @Delete(':skuId')
  async removeProduct(@Param('id') id: string, @Param('skuId') skuId: string): Promise<ProductSku> {
    //if no product has the id, prisma will crash
    try {
      return await this.productSkusService.removeSku(Number(skuId), Number(id))
    } catch (error) {
      throw new NotFoundException("Product does not exist")
    }
  }

}
