import { ConflictException, Injectable } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Favorite } from '@prisma/client';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) { }

  async create(userId: number, createFavoriteDto: CreateFavoriteDto) {
    //TODO: evitar que se agregen productsIds de productos que no existan
    //si bien esto deberia controlarlo la app frontend, algun usuario podria llamar
    //a la api con fetch desde consola y crear favoritos con productos que 
    //no existan
    //TODO: don't throw HTTP exception here, only business logic errors here
    try {
      const createdFavorite = await this.prisma.favorite.create({
        data: { userId: userId, productId: createFavoriteDto.productId }
      })
      return createdFavorite
    } catch (error) {
      throw new ConflictException('The product is already included')
    }
  }

  async findAll(userId: number) {
    const favorites = await this.prisma.favorite.findMany({
      where: {
        userId: userId
      }
    })
    return favorites
  }

  async findOne(userId: number, favoriteId: number): Promise<Favorite> {
    return await this.prisma.favorite.findUnique({
      where: {
        userId: userId,
        id: favoriteId
      }
    });
  }

  async update(userId: number, productId: number, updateFavoriteDto: UpdateFavoriteDto) {
    //TODO: evitar que se agregen productsIds de productos que no existan
    //
    //TODO: add Custom error that indicate favorite does not exist
    return await this.prisma.favorite.update({
      where: {
        productId_userId: {
          userId,
          productId
        }
      },
      data: updateFavoriteDto
    });
  }

  async remove(userId: number, id: number) {
    //TODO: add Custom error that indicate favorite does not exist 
    const deleted = await this.prisma.favorite.delete({
      where: {
        id,
        userId
      }
    })
    return deleted
  }
}
