import { UseCaseError } from "../abstractions/use-case-error";

export class ResourceNotFoundError extends UseCaseError {
  constructor(message = "Resource not found.") {
    super({
      message: message,
      statusCode: 404,
      code: "RESOURCE_NOT_FOUND",
    });
  }
}
