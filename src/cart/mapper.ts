import { Prisma } from 'src/generated/prisma/client';
import {
  CalculateDiscountsResponseDto,
  CartResponseDto,
  CartWithMetadataResponse,
} from './dto/cart-response.dto';
import { mapToCartItemResponse } from 'src/cart-items/mapper';
import { CalculateDiscountsType } from './types';

type CartWithRelations = Prisma.CartGetPayload<{
  include: {
    CartItem: {
      include: {
        product: {
          include: {
            images: true;
            categories: true;
          };
        };
        productSku: true;
      };
    };
  };
}>;

export type CartWithMetadata = {
  cart: CartWithRelations;
  metadata: { cartTotal: Prisma.Decimal };
};

export function mapToCartResponse(cart: CartWithRelations): CartResponseDto {
  return {
    id: cart.id,
    userId: cart.userId,
    updatedAt: cart.updatedAt,
    cartItems: cart.CartItem.map((item) => mapToCartItemResponse(item)),
  };
}

export function mapToCartWithMetadataResponse(
  data: any,
): CartWithMetadataResponse {
  return {
    cart: mapToCartResponse(data.cart),
    metadata: {
      cartTotal: data.metadata.cartTotal.toNumber(),
    },
  };
}

export function mapToCalculateDiscountsResponse(
  data: CalculateDiscountsType,
): CalculateDiscountsResponseDto {
  return {
    discountAmount: data.discountAmount.toNumber(),
    finalTotal: data.finalTotal.toNumber(),
    appliedDiscounts: data.appliedDiscounts.map((d) => ({
      discountId: d.discountId,
      discountName: d.discountName,
      discountValue: d.discountValue,
      discountAmount: d.discountAmount.toNumber(),
      appliedTimes: d.appliedTimes,
    })),
  };
}
