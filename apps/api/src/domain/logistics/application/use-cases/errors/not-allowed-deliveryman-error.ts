import { UseCaseError } from "@/core/errors/abstractions/use-case-error";

export class NotAllowedDeliverymanError extends UseCaseError {
  constructor(actorId: string) {
    super(`User "${actorId}" is not the assigned deliveryman for order"`);
  }
}
