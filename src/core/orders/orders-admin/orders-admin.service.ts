import { Injectable } from '@nestjs/common';
import { ListAllOrdersDto } from '../dto/list-all-orders.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { NotFoundError } from 'src/common/errors/not-found-error';
import { CreateOrderDto } from '../dto/create-order.dto';

@Injectable()
export class OrdersAdminService {

  constructor(private readonly prisma: PrismaService) { }

  async findAllOrders(query: ListAllOrdersDto) {
    const limit = query.limit
    const page = query.page
    const offset = (page - 1) * limit //for pagination offset

    const orders = await this.prisma.order.findMany({
      take: limit,
      skip: offset,
      include: {
        orderItems: {
          include: {
            product: true,
            productSku: true,
          }
        },
        payment: true,
        Shipping: true,
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
      orderBy: {
        createdAt: 'desc'
      }
    })

    const aggregate = await this.prisma.order.aggregate({
      _sum: {
        total: true,
      },
      _count: true,
    })

    return {
      orders,
      aggregate,
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
