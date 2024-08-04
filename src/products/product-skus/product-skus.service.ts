import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductSku } from '@prisma/client';
import { CreateProductSkuDto } from './dtos/CreateProductSkuDto';
import { UpdateProductSkuDto } from './dtos/UpdateProductSkuDto';

@Injectable()
export class ProductSkusService {
  constructor(private prisma: PrismaService) { }

  async getAll(productId: number): Promise<ProductSku[]> {
    const skus = this.prisma.productSku.findMany({
      where: {
        productId: productId
      }
    })
    return skus
  }

  async getSkuById(skuId: number, productId: number): Promise<ProductSku> {
    const sku = this.prisma.productSku.findUnique({
      where: {
        id: skuId,
        productId: productId
      }
    })
    return sku
  }

  async createSku(productId: number, createSkuDto: CreateProductSkuDto): Promise<ProductSku> {
    const productSku = this.prisma.productSku.create({
      data: {
        productId: productId,
        size: createSkuDto.size,
        color: createSkuDto.color,
        quantity: createSkuDto.quantity
      }
    })
    return productSku
  }

  //para actulizar el stock de un producto en concreto
  async updateSku(skuId: number, productId: number, updateSkuDto: UpdateProductSkuDto): Promise<ProductSku> {
    const updatedSku = this.prisma.productSku.update({
      where: {
        id: skuId,
        productId: productId
      },
      data: updateSkuDto
    })
    return updatedSku
  }

  async removeSku(skuId: number, productId: number): Promise<ProductSku> {
    const deletedSku = await this.prisma.productSku.delete({
      where: {
        id: skuId,
        productId: productId
      }
    })
    return deletedSku
  }




}
