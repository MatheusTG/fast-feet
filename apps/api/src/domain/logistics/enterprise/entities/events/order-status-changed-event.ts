import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { DomainEvent } from "@/core/events/domain-event";
import { OrderStatus } from "@/generated/prisma/enums";
import { Order } from "../order";

export class OrderStatusChangedEvent implements DomainEvent {
  public ocurredAt: Date;
  public order: Order;
  public status: OrderStatus;

  constructor(order: Order, status: OrderStatus) {
    this.order = order;
    this.status = status;
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityId {
    return this.order.id;
  }
}
