import { DomainError } from "@/core/errors/abstractions/domain-error";

export class ForbiddenError extends DomainError {
  constructor(message = "Forbidden.") {
    super(message);
  }
}
