import { BadRequestException, Body, Controller, Delete, Get, InternalServerErrorException, MethodNotAllowedException, NotFoundException, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { PublicRoute } from 'src/auth/decorators/public-routes.decorator';
import { NotFoundError } from 'src/common/errors/not-found-error';
import { ValidationError } from 'src/common/errors/validation-error';
import { ListAllDiscountsDto } from './dto/list-all-discounts.dto';

@Controller('promotions/discounts')
export class DiscountsController {
  constructor(private readonly discountsService: DiscountsService) { }

  @Roles(Role.Admin)
  @Post()
  async create(@Body() createDiscountDto: CreateDiscountDto) {
    try {
      return await this.discountsService.create(createDiscountDto)
    } catch (error) {
      if (error instanceof ValidationError) throw new BadRequestException(error.message)
      throw new InternalServerErrorException(error.message)
    }
  }

  @PublicRoute()
  @Get()
  async findAll(@Query() query: ListAllDiscountsDto) {
    return await this.discountsService.findAll(query)
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.discountsService.findOne(id)
    } catch (error) {
      if (error instanceof NotFoundError) throw new NotFoundException('discount not found')
      throw new InternalServerErrorException("server error")
    }
  }

  @Roles(Role.Admin)
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateDiscountDto: UpdateDiscountDto) {
    try {
      return await this.discountsService.update(id, updateDiscountDto)
    } catch (error) {
      if (error instanceof ValidationError) throw new BadRequestException(error.message)
      console.log(error)
      throw new InternalServerErrorException("Server Error, try again later!")
    }
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.discountsService.delete(id)
    } catch (error) {
      if (error instanceof NotFoundError) throw new NotFoundException(error.message)
    }
  }
}

