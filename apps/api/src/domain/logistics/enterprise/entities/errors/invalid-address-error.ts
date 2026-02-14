import { DomainError } from "@/core/errors/abstractions/domain-error";

export class InvalidAddressError extends DomainError {
  constructor(message?: string) {
    super(message ? `Invalid address: ${message}` : "Invalid address.");
  }
}
