import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/CreateUserDto';
import { UpdateUserDto } from './dtos/UpdateUserDto';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderStatus, User } from '@prisma/client';
import { ListAllUsersDto } from './dtos/list-all-users.dto';
import { NotFoundError } from 'src/common/errors/not-found-error';
import { UsersListResponseDto } from './dtos/users-response.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  /**
   * create a user and cart for that user in a transaction;
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        ...createUserDto,
        cart: {
          create: {}
        }
      }
    })
    //should return User without the password and many other sensitive data
    return createdUser
  }

  async findAll(query: ListAllUsersDto): Promise<UsersListResponseDto> {
    const limit = query.limit
    const page = query.page
    const offset = (page - 1) * limit //for pagination offset

    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        verifiedEmail: true,
        role: true,
        isBanned: true,
        profileImage: true,
        createdAt: true,
        updatedAt: true,
      },
      take: limit,
      skip: offset
    })

    //OPTIMIZE: consider move this logic, totalSpent by user and totalOrdersBy uset to another place
    //in some cases we only need basic users data and this could cause bad performance
    const usersIds: number[] = users.map((user) => user.id)
    const ordersByUser = await this.prisma.order.groupBy({
      by: 'userId',
      where: {
        userId: {
          in: usersIds
        },
        status: OrderStatus.COMPLETED
      },
      _sum: {
        finalTotal: true
      },
      _count: true
    })

    const newUsers = users.map((user) => {
      const totalSpent = ordersByUser.find((order) => order.userId === user.id)?._sum.finalTotal.toNumber() ?? 0
      const totalOrders = ordersByUser.find((order) => order.userId === user.id)?._count ?? 0
      return { ...user, totalSpent, totalOrders }
    })

    const aggregate = await this.prisma.user.aggregate({
      _count: true,
    })

    return {
      users: newUsers,
      metadata: { ...aggregate }
    }
  }

  //TODO: update slect selecting every property but password
  async findOne(id: number) {
    return await this.prisma.user.findUnique({
      where: {
        id: id
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        //cart: true
      }

    })
  }

  async findByEmail(email: string): Promise<User> {
    return await this.prisma.user.findUnique({
      where: {
        email: email
      }
    })
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    return await this.prisma.user.update({
      where: {
        id: id
      },
      data: updateUserDto
    })
  }

  async remove(id: number): Promise<User> {
    console.log("USER ID = ", id)
    const deletedUser = await this.prisma.user.delete({
      where: {
        id
      }
    })
    console.log("DELETED ", deletedUser)
    return deletedUser
  }

  /**
   * only admin
   * @param id id of user to ban
  */
  async banUser(id: number): Promise<User> {
    try {
      const bannedUser = await this.prisma.user.update({
        where: { id },
        data: {
          isBanned: true
        }
      })
      return bannedUser
    } catch (error) {
      throw new NotFoundError('user not found')
    }
  }

  /**
   * only admin
   * @param id id of user to ban
  */
  async unBanUser(id: number): Promise<User> {
    try {
      const bannedUser = await this.prisma.user.update({
        where: { id },
        data: {
          isBanned: false
        }
      })
      return bannedUser
    } catch (error) {
      throw new NotFoundError('user not found')
    }
  }
}
