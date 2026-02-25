import { EmailPayload, EmailSender } from "@/domain/notification/application/services/email-sender";
import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { EnvService } from "../env/env.service";

@Injectable()
export class NodemailerEmailSender implements EmailSender {
  private transporter: nodemailer.Transporter;

  constructor(private envService: EnvService) {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      host: envService.get("EMAIL_HOST"),
      port: envService.get("EMAIL_PORT"),
      secure: envService.get("EMAIL_SECURE"),
      auth: {
        user: envService.get("EMAIL_USER"),
        pass: envService.get("EMAIL_PASS"),
      },
    });
  }

  async send(message: EmailPayload): Promise<void> {
    const { to, subject, body } = message;
    await this.transporter.sendMail({
      from: `"System" <${this.envService.get("EMAIL_USER")}>`,
      to,
      subject,
      html: body,
    });
  }
}
