import { Prisma } from 'src/generated/prisma/client';
import { CartItemResponseDto } from './dto/cart-items-response.dto';
import { mapToProductResponseDto } from 'src/products-core/products/mapper';

type CartItemWithRelations = Prisma.CartItemGetPayload<{
  include: {
    product: {
      include: {
        images: true;
        categories: true;
      };
    };
    productSku: true;
  };
}>;

export function mapToCartItemResponse(
  cartItem: CartItemWithRelations,
): CartItemResponseDto {
  return {
    id: cartItem.id,
    cartId: cartItem.cartId,
    productId: cartItem.productId,
    productSkuId: cartItem.productSkuId,
    quantity: cartItem.quantity,
    createdAt: cartItem.createdAt,
    updatedAt: cartItem.updatedAt,
    product: mapToProductResponseDto(cartItem.product),
    productSku: {
      id: cartItem.productSku.id,
      productId: cartItem.productSku.productId,
      size: cartItem.productSku.size,
      color: cartItem.productSku.color,
      quantity: cartItem.productSku.quantity,
      createdAt: cartItem.productSku.createdAt,
      updatedAt: cartItem.productSku.updatedAt,
      images: [],
    },
  };
}
