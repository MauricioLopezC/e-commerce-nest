import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { ListAllFavoritesDto } from './dto/list-all-favorites.dto';
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
    return await this.favoritesService.create(user.id, createFavoriteDto);
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
    return await this.favoritesService.findOneByUserId(user.id, id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFavoriteDto: UpdateFavoriteDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return await this.favoritesService.update(user.id, id, updateFavoriteDto);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return await this.favoritesService.removeByUserId(user.id, id);
  }
}
