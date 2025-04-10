import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ListAllProductDto } from './dto/list-all-products.dto';
import { Prisma, Product } from '@prisma/client';
import { ConnectCategoriesDto } from './dto/connect-categories.dto';

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

    const categoriesIds = createProductDto.categories.map((categoryId) => ({ id: categoryId }))
    const data: Prisma.ProductCreateInput = { ...createProductDto, categories: { connect: [...categoriesIds] } }

    const newProduct = await this.prisma.product.create({
      data,
      include: {
        categories: true
      }
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
        categories: true
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
        images: true,
        categories: true
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

  async connectCategories(id: number, connectCategoriesDto: ConnectCategoriesDto) {
    const categoryIds = connectCategoriesDto.categoryIds.map((categoryId) => ({ id: categoryId }))
    try {
      const product = await this.prisma.product.update({
        where: { id },
        data: {
          categories: {
            connect: categoryIds
          }
        },
        include: {
          categories: true
        }
      })
      return product
    } catch (error) {
      throw new NotFoundException('some or all categories not found')
    }
  }

  async disconnectCategories(id: number, connectCategoriesDto: ConnectCategoriesDto) {
    const categoryIds = connectCategoriesDto.categoryIds.map((categoryId) => ({ id: categoryId }))
    try {
      const product = await this.prisma.product.update({
        where: { id },
        data: {
          categories: {
            disconnect: categoryIds
          }
        },
        include: {
          categories: true
        }
      })
      return product
    } catch (error) {
      throw new NotFoundException('some or all categories not found')
    }
  }

  async replaceCategories(id: number, connectCategoriesDto: ConnectCategoriesDto) {
    const categoryIds = connectCategoriesDto.categoryIds.map((categoryId) => ({ id: categoryId }))
    try {
      const product = await this.prisma.product.update({
        where: { id },
        data: {
          categories: {
            set: categoryIds
          }
        },
        include: {
          categories: true
        }
      })
      return product
    } catch (error) {
      throw new NotFoundException('some or all categories not found')
    }
  }
}
