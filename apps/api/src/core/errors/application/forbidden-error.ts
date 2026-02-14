import { DomainError } from "@/core/errors/abstractions/domain-error";

export class ForbiddenError extends DomainError {
  constructor(reason = "insufficient permissions") {
    super(`Forbidden: ${reason}`);
  }
}
