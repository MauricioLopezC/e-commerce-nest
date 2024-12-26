import { ConflictException, Injectable } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Favorite } from '@prisma/client';
import { ListAllFavoritesDto } from './dto/list-all-favorites.dto';

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

  async findAll(userId: number, query: ListAllFavoritesDto) {
    //TODO: aply filters or query to aggregate too
    const limit = query.limit
    const page = query.page
    const offset = (page - 1) * limit //for pagination offset
    delete query.page
    delete query.limit

    const favorites = await this.prisma.favorite.findMany({
      skip: offset,
      take: limit,
      where: {
        ...query,
        userId: userId
      },
      include: {
        product: {
          include: {
            images: true
          }
        }
      }
    })
    const aggregate = await this.prisma.favorite.aggregate({
      //where: query,
      _count: true
    })

    return {
      favorites,
      aggregate
    }
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

  async removeByProductId(userId: number, productId: number) {
    //NOTE: way to use unique constraint
    const deleted = await this.prisma.favorite.delete({
      where: {
        productId_userId: {
          productId,
          userId
        }
      }
    })
    return deleted

  }


}
