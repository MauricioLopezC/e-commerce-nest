import { Injectable } from '@nestjs/common';
import {
  CreateBatchProductSkusDto,
  CreateProductSkusDto,
} from './dto/create-product-skus.dto';
import { UpdateProductSkusDto } from './dto/update-product-skus.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, ProductSku } from 'src/generated/prisma/client';
import {
  NotFoundError,
  UniqueConstraintError,
} from 'src/common/errors/business-error';
import {
  prismaForeignKeyConstraintError,
  prismaUniqueConstraintError,
} from 'src/common/prisma-erros';

@Injectable()
export class ProductSkusService {
  //TODO: Add array image attribute in UpdateProductSkusDto
  constructor(private prisma: PrismaService) {}

  async create(
    productId: number,
    createProductSkusDto: CreateProductSkusDto,
  ): Promise<ProductSku> {
    try {
      return await this.prisma.productSku.create({
        data: {
          productId: productId,
          size: createProductSkusDto.size,
          color: createProductSkusDto.color,
          quantity: createProductSkusDto.quantity,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === prismaUniqueConstraintError
      )
        throw new UniqueConstraintError(
          `Product sku with size: ${createProductSkusDto.size} and color: ${createProductSkusDto.color} already exists`,
        );

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === prismaForeignKeyConstraintError
      )
        throw new NotFoundError(`Product with id ${productId} not found`);

      throw error;
    }
  }

  async findAll(productId: number): Promise<ProductSku[]> {
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

  async findOne(productId: number, id: number): Promise<ProductSku> {
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
  ): Promise<ProductSku> {
    const updatedSku = await this.prisma.productSku.update({
      where: {
        id,
        productId,
      },
      data: updateProductSkusDto,
    });
    return updatedSku;
  }

  async remove(productId: number, id: number): Promise<ProductSku> {
    const deletedSku = await this.prisma.productSku.delete({
      where: {
        id,
        productId,
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
    const result = await this.prisma.productSku.createMany({
      data,
      skipDuplicates: true,
    });
    return result;
  }
}
