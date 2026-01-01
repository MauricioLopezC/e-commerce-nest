import { AppliedDiscount } from 'src/promotions/discounts/types/discount-types';

export class OrderCreatedEvent {
  orderId: number;
  userId: number;
  appliedDiscounts: AppliedDiscount[];
}
