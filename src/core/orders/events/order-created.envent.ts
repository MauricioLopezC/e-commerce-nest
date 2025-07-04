import { AppliedDiscount } from "src/core/promotions/discounts/types/discount-types"

export class OrderCreatedEvent {
  orderId: number
  appliedDiscounts: AppliedDiscount[]
}
