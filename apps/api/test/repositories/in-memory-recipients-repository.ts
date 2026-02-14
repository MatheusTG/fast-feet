import { RecipientsRepository } from "@/domain/logistics/application/repositories/recipients-repository";
import { Recipient } from "@/domain/logistics/enterprise/entities/recipient";

export class InMemoryRecipientsRepository implements RecipientsRepository {
  items: Recipient[] = [];

  async create(recipient: Recipient): Promise<void> {
    this.items.push(recipient);
  }
}
