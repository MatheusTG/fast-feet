import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { OrderStatusChangedEvent } from "@/domain/logistics/enterprise/entities/events/order-status-changed-event";
import { SendNotificationUseCase } from "../use-cases/send-notification";

export class OnOrderStatusChanged implements EventHandler {
  constructor(private sendNotification: SendNotificationUseCase) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendOrderStatusChangedNotification.bind(this),
      OrderStatusChangedEvent.name
    );
  }

  private async sendOrderStatusChangedNotification({ order }: OrderStatusChangedEvent) {
    await this.sendNotification.execute({
      recipientId: order.recipientId.toString(),
      title: `Your order status was changed to ${order.status}`,
      content: order.notes ?? "",
    });
  }
}
