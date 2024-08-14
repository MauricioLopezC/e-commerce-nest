import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ListAllEntitiesDto } from 'src/products-core-old/dtos/ListAllEntities';

@Injectable()
export class ProductsService {
  //TODO: error control like cartItemService
  constructor(private prisma: PrismaService) { }

  async create(createProductDto: CreateProductDto) {
    const newProduct = await this.prisma.product.create({
      data: createProductDto
    })
    return newProduct
  }

  async findAll(filters: ListAllEntitiesDto) {
    const limit = filters.limit
    const page = filters.page
    console.log("Limit and page: ", limit, page)
    console.log(typeof limit)

    const offset = (page - 1) * limit //for pagination offset
    delete filters.limit
    delete filters.page
    console.log("filters -->", filters)
    return await this.prisma.product.findMany({
      skip: offset,
      take: limit,
      where: filters
    })
  }



  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        id
      }
    })
    return product
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    console.log(updateProductDto)
    const updatedProduct = await this.prisma.product.update({
      where: {
        id
      },
      data: updateProductDto
    })
    return updatedProduct
  }

  async remove(id: number) {
    const deletedProduct = await this.prisma.product.delete({
      where: {
        id
      }
    })
    return deletedProduct
  }
}
