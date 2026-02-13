import { DomainError } from "@/core/errors/abstractions/domain-error";

export class UserAlreadyExistsError extends DomainError {
  constructor(field: string, value: string) {
    super(`User with ${field} "${value}" already exists.`);
  }
}
