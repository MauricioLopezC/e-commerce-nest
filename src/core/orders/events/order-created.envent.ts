import { AppliedDiscount } from "src/core/promotions/discounts/types/discount-types"

export class OrderCreatedEvent {
  orderId: number
  userId: number
  appliedDiscounts: AppliedDiscount[]
}
