import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { PublicRoute } from 'src/auth/decorators/public-routes.decorator';
import { CategoryResponseDto } from './dto/categories-response.dto';
import { Prisma } from 'src/generated/prisma/client';

type CategoryModel = Prisma.CategoryGetPayload<{}>;

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  private mapToCategoryResponseDto(
    category: CategoryModel,
  ): CategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  @Roles(Role.Admin)
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.mapToCategoryResponseDto(
      await this.categoriesService.create(createCategoryDto),
    );
  }

  @PublicRoute()
  @Get()
  async findAll() {
    const categories = await this.categoriesService.findAll();
    return categories.map((category) =>
      this.mapToCategoryResponseDto(category),
    );
  }

  @PublicRoute()
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.mapToCategoryResponseDto(
      await this.categoriesService.findOne(id),
    );
  }

  @Roles(Role.Admin)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.mapToCategoryResponseDto(
      await this.categoriesService.update(+id, updateCategoryDto),
    );
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.mapToCategoryResponseDto(
      await this.categoriesService.remove(+id),
    );
  }
}
