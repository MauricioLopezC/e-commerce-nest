import { Injectable } from '@nestjs/common';
import { ListAllOrdersDto } from '../dto/list-all-orders.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { NotFoundError } from 'src/common/errors/not-found-error';

@Injectable()
export class OrdersAdminService {

  constructor(private readonly prisma: PrismaService) { }

  async findAllOrders(query: ListAllOrdersDto) {

    let filters = {
      status: query.status,
      user: {
        email: {
          contains: query.email
        }
      },
      createdAt: {
        gte: query.startDate,
        lte: query.endDate
      }
    }

    const limit = query.limit
    const page = query.page
    const offset = (page - 1) * limit
    //creating where query object

    //creating prisma orderBy query object
    const orderBy = query.orderBy?.map((param) => {
      let sortOrder = param.charAt(0) === '-' ? 'desc' : 'asc';
      let formatedParam = param.charAt(0) === '-' ? param.slice(1) : param;
      return {
        [formatedParam]: sortOrder
      }
    })
    console.log(orderBy)

    const orders = await this.prisma.order.findMany({
      take: limit,
      skip: offset,
      where: filters,
      // where: {
      //   createdAt: {
      //     gte: new Date('2024/11/1'),
      //     lte: new Date('2024/10/1')
      //   }
      // },
      orderBy,
      include: {
        orderItems: {
          include: {
            product: true,
            productSku: true,
          }
        },
        payment: true,
        shipping: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true
          }
        }
      },
    })

    const aggregate = await this.prisma.order.aggregate({
      where: filters,
      _sum: {
        total: true,
      },
      _count: true,
    })

    return {
      orders,
      metadata: { ...aggregate },
    }
  }

  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: {
        id
      }
    })
    if (!order) throw new NotFoundError(`Order with id:${id} not found`)
    return order
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.prisma.order.update({
      where: {
        id
      },
      data: updateOrderDto
    })
    return order
  }

}
