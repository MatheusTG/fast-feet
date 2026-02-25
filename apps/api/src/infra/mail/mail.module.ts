import { EmailSender } from "@/domain/notification/application/services/email-sender";
import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { EnvModule } from "../env/env.module";
import { NodemailerEmailSender } from "./nodemailer-email-sender";

@Module({
  imports: [EnvModule, DatabaseModule],
  providers: [
    {
      provide: EmailSender,
      useClass: NodemailerEmailSender,
    },
  ],
  exports: [EmailSender],
})
export class MailModule {}
