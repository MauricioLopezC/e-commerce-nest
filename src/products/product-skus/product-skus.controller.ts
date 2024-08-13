import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ProductSkusService } from './product-skus.service';
import { ProductSku } from '@prisma/client';
import { CreateProductSkuDto } from './dtos/CreateProductSkuDto';
import { UpdateProductSkuDto } from './dtos/UpdateProductSkuDto';
import { PublicRoute } from 'src/auth/decorators/public-routes.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('products/:id/skus')
export class ProductSkusController {
  constructor(private productSkusService: ProductSkusService) { }

  @PublicRoute()
  @Get()
  getAllProducts(@Param('id', ParseIntPipe) id: number): Promise<ProductSku[]> {
    return this.productSkusService.getAll(id)
  }

  @Roles(Role.Admin)
  @Post() //necesario
  createProduct(@Param('id', ParseIntPipe) id: number, @Body() productSku: CreateProductSkuDto) {
    return this.productSkusService.createSku(id, productSku)
  }

  @PublicRoute()
  @Get(':skuId')
  async getOneProduct(@Param('id', ParseIntPipe) id: number, @Param('skuId', ParseIntPipe) skuId: number): Promise<ProductSku> {
    const productFound = await this.productSkusService.getSkuById(skuId, id)
    if (!productFound) throw new NotFoundException("Product does not exist")
    return productFound
  }

  @Roles(Role.Admin)
  @Patch(':skuId')
  async updateProduct(@Param('skuId', ParseIntPipe) skuId: number, @Param('id', ParseIntPipe) id: number, @Body() updateSkuDto: UpdateProductSkuDto) {
    try {
      return await this.productSkusService.updateSku(skuId, id, updateSkuDto)
    } catch (error) {
      throw new NotFoundException("Product does not exist")
    }
  }
  //
  @Roles(Role.Admin)
  @Delete(':skuId')
  async removeProduct(@Param('id', ParseIntPipe) id: number, @Param('skuId', ParseIntPipe) skuId: number): Promise<ProductSku> {
    //if no product has the id, prisma will crash
    try {
      return await this.productSkusService.removeSku(skuId, id)
    } catch (error) {
      throw new NotFoundException("Product does not exist")
    }
  }

}
