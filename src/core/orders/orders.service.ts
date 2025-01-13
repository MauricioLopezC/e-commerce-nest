import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartItem, Order, Prisma, Product } from '@prisma/client';
import { ResendService } from 'nestjs-resend';
import { NotFoundError } from 'src/common/errors/not-found-error';
import { DiscountsService } from '../promotions/discounts/discounts.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private resendService: ResendService,
    private discountsService: DiscountsService
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
          include: { categories: true }
        }
      }
    })

    const total = cartItems.reduce((previous, current) => (
      previous + current.product.price * current.quantity
    ), 0)

    const { discountAmount, finalTotal } = await this.discountsService.calculateDiscounts(cartItems, total)
    console.log(discountAmount, total, finalTotal)

    //ahora vamos a calcular los descuentos automaticos

    const orderItems = cartItems.map((cartItem) => (
      {
        productId: cartItem.productId,
        productSkuId: cartItem.productSkuId,
        quantity: cartItem.quantity,
        price: cartItem.product.price
      }
    ))

    // const order = await this.prisma.order.create({
    //   data: {
    //     userId,
    //     total,
    //     finalToal: 0,
    //     payment: {
    //       create: createOrderDto.payment
    //     },
    //     shipping: {
    //       create: createOrderDto.shipping
    //     },
    //     orderItems: {
    //       create: orderItems
    //     }
    //   },
    //   include: {
    //     orderItems: true
    //   }
    // })

    // if (order) {
    //   //delete cartItem
    //   await this.prisma.cartItem.deleteMany({
    //     where: {
    //       cartId: cart.id
    //     }
    //   })
    //
    //   const email = await this.sendEmail(createOrderDto.email, cartItems)
    //   console.log("EMAIL", email)
    //
    //   order.orderItems.forEach(async (orderItem) => {
    //     const updatedPsku = await this.prisma.productSku.update({
    //       where: {
    //         id: orderItem.productSkuId
    //       },
    //       data: {
    //         quantity: {
    //           decrement: orderItem.quantity
    //         }
    //       }
    //     })
    //     console.log(updatedPsku)
    //
    //     const updatedProduct = await this.prisma.product.update({
    //       where: {
    //         id: orderItem.productId
    //       },
    //       data: {
    //         unitsOnOrder: {
    //           increment: orderItem.quantity
    //         },
    //         totalCollected: {
    //           increment: orderItem.price * orderItem.quantity
    //         }
    //       }
    //     })
    //     console.log(updatedProduct)
    //   })
    // }
    //
    // return order;
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
        shipping: true
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
