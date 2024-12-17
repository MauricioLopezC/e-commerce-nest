import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Query } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { OwnGuard } from '../guards/own.guard';
import { ListAllFavoritesDto } from './dto/list-all-favorites.dto';

@UseGuards(OwnGuard)
@Controller('users/:userId/favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) { }

  @Post()
  create(@Param('userId', ParseIntPipe) userId: number, @Body() createFavoriteDto: CreateFavoriteDto) {
    return this.favoritesService.create(userId, createFavoriteDto);
  }

  @Get()
  findAll(@Param('userId', ParseIntPipe) userId: number, @Query() query: ListAllFavoritesDto) {
    return this.favoritesService.findAll(userId, query);
  }

  @Get(':id')
  findOne(@Param('userId', ParseIntPipe) userId: number, @Param('id', ParseIntPipe) id: number) {
    return this.favoritesService.findOne(userId, id);
  }

  @Patch(':id')
  update(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFavoriteDto: UpdateFavoriteDto
  ) {
    return this.favoritesService.update(userId, id, updateFavoriteDto);
  }

  // @Delete()
  // removeWithOutUserId(@Param('userId', ParseIntPipe) userId: number) {
  //   //TODO: move this one method to another controller
  //   return this.favoritesService.removeByProductId(userId, ) 
  // }

  @Delete(':id')
  remove(@Param('userId', ParseIntPipe) userId: number, @Param('id', ParseIntPipe) id: number) {
    return this.favoritesService.remove(userId, id);
  }
}
