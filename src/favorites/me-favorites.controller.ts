import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { AlreadyIncludedError } from '../common/errors/already-included-error';
import { ListAllFavoritesDto } from './dto/list-all-favorites.dto';
import { NotFoundError } from '../common/errors/not-found-error';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { CurrentUser } from '../common/current-user/current-user.decorator';
import { JwtPayload } from '../common/types/JwtPayload';

@Controller('/me/favorites')
export class MeFavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  async create(
    @Body() createFavoriteDto: CreateFavoriteDto,
    @CurrentUser() user: JwtPayload,
  ) {
    try {
      return await this.favoritesService.create(user.id, createFavoriteDto);
    } catch (error) {
      if (error instanceof AlreadyIncludedError)
        throw new ConflictException(error.message);
      throw new InternalServerErrorException('Error, try again later!');
    }
  }

  @Get()
  findAllByUserId(
    @CurrentUser() user: JwtPayload,
    @Query() query: ListAllFavoritesDto,
  ) {
    return this.favoritesService.findAllByUserId(user.id, query);
  }

  @Get(':id')
  async findOneByUserId(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    try {
      return await this.favoritesService.findOneByUserId(user.id, id);
    } catch (error) {
      if (error instanceof NotFoundError)
        throw new NotFoundException(error.message);
      throw new InternalServerErrorException('Error! try again later');
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFavoriteDto: UpdateFavoriteDto,
    @CurrentUser() user: JwtPayload,
  ) {
    try {
      return await this.favoritesService.update(user.id, id, updateFavoriteDto);
    } catch (error) {
      if (error instanceof NotFoundError)
        throw new NotFoundException(error.message);

      throw new InternalServerErrorException('Error! try again later');
    }
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    try {
      return await this.favoritesService.removeByUserId(user.id, id);
    } catch (error) {
      if (error instanceof NotFoundError)
        throw new NotFoundException(error.message);
      throw new InternalServerErrorException('Error! try again later');
    }
  }
}
