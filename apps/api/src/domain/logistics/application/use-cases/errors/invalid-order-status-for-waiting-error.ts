import { UseCaseError } from "@/core/errors/abstractions/use-case-error";

export class InvalidOrderStatusForWaitingError extends UseCaseError {
  constructor(status: string) {
    super(`Cannot mark order as AVAILABLE_FOR_PICKUP when status is ${status}`);
  }
}
