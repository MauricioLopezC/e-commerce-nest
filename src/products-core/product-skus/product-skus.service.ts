import { Injectable } from '@nestjs/common';
import {
  CreateBatchProductSkusDto,
  CreateProductSkusDto,
} from './dto/create-product-skus.dto';
import { UpdateProductSkusDto } from './dto/update-product-skus.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'src/generated/prisma/client';
import { NotFoundError } from 'src/common/errors/business-error';

@Injectable()
export class ProductSkusService {
  constructor(private prisma: PrismaService) {}

  async create(productId: number, createProductSkusDto: CreateProductSkusDto) {
    return await this.prisma.productSku.create({
      data: {
        productId: productId,
        size: createProductSkusDto.size,
        color: createProductSkusDto.color,
        quantity: createProductSkusDto.quantity,
      },
      include: {
        images: true,
      },
    });
  }

  async findAll(productId: number) {
    const skus = await this.prisma.productSku.findMany({
      where: {
        productId,
      },
      include: {
        images: true,
      },
    });
    return skus;
  }

  async findOne(productId: number, id: number) {
    const sku = await this.prisma.productSku.findUnique({
      where: {
        id,
        productId,
      },
      include: {
        images: true,
      },
    });
    if (!sku) {
      throw new NotFoundError('Product sku not found');
    }
    return sku;
  }

  async update(
    productId: number,
    id: number,
    updateProductSkusDto: UpdateProductSkusDto,
  ) {
    const updatedSku = await this.prisma.productSku.update({
      where: {
        id,
        productId,
      },
      data: updateProductSkusDto,
      include: {
        images: true,
      },
    });
    return updatedSku;
  }

  async remove(productId: number, id: number) {
    const deletedSku = await this.prisma.productSku.delete({
      where: {
        id,
        productId,
      },
      include: {
        images: true,
      },
    });
    return deletedSku;
  }

  async batchCreate(
    productId: number,
    createProductSkusBatchDto: CreateBatchProductSkusDto,
  ) {
    const data: Prisma.ProductSkuCreateManyInput[] =
      createProductSkusBatchDto.productSkus.map((item) => ({
        ...item,
        productId,
      }));

    return await this.prisma.productSku.createMany({
      data,
      skipDuplicates: true,
    });
  }
}
