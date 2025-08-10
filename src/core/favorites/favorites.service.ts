import { Injectable } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Favorite } from '@prisma/client';
import { ListAllFavoritesDto } from './dto/list-all-favorites.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NotFoundError } from 'src/common/errors/not-found-error';
import { AlreadyIncludedError } from 'src/common/errors/already-included-error';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) { }

  async create(userId: number, createFavoriteDto: CreateFavoriteDto) {
    try {
      const createdFavorite = await this.prisma.favorite.create({
        data: { userId: userId, productId: createFavoriteDto.productId }
      })
      return createdFavorite
    } catch (error) {
      throw new AlreadyIncludedError('The product is already included')
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
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId: userId,
        id: favoriteId
      }
    });

    if (!favorite) {
      throw new NotFoundError('Favorite not found')
    }
    return favorite
  }

  async update(userId: number, productId: number, updateFavoriteDto: UpdateFavoriteDto) {
    try {
      return await this.prisma.favorite.update({
        where: {
          productId_userId: {
            userId,
            productId
          }
        },
        data: updateFavoriteDto
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2001') {
        throw new NotFoundError('Favorite not found')
      }
    }
  }

  async remove(userId: number, id: number) {
    try {
      const deleted = await this.prisma.favorite.delete({
        where: {
          id,
          userId
        }
      })
      return deleted
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2001') {
        throw new NotFoundError('Favorite not found')
      }
    }
  }

  async removeByProductId(userId: number, productId: number) {
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
