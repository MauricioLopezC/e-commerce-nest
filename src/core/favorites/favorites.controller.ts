import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Query,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { OwnGuard } from '../guards/own.guard';
import { ListAllFavoritesDto } from './dto/list-all-favorites.dto';
import { AlreadyIncludedError } from 'src/common/errors/already-included-error';
import { NotFoundError } from 'src/common/errors/not-found-error';

@UseGuards(OwnGuard)
@Controller('users/:userId/favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  async create(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() createFavoriteDto: CreateFavoriteDto,
  ) {
    try {
      return await this.favoritesService.create(userId, createFavoriteDto);
    } catch (error) {
      if (error instanceof AlreadyIncludedError)
        throw new ConflictException(error.message);
    }
  }

  @Get()
  findAll(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() query: ListAllFavoritesDto,
  ) {
    return this.favoritesService.findAll(userId, query);
  }

  @Get(':id')
  async findOne(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      return this.favoritesService.findOne(userId, id);
    } catch (error) {
      if (error instanceof NotFoundError)
        throw new NotFoundException(error.message);
    }
  }

  @Patch(':id')
  async update(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFavoriteDto: UpdateFavoriteDto,
  ) {
    try {
      return await this.favoritesService.update(userId, id, updateFavoriteDto);
    } catch (error) {
      if (error instanceof NotFoundError)
        throw new NotFoundException(error.message);
    }
  }

  // @Delete()
  // removeWithOutUserId(@Param('userId', ParseIntPipe) userId: number) {
  //   return this.favoritesService.removeByProductId(userId, )
  // }

  @Delete(':id')
  async remove(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      return await this.favoritesService.remove(userId, id);
    } catch (error) {
      if (error instanceof NotFoundError)
        throw new NotFoundException(error.message);
    }
  }
}
