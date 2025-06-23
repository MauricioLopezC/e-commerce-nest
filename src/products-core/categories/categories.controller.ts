import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { NotFoundError } from 'src/common/errors/not-found-error';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { PublicRoute } from 'src/auth/decorators/public-routes.decorator';
import { AlreadyIncludedError } from 'src/common/errors/already-included-error';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Roles(Role.Admin)
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    try {
      return await this.categoriesService.create(createCategoryDto);
    } catch (error) {
      if (error instanceof AlreadyIncludedError) throw new ConflictException(error.message)
      throw new InternalServerErrorException(error.message)
    }
  }

  @PublicRoute()
  @Get()
  async findAll() {
    return await this.categoriesService.findAll();
  }

  @PublicRoute()
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.categoriesService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundError) throw new NotFoundException(error.message)
    }
  }

  @Roles(Role.Admin)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
    try {
      return this.categoriesService.update(+id, updateCategoryDto);
    } catch (error) {
      if (error instanceof NotFoundError) throw new NotFoundException(error.message)
    }
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.categoriesService.remove(+id);
    } catch (error) {
      if (error instanceof NotFoundError) throw new NotFoundException(error.message)
    }
  }
}
