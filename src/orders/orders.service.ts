import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'src/generated/prisma/client';
import { DiscountsService } from '../promotions/discounts/discounts.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrderCreatedEvent } from './events/order-created.envent';
import { ListAllOrdersDto } from './dto/list-all-orders.dto';
import { parseOrderBy } from 'src/common/orderByParser';
import { UpdateOrderDto } from './dto/update-order.dto';
import {
  NotFoundError,
  ValidationError,
} from 'src/common/errors/business-error';
import { UserSelect } from '../users/user-constants';
import { OrderListWithRelations } from './mapper';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private discountsService: DiscountsService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(userId: number, createOrderDto: CreateOrderDto) {
    const result = await this.prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { userId },
        include: {
          CartItem: {
            include: { product: { include: { categories: true } } },
          },
        },
      });
      if (!cart) throw new NotFoundError(`cart not found`);

      const cartItems = cart.CartItem;
      if (cartItems.length === 0) {
        throw new ValidationError('User cart is empty');
      }

      const total = cartItems.reduce(
        (previous: Prisma.Decimal, current) =>
          previous.plus(current.product.price.times(current.quantity)),
        new Prisma.Decimal(0),
      );

      const { discountAmount, finalTotal, appliedDiscounts } =
        await this.discountsService.calculateDiscounts(
          cart.id,
          new Prisma.Decimal(total),
          true,
          tx,
        );

      const orderItems = cartItems.map((cartItem) => ({
        productId: cartItem.productId,
        productSkuId: cartItem.productSkuId,
        quantity: cartItem.quantity,
        price: cartItem.product.price,
      }));
      const cartProductSkuIds = cartItems.map(
        (cartItem) => cartItem.productSkuId,
      );

      const stockDecrement = cartItems.reduce(
        (acc, item) => {
          acc[item.productSkuId] = item.quantity;
          return acc;
        },
        {} as Record<number, number>,
      );

      for (const skuId of cartProductSkuIds) {
        const qty = stockDecrement[skuId];
        const result = await tx.productSku.updateMany({
          where: {
            id: skuId,
            quantity: { gte: qty },
          },
          data: {
            quantity: { decrement: qty },
          },
        });
        if (result.count === 0) {
          throw new ValidationError('There is not enough stock');
        }
      }

      const createdOrder = await tx.order.create({
        data: {
          userId,
          total,
          finalTotal,
          payment: {
            create: createOrderDto.payment,
          },
          shipping: {
            create: createOrderDto.shipping,
          },
          orderItems: {
            create: orderItems,
          },
          discountAmount,
        },
        include: {
          orderItems: {
            include: {
              product: { include: { images: true, categories: true } },
              productSku: true,
            },
          },
          user: {
            select: UserSelect,
          },
          payment: true,
          shipping: true,
          discounts: { include: { discount: true } },
        },
      });

      await tx.cartItem.deleteMany({
        where: {
          cartId: cart.id,
        },
      });

      return { createdOrder, appliedDiscounts };
    });

    if (result) {
      const orderCreatedEvent = new OrderCreatedEvent();
      orderCreatedEvent.orderId = result.createdOrder.id;
      orderCreatedEvent.appliedDiscounts = result.appliedDiscounts;
      orderCreatedEvent.userId = userId;
      this.eventEmitter.emit('order.created', orderCreatedEvent);
    }

    return result.createdOrder;
  }

  async findAll(query: ListAllOrdersDto): Promise<OrderListWithRelations> {
    const limit = query.limit;
    const page = query.page;
    const offset = (page - 1) * limit;

    //creating prisma orderBy query object
    const orderBy = parseOrderBy(query.orderBy);

    const filters: Prisma.OrderWhereInput = {};
    if (query.status) {
      filters.status = query.status;
    }
    if (query.email) {
      filters.user = { email: query.email };
    }
    if (query.startDate) {
      filters.createdAt = { gte: query.startDate };
    }
    if (query.endDate) {
      filters.createdAt = { lte: query.endDate };
    }

    const orders = await this.prisma.order.findMany({
      take: limit,
      skip: offset,
      where: filters,
      orderBy,
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                images: true,
                categories: true,
              },
            },
            productSku: true,
          },
        },
        payment: true,
        shipping: true,
        user: {
          select: UserSelect,
        },
        discounts: {
          include: { discount: true },
        },
      },
    });

    const aggregate = await this.prisma.order.aggregate({
      where: filters,
      _sum: {
        total: true,
        finalTotal: true,
      },
      _count: true,
    });

    return {
      orders,
      metadata: { ...aggregate },
    };
  }

  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                images: true,
                categories: true,
              },
            },
            productSku: true,
          },
        },
        payment: true,
        shipping: true,
        user: {
          select: UserSelect,
        },
        discounts: {
          include: { discount: true },
        },
      },
    });
    if (!order) throw new NotFoundError(`Order with id:${id} not found`);
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    return await this.prisma.order.update({
      where: {
        id,
      },
      data: updateOrderDto,
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                images: true,
                categories: true,
              },
            },
            productSku: true,
          },
        },
        payment: true,
        shipping: true,
        user: {
          select: UserSelect,
        },
        discounts: {
          include: { discount: true },
        },
      },
    });
  }

  async delete(id: number) {
    return await this.prisma.order.delete({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                categories: true,
                images: true,
              },
            },
            productSku: true,
          },
        },
        payment: true,
        shipping: true,
        user: {
          select: UserSelect,
        },
        discounts: {
          include: { discount: true },
        },
      },
    });
  }

  async findAllByUserId(userId: number) {
    const orders = await this.prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        orderItems: {
          include: {
            product: {
              include: { images: true, categories: true },
            },
            productSku: true,
          },
        },
        user: {
          select: UserSelect,
        },
        payment: true,
        shipping: true,
        discounts: { include: { discount: true } },
      },
    });
    const aggregate = await this.prisma.order.aggregate({
      where: {
        userId,
      },
      _sum: {
        total: true,
        finalTotal: true,
      },
      _count: true,
    });

    return {
      orders,
      metadata: {
        ...aggregate,
      },
    };
  }

  async findOneByUserId(id: number, userId: number) {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
        userId,
      },
      include: {
        orderItems: {
          include: {
            product: { include: { images: true, categories: true } },
            productSku: true,
          },
        },
        user: {
          select: UserSelect,
        },
        payment: true,
        shipping: true,
        discounts: { include: { discount: true } },
      },
    });
    if (!order) throw new NotFoundError(`Order with id:${id} not found`);
    return order;
  }
}
