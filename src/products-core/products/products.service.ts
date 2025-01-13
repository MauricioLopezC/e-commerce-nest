import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ListAllProductDto } from './dto/list-all-products.dto';
import { Product } from '@prisma/client';

@Injectable()
export class ProductsService {
  //TODO: error control like cartItemService
  //TODO: change aggregate name to metaData
  //NOTE: all PrismaClientKnownRequestError could be manage by exception filter
  //and we can manage business errors here using custom errors
  //NOTE: consider add unique constraint to product.name
  //
  constructor(private prisma: PrismaService) { }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const newProduct = await this.prisma.product.create({
      data: createProductDto
    })
    return newProduct
  }

  async findAll(query: ListAllProductDto) {
    const limit = query.limit
    const page = query.page
    //TODO: check orderBy is valid field
    const orderBy = query.orderBy?.split(',') //creating orderby object
      .map((param) => param.trim())
      .map((param) => {
        let sortOrder = param.charAt(0) === '-' ? 'desc' : 'asc';
        let formatedParam = param.charAt(0) === '-' ? param.slice(1) : param;
        return {
          [formatedParam]: sortOrder
        }
      })

    console.log('orderBy:', orderBy)
    console.log("Limit and page: ", limit, page)

    const offset = (page - 1) * limit //for pagination offset
    delete query.limit
    delete query.page
    delete query.orderBy
    console.log("filters -->", query)

    const products = await this.prisma.product.findMany({
      orderBy,
      skip: offset,
      take: limit,
      where: query,
      include: {
        images: true,
      }
    })

    const aggregate = await this.prisma.product.aggregate({
      where: query,
      _count: true
    })

    return {
      products,
      aggregate
    }
  }

  async findOne(id: number): Promise<Product> {
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
