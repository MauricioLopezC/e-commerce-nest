import { Injectable } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartItem, Prisma } from 'src/generated/prisma/client';
import { AlreadyIncludedError } from 'src/common/errors/already-included-error';
import { StockError } from './errors/stock-error';
import { NotFoundError } from 'src/common/errors/not-found-error';
import { ValidationError } from '../common/errors/validation-error';

@Injectable()
export class CartItemsService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: number,
    cartItemDto: CreateCartItemDto,
  ): Promise<CartItem> {
    const productSku = await this.prisma.productSku.findUnique({
      where: {
        id: cartItemDto.productSkuId,
      },
    });

    if (!productSku) {
      throw new NotFoundError('product sku does not exist');
    }

    if (cartItemDto.quantity > productSku.quantity) {
      throw new ValidationError('There is not enough stock');
    }

    const cart = await this.prisma.cart.findUnique({ where: { userId } });

    try {
      return await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: cartItemDto.productId,
          productSkuId: cartItemDto.productSkuId,
          quantity: cartItemDto.quantity,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new AlreadyIncludedError(
          'The product is already included or not found',
        );
      }
      throw error;
    }
  }

  async findAllByUserId(userId: number): Promise<CartItem[]> {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    const cartItems = await this.prisma.cartItem.findMany({
      where: {
        cartId: cart.id,
      },
      include: {
        product: {
          include: {
            images: true,
          },
        },
        productSku: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return cartItems;
  }

  async findOneByUserId(userId: number, id: number): Promise<CartItem> {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    const cartItem = await this.prisma.cartItem.findUnique({
      where: {
        id,
        cartId: cart.id,
      },
    });

    if (!cartItem) throw new NotFoundError('Cart item not found');
    return cartItem;
  }

  async updateByUserId(
    userId: number,
    id: number,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartItem> {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (updateCartItemDto.quantity) {
      const cartItem = await this.prisma.cartItem.findUnique({
        where: {
          id,
          cartId: cart.id,
        },
      });

      if (!cartItem) throw new NotFoundError('Cart item not found');

      const newQuantity = updateCartItemDto.quantity;
      const productSku = await this.prisma.productSku.findUnique({
        where: {
          id: cartItem.productSkuId,
        },
      });

      if (!productSku) {
        throw new NotFoundError('product sku does not exist');
      }

      if (newQuantity > productSku.quantity) {
        throw new StockError('There is not enough stock');
      }
    }

    try {
      return await this.prisma.cartItem.update({
        where: {
          id,
          cartId: cart.id,
        },
        data: updateCartItemDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2001'
      )
        throw new NotFoundError('Cart item not found');
      throw error;
    }
  }

  async remove(userId: number, id: number): Promise<CartItem> {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    try {
      const removedCartItem = await this.prisma.cartItem.delete({
        where: {
          id,
          cartId: cart.id,
        },
      });
      return removedCartItem;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      )
        throw new NotFoundError('Cart item not found');

      console.error(error);
      throw error;
    }
  }
}
