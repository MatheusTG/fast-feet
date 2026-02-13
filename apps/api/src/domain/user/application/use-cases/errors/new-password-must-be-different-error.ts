import { UseCaseError } from "@/core/errors/abstractions/use-case-error";

export class NewPasswordMustBeDifferentError extends UseCaseError {
  constructor(message = "The new password must be different from the current password.") {
    super({
      message,
      statusCode: 422,
      code: "NEW_PASSWORD_MUST_BE_DIFFERENT",
    });
  }
}
