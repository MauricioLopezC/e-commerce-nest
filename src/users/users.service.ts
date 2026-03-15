import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderStatus, User } from 'src/generated/prisma/client';
import { ListAllUsersDto } from './dto/list-all-users.dto';
import { UserSelect } from './user-constants';
import { UsersListWithRelations, UserWithStats } from './mapper';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * create a user and cart for that user in a transaction;
   */
  async create(createUserDto: CreateUserDto) {
    const createdUser = await this.prisma.user.create({
      data: {
        ...createUserDto,
        cart: {
          create: {},
        },
      },
      select: UserSelect,
    });
    return createdUser;
  }

  async findAll(query: ListAllUsersDto): Promise<UsersListWithRelations> {
    const limit = query.limit;
    const page = query.page;
    const offset = (page - 1) * limit; //for pagination offset

    const users = await this.prisma.user.findMany({
      select: UserSelect,
      take: limit,
      skip: offset,
    });

    //OPTIMIZE: consider moving this logic, totalSpent by user and totalOrdersBy uset to another place
    //in some cases we only need basic users data and this could cause bad performance
    const usersIds: number[] = users.map((user) => user.id);
    const ordersByUser = await this.prisma.order.groupBy({
      by: 'userId',
      where: {
        userId: {
          in: usersIds,
        },
        status: OrderStatus.COMPLETED,
      },
      _sum: {
        finalTotal: true,
      },
      _count: true,
    });

    const newUsers = users.map((user) => {
      const totalSpent =
        ordersByUser
          .find((order) => order.userId === user.id)
          ?._sum.finalTotal.toNumber() ?? 0;
      const totalOrders =
        ordersByUser.find((order) => order.userId === user.id)?._count ?? 0;
      return { ...user, totalSpent, totalOrders };
    });

    const aggregate = await this.prisma.user.aggregate({
      _count: true,
    });

    return {
      users: newUsers,
      metadata: { ...aggregate },
    };
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: {
        id: id,
      },
      select: UserSelect,
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: {
        id: id,
      },
      data: updateUserDto,
      select: UserSelect,
    });
  }

  async remove(id: number) {
    return this.prisma.user.delete({
      where: {
        id,
      },
      select: UserSelect,
    });
  }

  /**
   * only admin
   * @param id id of user to ban
   */
  async banUser(id: number) {
    return this.prisma.user.update({
      where: { id },
      data: {
        isBanned: true,
      },
      select: UserSelect,
    });
  }

  /**
   * only admin
   * @param id id of user to ban
   */
  async unBanUser(id: number) {
    return this.prisma.user.update({
      where: { id },
      data: {
        isBanned: false,
      },
      select: UserSelect,
    });
  }
}
