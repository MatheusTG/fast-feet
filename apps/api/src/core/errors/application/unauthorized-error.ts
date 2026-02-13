import { DomainError } from "../abstractions/domain-error";

export class UnauthorizedError extends DomainError {
  constructor(reason: string = "authentication required") {
    super(`Unauthorized: ${reason}.`);
  }
}
