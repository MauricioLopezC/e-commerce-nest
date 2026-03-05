import { CartItemResponseDto } from 'src/cart-items/dto/cart-items-response.dto';

export class CartResponseDto {
  id: number;
  userId: number;
  updatedAt: Date;
  cartItems: CartItemResponseDto[];
}

export class CartWithMetadataResponse {
  cart: CartResponseDto;
  metadata: { cartTotal: number };
}
