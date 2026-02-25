import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Either, left, right } from "@/core/errors/abstractions/either";
import { RecipientsRepository } from "@/domain/logistics/application/repositories/recipients-repository";
import { Injectable } from "@nestjs/common";
import { Notification } from "../../enterprise/entities/notification";
import { NotificationsRepository } from "../repositories/notifications-repository";
import { EmailSender } from "../services/email-sender";
import { RecipientNotFoundError } from "./errors/recipient-not-found-error";

export interface SendNotificationUseCaseRequest {
  recipientId: string;
  title: string;
  content: string;
}

export type SendNotificationUseCaseResponse = Either<
  RecipientNotFoundError,
  {
    notification: Notification;
  }
>;

@Injectable()
export class SendNotificationUseCase {
  constructor(
    private notificationsRepository: NotificationsRepository,
    private recipientsRespository: RecipientsRepository,
    private emailSender: EmailSender
  ) {}

  async execute(request: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const { recipientId, title, content } = request;

    const recipient = await this.recipientsRespository.findById(recipientId);

    if (!recipient) {
      return left(new RecipientNotFoundError("id", recipientId));
    }

    const notification = Notification.create({
      recipientId: new UniqueEntityId(recipientId),
      title,
      content,
    });

    await this.notificationsRepository.create(notification);

    await this.emailSender.send({
      to: recipient.email,
      subject: title,
      body: `<p>${content}</p>`,
    });

    return right({
      notification,
    });
  }
}
