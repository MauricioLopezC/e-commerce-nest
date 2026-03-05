import { Injectable } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'src/generated/prisma/client';
import { ListAllFavoritesDto } from './dto/list-all-favorites.dto';
import {
  NotFoundError,
  UniqueConstraintError,
} from 'src/common/errors/business-error';
import { prismaUniqueConstraintError } from 'src/common/prisma-erros';
import { FavoritesListWithRelations } from './mapper';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createFavoriteDto: CreateFavoriteDto) {
    try {
      return await this.prisma.favorite.create({
        data: { userId: userId, productId: createFavoriteDto.productId },
        include: {
          product: {
            include: {
              images: true,
              categories: true,
            },
          },
        },
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

  async findAllByUserId(
    userId: number,
    query: ListAllFavoritesDto,
  ): Promise<FavoritesListWithRelations> {
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
            categories: true,
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

  async findOneByUserId(userId: number, favoriteId: number) {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId: userId,
        id: favoriteId,
      },
      include: {
        product: {
          include: {
            images: true,
            categories: true,
          },
        },
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
      include: {
        product: {
          include: {
            images: true,
            categories: true,
          },
        },
      },
    });
  }

  async removeByUserId(userId: number, id: number) {
    return await this.prisma.favorite.delete({
      where: {
        id,
        userId,
      },
      include: {
        product: {
          include: {
            images: true,
            categories: true,
          },
        },
      },
    });
  }
}
