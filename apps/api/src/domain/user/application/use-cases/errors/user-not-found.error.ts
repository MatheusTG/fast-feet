import { DomainError } from "../../../../../core/errors/abstractions/domain-error";

export class UserNotFoundError extends DomainError {
  constructor(field: string, value: string) {
    super(`User with ${field} "${value}" was not found.`);
  }
}
