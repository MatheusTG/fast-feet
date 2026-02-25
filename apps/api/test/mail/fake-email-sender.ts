import { EmailPayload, EmailSender } from "@/domain/notification/application/services/email-sender";

export class FakeEmailSender implements EmailSender {
  public sentEmails: EmailPayload[] = [];

  async send(message: EmailPayload): Promise<void> {
    this.sentEmails.push(message);
  }
}
