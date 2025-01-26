import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Category } from '@prisma/client';
import { NotFoundError } from 'src/common/errors/not-found-error';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = await this.prisma.category.create({
      data: createCategoryDto
    })
    return category;
  }

  async findAll() {
    const categories = await this.prisma.category.findMany()
    return categories;
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: {
        id
      }
    })

    if (!category) throw new NotFoundError('Category not found')
    return category

  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.prisma.category.update({
        where: { id },
        data: updateCategoryDto
      })
      return category
    } catch (error) {
      throw new NotFoundError('Category not found')
    }
  }

  async remove(id: number) {
    try {
      const category = await this.prisma.category.delete({
        where: { id },
      })
      return category
    } catch (error) {
      throw new NotFoundError('Category not found')
    }
  }
}
