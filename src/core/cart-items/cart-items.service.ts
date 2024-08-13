import { Injectable } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartItem } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AlreadyIncludedError } from 'src/common/errors/already-included-error';
import { StockError } from './errors/stock-error';
import { NotFoundError } from 'src/common/errors/not-found-error';

@Injectable()
export class CartItemsService {
  constructor(private prisma: PrismaService) { }

  async create(cartId: number, createCartItemDto: CreateCartItemDto): Promise<CartItem> {
    const cartItemQuantity = createCartItemDto.quantity
    const productSku = await this.prisma.productSku.findUnique({
      where: {
        id: createCartItemDto.productSkuId
      }
    })
    if (!productSku) {
      throw new NotFoundError("product sku does not exist")
    }

    const product = await this.prisma.product.findUnique({
      where: {
        id: createCartItemDto.productId
      }
    })
    if (!product) throw new NotFoundError("product does not exist")

    console.log(cartItemQuantity, productSku.quantity)
    if (cartItemQuantity > productSku.quantity) {
      throw new StockError("There is not enough stock")
    }

    try {
      const newCartItem = await this.prisma.cartItem.create({
        data: { ...createCartItemDto, cartId }
      })
      return newCartItem
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        //NOTE: we could include that when product is already included in cart, increment
        //the stock istead throew error
        throw new AlreadyIncludedError("The product is already included")
      }
    }
  }

  async findAll(cartId: number): Promise<CartItem[]> {
    const cartItems = await this.prisma.cartItem.findMany({
      where: {
        cartId
      }
    })
    return cartItems
  }

  async findOne(cartId: number, id: number): Promise<CartItem> {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: {
        id,
        cartId
      }
    })
    return cartItem
  }

  async update(cartId: number, id: number, updateCartItemDto: UpdateCartItemDto): Promise<CartItem> {
    // only update quantity is allowed
    if (updateCartItemDto.quantity) {
      const thisCartItem = await this.findOne(cartId, id)

      if (!thisCartItem) throw new NotFoundError('Cart item not found')

      const newQuantity = updateCartItemDto.quantity
      const productSku = await this.prisma.productSku.findUnique({
        where: {
          id: thisCartItem.productSkuId
        }
      })

      if (!productSku) {
        throw new NotFoundError("product sku does not exist")
      }

      if (newQuantity > productSku.quantity) {
        throw new StockError("There is not enough stock")
      }
    }

    try {
      const updatedCartItem = await this.prisma.cartItem.update({
        where: {
          id,
          cartId
        },
        data: updateCartItemDto
      })
      return updatedCartItem
    } catch (error) {
      throw new NotFoundError("Cart item not found")
    }
  }

  async remove(cartId: number, id: number): Promise<CartItem> {
    try {
      const removedCartItem = await this.prisma.cartItem.delete({
        where: {
          id,
          cartId
        }
      })
      return removedCartItem
    } catch (error) {
      throw new NotFoundError("Cart item not found")
    }
  }

}
