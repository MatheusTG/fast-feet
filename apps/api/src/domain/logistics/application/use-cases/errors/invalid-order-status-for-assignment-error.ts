import { UseCaseError } from "@/core/errors/abstractions/use-case-error";

export class InvalidOrderStatusForAssignmentError extends UseCaseError {
  constructor(status: string) {
    super(`Cannot assign deliveryman to order with status "${status}".`);
  }
}
