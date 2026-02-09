import { Injectable } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Favorite, Prisma } from 'src/generated/prisma/client';
import { ListAllFavoritesDto } from './dto/list-all-favorites.dto';
import {
  NotFoundError,
  UniqueConstraintError,
} from 'src/common/errors/business-error';
import { prismaUniqueConstraintError } from 'src/common/prisma-erros';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createFavoriteDto: CreateFavoriteDto) {
    try {
      return await this.prisma.favorite.create({
        data: { userId: userId, productId: createFavoriteDto.productId },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === prismaUniqueConstraintError
      ) {
        throw new UniqueConstraintError('Favorite already exists');
      }
      throw error;
    }
  }

  async findAllByUserId(userId: number, query: ListAllFavoritesDto) {
    const limit = query.limit;
    const page = query.page;
    const offset = (page - 1) * limit; //for pagination offset

    const filters: Prisma.FavoriteWhereInput = {};
    if (query.productId) filters.productId = query.productId;
    filters.userId = userId;

    const favorites = await this.prisma.favorite.findMany({
      skip: offset,
      take: limit,
      where: filters,
      include: {
        product: {
          include: {
            images: true,
          },
        },
      },
    });
    const aggregate = await this.prisma.favorite.aggregate({
      where: filters,
      _count: true,
    });

    return {
      favorites,
      metadata: { ...aggregate },
    };
  }

  async findOneByUserId(userId: number, favoriteId: number): Promise<Favorite> {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId: userId,
        id: favoriteId,
      },
    });

    if (!favorite) {
      throw new NotFoundError('Favorite not found');
    }
    return favorite;
  }

  async update(
    userId: number,
    productId: number,
    updateFavoriteDto: UpdateFavoriteDto,
  ) {
    return await this.prisma.favorite.update({
      where: {
        productId_userId: {
          userId,
          productId,
        },
      },
      data: updateFavoriteDto,
    });
  }

  async removeByUserId(userId: number, id: number) {
    return await this.prisma.favorite.delete({
      where: {
        id,
        userId,
      },
    });
  }
}
