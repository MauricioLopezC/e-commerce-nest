import { Payment, Prisma, Shipping } from 'src/generated/prisma/client';
import {
  OrderItemResponseDto,
  OrderListResponse,
  OrderResponseDto,
} from './dto/orders-response.dto';
import { mapToProductResponseDto } from 'src/products-core/products/mapper';
import { Decimal } from 'src/generated/prisma/internal/prismaNamespace';

type OrderWithRelations = Prisma.OrderGetPayload<{
  include: {
    orderItems: {
      include: {
        product: { include: { images: true; categories: true } };
        productSku: true;
      };
    };
    payment: true;
    shipping: true;
    discounts: { include: { discount: true } };
  };
}>;

type OrderItemWithRelations = Prisma.OrderItemGetPayload<{
  include: {
    product: { include: { images: true; categories: true } };
    productSku: true;
  };
}>;

export type OrderListWithRelations = {
  orders: OrderWithRelations[];
  metadata: { _count: number; _sum?: { total: Decimal } };
};

export function mapToPaymentResponse(payment: Payment) {
  return {
    id: payment.id,
    orderId: payment.orderId,
    provider: payment.provider,
    createdAt: payment.createdAt,
    updatedAt: payment.updatedAt,
  };
}

export function mapToShippingResponse(shipping: Shipping) {
  return {
    id: shipping.id,
    orderId: shipping.orderId,
    country: shipping.country,
    city: shipping.city,
    postalCode: shipping.postalCode,
    address: shipping.address,
    createdAt: shipping.createdAt,
    updatedAt: shipping.updatedAt,
  };
}

export function mapToDiscountDataResponse(discountData: any): any {
  return {
    discountId: discountData.discountId,
    orderId: discountData.orderId,
    appliedTimes: discountData.appliedTimes,
    discountAmount: Number(discountData.discountAmount),
    assignedAt: discountData.assignedAt,
    discount: {
      id: discountData.discount.id,
      code: discountData.discount.code,
      description: discountData.discount.description,
      discountType: discountData.discount.discountType,
      discountValue: Number(discountData.discount.discountValue),
      discountThreshold: Number(discountData.discount.discountThreshold),
      createdAt: discountData.discount.createdAt,
      updatedAt: discountData.discount.updatedAt,
    },
  };
}

export function mapToOrderItemResponse(orderItem: any): OrderItemResponseDto {
  return {
    id: orderItem.id,
    orderId: orderItem.orderId,
    productId: orderItem.productId,
    productSkuId: orderItem.productSkuId,
    quantity: orderItem.quantity,
    price: Number(orderItem.price),
    createdAt: orderItem.createdAt,
    updatedAt: orderItem.updatedAt,
    product: orderItem.product
      ? mapToProductResponseDto(orderItem.product)
      : undefined,
    productSku: orderItem.productSku
      ? {
          id: orderItem.productSku.id,
          productId: orderItem.productSku.productId,
          size: orderItem.productSku.size,
          color: orderItem.productSku.color,
          quantity: orderItem.productSku.quantity,
          createdAt: orderItem.productSku.createdAt,
          updatedAt: orderItem.productSku.updatedAt,
        }
      : undefined,
  };
}

export function mapToOrderResponse(order: any): OrderResponseDto {
  return {
    id: order.id,
    userId: order.userId,
    status: order.status,
    total: order.total.toNumber(),
    discountAmount: order.discountAmount.toNumber(),
    finalTotal: order.finalTotal.toNumber(),
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    orderItems: order.orderItems.map((item: any) =>
      mapToOrderItemResponse(item),
    ),
    payment: order.payment ? mapToPaymentResponse(order.payment) : undefined,
    shipping: order.shipping
      ? mapToShippingResponse(order.shipping)
      : undefined,
    user: undefined,
    discounts:
      order.discounts?.map((d: any) => mapToDiscountDataResponse(d)) || [],
  };
}

export function mapToOrderListResponse(data: any): OrderListResponse {
  return {
    orders: data.orders.map((order: any) => mapToOrderResponse(order)),
    metadata: {
      _count: data.metadata._count,
      _sum: data.metadata._sum
        ? {
            total: data.metadata._sum.total.toNumber(),
            finalTotal: 0,
          }
        : undefined,
    },
  };
}
