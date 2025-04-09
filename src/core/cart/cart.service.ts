import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) { }

  async create(userId: number) {
    const cart = await this.prisma.cart.create({
      data: { userId }
    })
    return cart
  }

  async findAll(userId: number) {
    const carts = await this.prisma.cart.findMany({
      where: {
        userId
      },
      include: {
        CartItem: true,
      }
    })
    return carts
  }
}
