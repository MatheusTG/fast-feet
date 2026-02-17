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
  abstract findById(id: string): Promise<Recipient | null>;
  abstract findMany(filters: RecipientFilters, params: { page: number }): Promise<Recipient[]>;
  abstract create(recipient: Recipient): Promise<void>;
  abstract update(recipient: Recipient): Promise<void>;
  abstract delete(recipient: Recipient): Promise<void>;
}
