import { UseCaseError } from "@/core/errors/abstractions/use-case-error";

export class InvalidCredentialsError extends UseCaseError {
  constructor(message = "Invalid credentials.") {
    super(message);
  }
}
