import { UseCaseError } from "@/core/errors/abstractions/use-case-error";

export class OrderNotAssignedToDeliverymanError extends UseCaseError {
  constructor() {
    super("You cannot pick up this order because it is not assigned to you.");
  }
}
