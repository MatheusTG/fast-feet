import { UseCaseError } from "@/core/errors/abstractions/use-case-error";

export class UserAlreadyExistsError extends UseCaseError {
  constructor(field: string, value: string) {
    super(`User with ${field} "${value}" already exists.`);
  }
}
