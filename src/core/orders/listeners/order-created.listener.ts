import { OnEvent } from "@nestjs/event-emitter";
import { OrderCreatedEvent } from "../events/order-created.envent";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OrderCreatedListener {
  @OnEvent('order.created')
  handleOrderCreatedEvent(event: OrderCreatedEvent) {
    console.log(event.orderId)
  }
}
