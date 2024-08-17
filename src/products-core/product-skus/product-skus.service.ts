import { Injectable } from '@nestjs/common';
import { CreateProductSkusDto } from './dto/create-product-skus.dto';
import { UpdateProductSkusDto } from './dto/update-product-skus.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductSku } from '@prisma/client';

@Injectable()
export class ProductSkusService {
  //TODO: custom error handling in create, update and remove
  //TODO: Add array image attribute in UpdateProductSkusDto
  //and add simple imageService, this way we can manage upload images easy
  //NOTE: we will use a external service to manage images, like cloudinary
  //integrate could be hard, so we will integrate it at the end
  constructor(private prisma: PrismaService) { }

  async create(productId: number, createProductSkusDto: CreateProductSkusDto): Promise<ProductSku> {
    const productSku = await this.prisma.productSku.create({
      data: {
        productId: productId,
        size: createProductSkusDto.size,
        color: createProductSkusDto.color,
        quantity: createProductSkusDto.quantity
      }
    })
    return productSku
  }

  async findAll(productId: number): Promise<ProductSku[]> {
    const skus = await this.prisma.productSku.findMany({
      where: {
        productId
      },
      include: {
        images: true
      }
    })
    return skus
  }

  async findOne(productId: number, id: number): Promise<ProductSku> {
    const sku = await this.prisma.productSku.findUnique({
      where: {
        id,
        productId
      },
      include: {
        images: true
      }
    })
    return sku
  }

  async update(productId: number, id: number, updateProductSkusDto: UpdateProductSkusDto): Promise<ProductSku> {
    const updatedSku = await this.prisma.productSku.update({
      where: {
        id,
        productId
      },
      data: updateProductSkusDto
    })
    return updatedSku
  }

  async remove(productId: number, id: number): Promise<ProductSku> {
    const deletedSku = await this.prisma.productSku.delete({
      where: {
        id,
        productId
      }
    })
    return deletedSku
  }
}
