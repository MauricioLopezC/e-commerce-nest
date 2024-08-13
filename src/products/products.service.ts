import { Injectable } from '@nestjs/common';
import { Product, ProductSku } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ListAllEntitiesDto } from './dtos/ListAllEntities';
import { CreateProductDto } from './dtos/CreateProductDto';
import { UpdateProductDto } from './dtos/UpdateProductDto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) { }

  async getAllProducts(limit = 10): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      take: limit,
      include: {
        productSku: true
      }
    })
    return products
  }

  async getFiltered(filters: ListAllEntitiesDto): Promise<Product[]> {
    //No need to convert filters.limit and filters.page from string to number
    //because they have already been converted in ListAllEntitiesDto using class-transformer
    //if user not provide limit and page, they have default value
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

  async getProductById(id: number): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: {
        id: id
      }
    })
    return product
  }

  async createProduct(product: CreateProductDto): Promise<Product> {
    const newProduct = await this.prisma.product.create({
      data: product
    })
    return newProduct
  }

  async createProductSku(productSku: ProductSku): Promise<ProductSku> {
    const newProductSku = await this.prisma.productSku.create({
      data: productSku
    })
    return newProductSku
  }

  async updateProduct(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    console.log(updateProductDto)
    const updatedProduct = await this.prisma.product.update({
      where: {
        id: id
      },
      data: updateProductDto
    })
    return updatedProduct
  }

  async removeProduct(id: number): Promise<Product> {
    const deletedProduct = await this.prisma.product.delete({
      where: {
        id: id //mejor implementar una validacion a nivel de controlador porque esto crashea
      }
    })
    return deletedProduct

  }
}
