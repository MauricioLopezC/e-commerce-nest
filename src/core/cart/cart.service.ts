import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) { }

  async create(userId: number, createCartDto: CreateCartDto) {
    const cart = await this.prisma.cart.create({
      data: { userId }
    })
    return cart
  }

  async findAll(userId: number) {
    const carts = await this.prisma.cart.findMany({
      where: {
        userId
      }
    })
    return carts
  }

  // findOne(userId: number, id: number) {
  //   return `This action returns a #${id} cart`;
  // }
  //
  // //could be useful for update an total atributte in cartTable
  // update(id: number, updateCartDto: UpdateCartDto) {
  //   return `This action updates a #${id} cart`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} cart`;
  // }
}
