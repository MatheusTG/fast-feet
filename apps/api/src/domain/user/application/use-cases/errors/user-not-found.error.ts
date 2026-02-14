import { UseCaseError } from "@/core/errors/abstractions/use-case-error";

export class UserNotFoundError extends UseCaseError {
  constructor(field: string, value: string) {
    super(`User with ${field} "${value}" was not found.`);
  }
}
