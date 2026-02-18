import { UseCaseError } from "@/core/errors/abstractions/use-case-error";

export class RecipientNotFoundError extends UseCaseError {
  constructor(field: string, value: string) {
    super(`Recipient with ${field} "${value}" was not found.`);
  }
}
