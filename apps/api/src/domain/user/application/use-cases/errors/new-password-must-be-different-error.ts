import { UseCaseError } from "@/core/errors/abstractions/use-case-error";

export class NewPasswordMustBeDifferentError extends UseCaseError {
  constructor() {
    super("New password must be different from the current password.");
  }
}
