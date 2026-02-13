import { DomainError } from "@/core/errors/abstractions/domain-error";

export class NewPasswordMustBeDifferentError extends DomainError {
  constructor() {
    super("New password must be different from the current password.");
  }
}
