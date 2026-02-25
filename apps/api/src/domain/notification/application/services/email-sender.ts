export interface EmailPayload {
  to: string;
  subject: string;
  body: string;
}

export abstract class EmailSender {
  abstract send(params: EmailPayload): Promise<void>;
}
