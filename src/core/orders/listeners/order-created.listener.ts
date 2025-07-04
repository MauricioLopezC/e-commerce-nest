import { OnEvent } from "@nestjs/event-emitter";
import { OrderCreatedEvent } from "../events/order-created.envent";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class OrderCreatedListener {

  constructor(private readonly prisma: PrismaService) { }

  @OnEvent('order.created')
  async handleOrderCreatedEvent(event: OrderCreatedEvent) {
    //First update totalCollected and Units onOrder from products table
    const order = await this.prisma.order.findUnique({
      where: {
        id: event.orderId
      },
      include: {
        orderItems: true
      }
    })

    const productUpdates = order.orderItems.map((orderItem) => {
      return this.prisma.product.update({
        where: {
          id: orderItem.productId,
        },
        data: {
          unitsOnOrder: {
            increment: orderItem.quantity
          },
          totalCollected: {
            increment: orderItem.price.times(orderItem.quantity).toNumber()
          }
        }
      })
    })
    await Promise.all(productUpdates)
    //now register discount usage:
    const data: Prisma.DiscountsOnOrdersCreateManyInput[] = event.appliedDiscounts.map(item => ({
      orderId: event.orderId,
      discountId: item.discountId,
      appliedTimes: item.appliedTimes,
      discountAmount: item.discountAmount.toNumber(),
    }))
    await this.prisma.discountsOnOrders.createMany({
      data
    })
  }
}
