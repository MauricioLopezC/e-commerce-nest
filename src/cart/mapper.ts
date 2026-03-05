import { Prisma } from 'src/generated/prisma/client';
import {
  CartResponseDto,
  CartWithMetadataResponse,
} from './dto/cart-response.dto';
import { mapToCartItemResponse } from 'src/cart-items/mapper';

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
