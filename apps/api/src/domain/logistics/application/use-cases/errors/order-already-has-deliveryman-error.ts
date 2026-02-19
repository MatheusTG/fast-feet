import { UseCaseError } from "@/core/errors/abstractions/use-case-error";

export class OrderAlreadyHasDeliverymanError extends UseCaseError {
  constructor() {
    super("Order already has a deliveryman assigned.");
  }
}
