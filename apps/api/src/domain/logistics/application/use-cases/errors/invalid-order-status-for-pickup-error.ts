import { UseCaseError } from "@/core/errors/abstractions/use-case-error";

export class InvalidOrderStatusForPickupError extends UseCaseError {
  constructor(currentStatus: string) {
    super(`Order cannot be picked up because its current status is '${currentStatus}'.`);
  }
}
