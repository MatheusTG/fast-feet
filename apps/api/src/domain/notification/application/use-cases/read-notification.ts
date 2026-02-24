import { Either, left, right } from "@/core/errors/abstractions/either";
import { Injectable } from "@nestjs/common";
import { Notification } from "../../enterprise/entities/notification";
import { NotificationsRepository } from "../repositories/notifications-repository";
import { NotificationNotFoundError } from "./errors/notification-not-found-error";
import { ForbiddenError } from "@/core/errors/application/forbidden-error";

interface ReadNotificationUseCaseRequest {
  recipientId: string;
  notificationId: string;
}

type ReadNotificationUseCaseResponse = Either<
  NotificationNotFoundError | Error,
  {
    notification: Notification;
  }
>;

@Injectable()
export class ReadNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute(request: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const { recipientId, notificationId } = request;

    const notification = await this.notificationsRepository.findById(notificationId);

    if (!notification) {
      return left(new NotificationNotFoundError("id", notificationId));
    }

    if (recipientId !== notification.recipientId.toString()) {
      return left(new ForbiddenError());
    }

    notification.read();

    await this.notificationsRepository.save(notification);

    return right({
      notification,
    });
  }
}
