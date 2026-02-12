import { UseCaseError } from "@/core/errors/abstractions/use-case-error";

export class UnauthorizedError extends UseCaseError {
  constructor(message = "Unauthorized: Invalid or expired token.") {
    super({
      message: message,
      statusCode: 401,
      code: "INVALID_TOKEN",
    });
  }
}
