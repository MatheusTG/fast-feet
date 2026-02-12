import { UseCaseError } from "@/core/errors/abstractions/use-case-error";

export class UserAlreadyExistsError extends UseCaseError {
  constructor(identifier: string) {
    super({
      message: `Conflict: user ${identifier} already exists.`,
      statusCode: 409,
      code: "USER_ALREADY_EXISTS",
    });
  }
}
