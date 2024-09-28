import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ListAllProductDto } from './dto/list-all-products.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Product } from '@prisma/client';

@Injectable()
export class ProductsService {
  //TODO: error control like cartItemService
  //NOTE: all PrismaClientKnownRequestError could be manage by exception filter
  //and we can manage business errors here using custom errors
  //NOTE: consider add unique constraint to product.name
  constructor(private prisma: PrismaService) { }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const newProduct = await this.prisma.product.create({
      data: createProductDto
    })
    return newProduct
  }

  async findAll(filters: ListAllProductDto): Promise<Product[]> {
    //TODO: include al least one image per Product
    //using include in findMay or selecting one
    //with prisma.image.findMany() with take
    const limit = filters.limit
    const page = filters.page
    console.log("Limit and page: ", limit, page)
    console.log(typeof limit)

    const offset = (page - 1) * limit //for pagination offset
    delete filters.limit
    delete filters.page
    console.log("filters -->", filters)


    //TODO: its not possible in primsa find firt inside an include
    //this can be usefull for take only main picture
    //add a raw sql query instead
    return await this.prisma.product.findMany({
      skip: offset,
      take: limit,
      where: filters,
      include: {
        images: true
      }
    })
  }

  async findOne(id: number): Promise<Product> {
    //TODO: include al least one image per Product
    const product = await this.prisma.product.findUnique({
      where: {
        id
      },
      include: {
        images: true
      }
    })
    return product
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    console.log(updateProductDto)
    const updatedProduct = await this.prisma.product.update({
      where: {
        id
      },
      data: updateProductDto
    })
    return updatedProduct
  }

  async remove(id: number): Promise<Product> {
    const deletedProduct = await this.prisma.product.delete({
      where: {
        id
      }
    })
    return deletedProduct
  }
}
