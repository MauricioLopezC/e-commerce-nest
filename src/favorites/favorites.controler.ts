import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { ListAllFavoritesDto } from './dto/list-all-favorites.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { mapToFavoriteResponse, mapToFavoritesListResponse } from './mapper';

@Roles(Role.Admin)
@Controller('users/:userId/favorites')
export class UsersFavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async findAll(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() query: ListAllFavoritesDto,
  ) {
    return mapToFavoritesListResponse(
      await this.favoritesService.findAllByUserId(userId, query),
    );
  }

  @Get(':id')
  async findOne(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return mapToFavoriteResponse(
      await this.favoritesService.findOneByUserId(userId, id),
    );
  }

  @Patch(':id')
  async update(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFavoriteDto: UpdateFavoriteDto,
  ) {
    return mapToFavoriteResponse(
      await this.favoritesService.update(userId, id, updateFavoriteDto),
    );
  }

  @Delete(':id')
  async remove(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return mapToFavoriteResponse(
      await this.favoritesService.removeByUserId(userId, id),
    );
  }
}
