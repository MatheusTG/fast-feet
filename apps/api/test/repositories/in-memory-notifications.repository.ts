import { NotificationsRepository } from "@/domain/events/application/repositories/notifications-repository";
import { Notification } from "@/domain/events/enterprise/entities/notification";

export class InMemoryNotificationsRepository implements NotificationsRepository {
  public items: Notification[] = [];

  async create(notification: Notification) {
    this.items.push(notification);
  }
}
