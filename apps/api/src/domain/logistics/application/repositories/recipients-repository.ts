import { Recipient } from "../../enterprise/entities/recipient";

export interface RecipientFilters {
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  state?: string;
  isProblematic?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
}

export abstract class RecipientsRepository {
  abstract create(recipient: Recipient): Promise<void>;
  abstract findMany(filters: RecipientFilters, params: { page: number }): Promise<Recipient[]>;
}
