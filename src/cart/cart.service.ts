import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Discount, Prisma } from 'src/generated/prisma/client';
import { DiscountsService } from '../promotions/discounts/discounts.service';
import { CalculateDiscountsResponse } from './dto/calculate-discunts-response.dto';

@Injectable()
export class CartService {
  constructor(
    private prisma: PrismaService,
    private readonly discountsService: DiscountsService,
  ) {}

  async create(userId: number) {
    const cart = await this.prisma.cart.create({
      data: { userId },
    });
    return cart;
  }

  async findOneByUserId(userId: number) {
    const cart = await this.prisma.cart.findUnique({
      where: {
        userId,
      },
      include: {
        CartItem: {
          include: {
            product: true,
          },
        },
      },
    });
    const cartItems = cart.CartItem;

    const cartTotal = cartItems.reduce(
      (previous: Prisma.Decimal, current) =>
        previous.plus(current.product.price.times(current.quantity)),
      new Prisma.Decimal(0),
    );

    return {
      cart,
      metadata: {
        cartTotal,
      },
    };
  }

  async calculateCartTotal(userId: number) {
    const cart = await this.prisma.cart.findUnique({
      where: {
        userId,
      },
    });

    const cartItems = await this.prisma.cartItem.findMany({
      where: {
        cartId: cart.id,
      },
      include: {
        product: true,
      },
    });

    const total = cartItems.reduce(
      (previous: Prisma.Decimal, current) =>
        previous.plus(current.product.price.times(current.quantity)),
      new Prisma.Decimal(0),
    );

    return total;
  }

  async checkDiscounts(userId: number): Promise<CalculateDiscountsResponse> {
    const cart = await this.prisma.cart.findUnique({ where: { id: userId } });
    const total = await this.calculateCartTotal(userId);

    const calculateDiscounts = await this.discountsService.calculateDiscounts(
      cart.id,
      total,
      false,
    );
    const discounts = await this.prisma.discount.findMany({
      where: {
        id: {
          in: calculateDiscounts.appliedDiscounts.map(
            (item) => item.discountId,
          ),
        },
      },
    });
    //join appliedDiscountsArray with discountName
    const appliedDiscounts = calculateDiscounts.appliedDiscounts.map((item) => {
      const discount: Discount = discounts.find(
        (discount) => discount.id === item.discountId,
      );
      return {
        ...item,
        discountName: discount.name,
        discountValue: discount.value,
      };
    });
    return {
      discountAmount: calculateDiscounts.discountAmount,
      finalTotal: calculateDiscounts.finalTotal,
      appliedDiscounts,
    };
  }
}
