import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartItem, Prisma, Product } from '@prisma/client';
import { ResendService } from 'nestjs-resend';
import { NotFoundError } from 'src/common/errors/not-found-error';
import { DiscountsService } from '../promotions/discounts/discounts.service';
import { InternalServerError } from 'src/common/errors/internal-server-error';
import { ValidationError } from 'src/common/errors/validation-error';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrderCreatedEvent } from './events/order-created.envent';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private resendService: ResendService,
    private discountsService: DiscountsService,
    private eventEmitter: EventEmitter2
  ) { }

  async create(userId: number, createOrderDto: CreateOrderDto) {
    const cart = await this.prisma.cart.findUnique({
      where: {
        userId
      }
    })
    if (!cart) throw new NotFoundError(`cart not found`)

    const cartItems = await this.prisma.cartItem.findMany({
      where: {
        cartId: cart.id
      },
      include: {
        product: {
          include: {
            categories: true,
          },
        }
      }
    })
    //TODO: check if cartItems list is empty

    const total = cartItems.reduce((previous: Prisma.Decimal, current) => (
      previous.plus(current.product.price.times(current.quantity))
    ), new Prisma.Decimal(0))

    const { discountAmount, finalTotal, appliedDiscounts } = await this.discountsService.calculateDiscounts(cart.id, new Prisma.Decimal(total), true)
    console.log(appliedDiscounts)

    const orderItems = cartItems.map((cartItem) => (
      {
        productId: cartItem.productId,
        productSkuId: cartItem.productSkuId,
        quantity: cartItem.quantity,
        price: cartItem.product.price
      }
    ))
    const cartProductSkuIds = cartItems.map((cartItem) => cartItem.productSkuId)
    try {
      const result = await this.prisma.$transaction(async (tx) => {
        //first check available stock
        const productSkus = await tx.productSku.findMany({
          where: {
            id: {
              in: cartProductSkuIds
            }
          }
        })
        for (let productSku of productSkus) {
          const cartItem = cartItems.find(cartItem => cartItem.productSkuId === productSku.id)
          if (cartItem.quantity > productSku.quantity) {
            throw new ValidationError('There is not enough stock')
          }
        }

        const createdOrder = await tx.order.create({
          data: {
            userId,
            total,
            finalTotal,
            payment: {
              create: createOrderDto.payment
            },
            shipping: {
              create: createOrderDto.shipping
            },
            orderItems: {
              create: orderItems
            },
            discountAmount
          },
          include: {
            orderItems: true
          }
        })

        await tx.cartItem.deleteMany({
          where: {
            cartId: cart.id
          }
        })

        const stockUpdates = createdOrder.orderItems.map((orderItem) => {
          return tx.productSku.update({
            where: {
              id: orderItem.productSkuId
            },
            data: {
              quantity: {
                decrement: orderItem.quantity
              }
            }
          })

        })
        await Promise.all(stockUpdates)

        //NOTE: this code block can be be removed from the transaction
        //and moved to a trigger over event passing order id, have access
        //to orderItems
        const productUpdates = createdOrder.orderItems.map((orderItem) => {
          return tx.product.update({
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
        return createdOrder
      })
      this.sendEmail(createOrderDto.email, cartItems)

      if (result) {
        let orderCreatedEvent = new OrderCreatedEvent();
        orderCreatedEvent.orderId = result.id
        this.eventEmitter.emit(
          'order.created',
          orderCreatedEvent
        )
      }

      //TODO: register discount usage
      return result
    } catch (error) {
      throw new InternalServerError("Error al crear la orden")
    }
  }

  async sendEmail(email: string, cartItems: Array<CartItem & { product: Product }>) {
    let listItems = ''
    cartItems.forEach((item) => {
      listItems = listItems.concat(`<li>${item.quantity}X  ${item.product.name}</li>`)
    })

    const productList = `
    <ul>
    ${listItems}
    </ul>
    `

    return await this.resendService.send({
      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: 'Compra confirmada',
      html: `
        <html>
          <body>
            <h1>Muchas gracias por comprar en nuestra tienda</h1>
            <p>Resumen de su compra: </p>
            ${productList}
          </body>
        </html>
        `,
    });
  }

  async findAll(userId: number) {
    const orders = await this.prisma.order.findMany({
      where: {
        userId
      },
      include: {
        orderItems: {
          include: {
            product: {
              include: { images: true }
            },
            productSku: true,
          }
        },
        payment: true,
        shipping: true,
        discounts: true
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
      },
      include: {
        payment: true,
        shipping: true,
        orderItems: {
          include: {
            product: true,
            productSku: true,
          }
        },
      }
    });
    return order
  }

  // update(id: number, updateOrderDto: UpdateOrderDto) {
  //   return `This action updates a #${id} order`;
  // }
  //
}
