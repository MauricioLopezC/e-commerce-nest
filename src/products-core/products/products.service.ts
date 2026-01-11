import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ListAllProductDto } from './dto/list-all-products.dto';
import { Prisma, Product } from 'src/generated/prisma/client';
import { ConnectCategoriesDto } from './dto/connect-categories.dto';
import { parseOrderBy } from '../../common/orderByParser';

@Injectable()
export class ProductsService {
  //NOTE: all PrismaClientKnownRequestError could be manage by exception filter,
  //and we can manage business errors here using custom errors

  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const categoriesIds = createProductDto.categories.map((categoryId) => ({
      id: categoryId,
    }));
    const data: Prisma.ProductCreateInput = {
      ...createProductDto,
      categories: { connect: [...categoriesIds] },
    };

    const newProduct = await this.prisma.product.create({
      data,
      include: {
        categories: true,
      },
    });
    return newProduct;
  }

  async findAll(query: ListAllProductDto) {
    const limit = query.limit;
    const page = query.page;
    const offset = (page - 1) * limit; //for pagination offset

    const orderBy = parseOrderBy(query.orderBy);

    const filters: Prisma.ProductWhereInput = {};
    if (query.category) {
      filters.categories = {
        some: {
          name: query.category,
        },
      };
    }
    if (query.name) {
      filters.name = {
        contains: query.name,
        mode: 'insensitive',
      };
    }
    if (query.sex) {
      filters.sex = query.sex;
    }

    const products = await this.prisma.product.findMany({
      orderBy,
      skip: offset,
      take: limit,
      where: filters,
      include: {
        images: true,
        categories: true,
      },
    });

    const aggregate = await this.prisma.product.aggregate({
      where: filters,
      _count: true,
    });

    return {
      products,
      metadata: { ...aggregate },
    };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        images: true,
        categories: true,
      },
    });
    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const updatedProduct = await this.prisma.product.update({
      where: {
        id,
      },
      data: updateProductDto,
    });
    return updatedProduct;
  }

  async remove(id: number): Promise<Product> {
    const deletedProduct = await this.prisma.product.delete({
      where: {
        id,
      },
    });
    return deletedProduct;
  }

  async connectCategories(
    id: number,
    connectCategoriesDto: ConnectCategoriesDto,
  ) {
    const categoryIds = connectCategoriesDto.categoryIds.map((categoryId) => ({
      id: categoryId,
    }));
    try {
      const product = await this.prisma.product.update({
        where: { id },
        data: {
          categories: {
            connect: categoryIds,
          },
        },
        include: {
          categories: true,
        },
      });
      return product;
    } catch (error) {
      throw new NotFoundException('some or all categories not found');
    }
  }

  async disconnectCategories(
    id: number,
    connectCategoriesDto: ConnectCategoriesDto,
  ) {
    const categoryIds = connectCategoriesDto.categoryIds.map((categoryId) => ({
      id: categoryId,
    }));
    try {
      const product = await this.prisma.product.update({
        where: { id },
        data: {
          categories: {
            disconnect: categoryIds,
          },
        },
        include: {
          categories: true,
        },
      });
      return product;
    } catch (error) {
      throw new NotFoundException('some or all categories not found');
    }
  }

  async replaceCategories(
    id: number,
    connectCategoriesDto: ConnectCategoriesDto,
  ) {
    const categoryIds = connectCategoriesDto.categoryIds.map((categoryId) => ({
      id: categoryId,
    }));
    try {
      const product = await this.prisma.product.update({
        where: { id },
        data: {
          categories: {
            set: categoryIds,
          },
        },
        include: {
          categories: true,
        },
      });
      return product;
    } catch (error) {
      throw new NotFoundException('some or all categories not found');
    }
  }
}
