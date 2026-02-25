import { OnOrderStatusChanged } from "@/domain/notification/application/subscribers/on-order-status-changed";
import { SendNotificationUseCase } from "@/domain/notification/application/use-cases/send-notification";
import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { MailModule } from "../mail/mail.module";

@Module({
  imports: [DatabaseModule, MailModule],
  providers: [OnOrderStatusChanged, SendNotificationUseCase],
})
export class EventsModule {}
