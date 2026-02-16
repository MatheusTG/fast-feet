import {
  RecipientFilters,
  RecipientsRepository,
} from "@/domain/logistics/application/repositories/recipients-repository";
import { Recipient } from "@/domain/logistics/enterprise/entities/recipient";

export class InMemoryRecipientsRepository implements RecipientsRepository {
  items: Recipient[] = [];

  async create(recipient: Recipient): Promise<void> {
    this.items.push(recipient);
  }

  async findMany(filters: RecipientFilters, params: { page: number }): Promise<Recipient[]> {
    const pageSize = 20;

    const recipients = this.items
      .filter((recipient) => {
        if (filters.name && !recipient.name.toLowerCase().includes(filters.name.toLowerCase())) {
          return false;
        }

        if (filters.email && !recipient.email.toLowerCase().includes(filters.email.toLowerCase())) {
          return false;
        }

        if (filters.phone && !recipient.phone.includes(filters.phone)) {
          return false;
        }

        if (filters.city && recipient.address.city.toLowerCase() !== filters.city.toLowerCase()) {
          return false;
        }

        if (filters.state && recipient.address.state !== filters.state) {
          return false;
        }

        if (
          filters.isProblematic !== undefined &&
          recipient.isProblematic !== filters.isProblematic
        ) {
          return false;
        }

        if (filters.createdAfter && recipient.createdAt < filters.createdAfter) {
          return false;
        }

        if (filters.createdBefore && recipient.createdAt > filters.createdBefore) {
          return false;
        }

        return true;
      })
      .slice((params.page - 1) * pageSize, params.page * pageSize);

    return recipients;
  }
}
