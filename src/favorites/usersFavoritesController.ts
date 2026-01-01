import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { ListAllFavoritesDto } from './dto/list-all-favorites.dto';
import { NotFoundError } from 'src/common/errors/not-found-error';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@Roles(Role.Admin)
@Controller('users/:userId/favorites')
export class UsersFavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  findAll(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() query: ListAllFavoritesDto,
  ) {
    return this.favoritesService.findAllByUserId(userId, query);
  }

  @Get(':id')
  async findOne(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      return this.favoritesService.findOneByUserId(userId, id);
    } catch (error) {
      if (error instanceof NotFoundError)
        throw new NotFoundException(error.message);
      throw new InternalServerErrorException('Error! try again later');
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
      throw new InternalServerErrorException('Error! try again later');
    }
  }

  @Delete(':id')
  async remove(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      return await this.favoritesService.removeByUserId(userId, id);
    } catch (error) {
      if (error instanceof NotFoundError)
        throw new NotFoundException(error.message);
      throw new InternalServerErrorException('Error! try again later');
    }
  }
}
