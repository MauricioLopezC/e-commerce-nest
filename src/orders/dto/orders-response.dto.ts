import { ProductSkuResponseDto } from 'src/products-core/product-skus/dto/product-skus-response.dto';
import { ProductResponseDto } from 'src/products-core/products/dto/products-response.dto';
import { DiscountResponseDto } from 'src/promotions/discounts/dto/discounts-response.dto';
import { UserResponseDto } from 'src/users/dto/users-response.dto';

export class OrderResponseDto {
  id: number;
  userId: number;
  status: string;
  total: number;
  discountAmount: number;
  finalTotal: number;
  createdAt: Date;
  updatedAt: Date;

  orderItems?: OrderItemResponseDto[];
  payment?: PaymentResponseDto;
  shipping?: ShippingResponseDto;
  user?: UserResponseDto;
  discounts?: DiscountsData[];
}

class DiscountsData {
  discountId: number;
  orderId: number;
  appliedTimes: number;
  discountAmount: number;
  assignedAt: Date;
  discount: DiscountResponseDto;
}

export class OrderItemResponseDto {
  id: number;
  orderId: number;
  productId: number;
  productSkuId: number;
  quantity: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  product?: ProductResponseDto;
  productSku?: ProductSkuResponseDto;
}

export class PaymentResponseDto {
  id: number;
  orderId: number;
  provider: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ShippingResponseDto {
  id: number;
  orderId: number;
  country: string;
  city: string;
  postalCode: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

export class OrderListResponse {
  orders: OrderResponseDto[];
  metadata: { _count: number; _sum: { total: number; finalTotal: number } };
}
