import { UseCaseError } from "@/core/errors/use-case-error";

export class ForbiddenError extends UseCaseError {
  constructor(message = "Forbidden.") {
    super({
      message,
      statusCode: 403,
      code: "FORBIDDEN",
    });
  }
}
