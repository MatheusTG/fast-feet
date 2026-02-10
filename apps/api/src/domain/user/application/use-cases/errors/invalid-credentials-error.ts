import { UseCaseError } from "@/core/errors/use-case-error";

export class InvalidCredentialsError extends UseCaseError {
  constructor() {
    super({
      message: "Invalid credentials.",
      statusCode: 401,
      code: "INVALID_CREDENTIALS",
    });
  }
}
