import { UseCaseError } from "@/core/errors/abstractions/use-case-error";

export class OrderNotFoundError extends UseCaseError {
  constructor(field: string, value: string) {
    super(`Order with ${field} "${value}" was not found.`);
  }
}
