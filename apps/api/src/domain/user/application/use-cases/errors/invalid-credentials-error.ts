import { DomainError } from "@/core/errors/abstractions/domain-error";

export class InvalidCredentialsError extends DomainError {
  constructor(message = "Invalid credentials.") {
    super(message);
  }
}
