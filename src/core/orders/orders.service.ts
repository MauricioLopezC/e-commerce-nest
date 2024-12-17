import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartItem, Order, Product } from '@prisma/client';
import { Payment } from '@prisma/client';
import { ResendService } from 'nestjs-resend';
import { ListAllOrdersDto } from './dto/list-all-orders.dto';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private resendService: ResendService
  ) { }

  async create(userId: number, createOrderDto: CreateOrderDto): Promise<Order> {
    //TODO: check that userId exist

    const cart = await this.prisma.cart.findUnique({
      where: {
        userId
      }
    })

    const cartItems = await this.prisma.cartItem.findMany({
      where: {
        cartId: cart.id
      },
      include: {
        product: true
      }

    })

    const total = cartItems.reduce((previous, current) => (
      previous + current.product.price * current.quantity
    ), 0)

    const orderItems = cartItems.map((cartItem) => (
      {
        productId: cartItem.productId,
        productSkuId: cartItem.productSkuId,
        quantity: cartItem.quantity,
        price: cartItem.product.price
      }
    ))

    const order = await this.prisma.order.create({
      data: {
        userId,
        total,
        payment: {
          create: createOrderDto.payment
        },
        Shipping: {
          create: createOrderDto.shipping
        },
        orderItems: {
          create: orderItems
        }
      },
      include: {
        orderItems: true
      }
    })

    //delete cartItem
    await this.prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id
      }
    })

    if (order) {
      await this.prisma.cartItem.deleteMany({
        where: {
          cartId: cart.id
        }
      })

      const email = await this.sendEmail(createOrderDto.email, cartItems)
      console.log("EMAIL", email)

      order.orderItems.forEach(async (orderItem) => {
        const updatedPsku = await this.prisma.productSku.update({
          where: {
            id: orderItem.productSkuId
          },
          data: {
            quantity: {
              decrement: orderItem.quantity
            }
          }
        })
        console.log(updatedPsku)
        const updatedProduct = await this.prisma.product.update({
          where: {
            id: orderItem.productId
          },
          data: {
            unitsOnOrder: {
              increment: orderItem.quantity
            },
            totalCollected: {
              increment: orderItem.price * orderItem.quantity
            }
          }
        })
        console.log(updatedProduct)
      })
    }

    return order;
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
            product: true,
            productSku: true,
          }
        },
        payment: true,
        Shipping: true
      }
    })
    return orders
  }


  /**
   * admin funtion used in orders-admin controller
  */
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
        total: true
      },
      _count: true,
      // where: {
      //   status: 'COMPLETED'
      // }
    })

    return {
      orders,
      aggregate,
    }
  }

  async test() {
    const prod = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
      }
    }) //product and total orders useful for top products

    //obtener un producto con sus ventas totales

    const product = await this.prisma.product.findMany({
      include: {
        images: true,
        orderItems: true
      }
    })



  }


  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
