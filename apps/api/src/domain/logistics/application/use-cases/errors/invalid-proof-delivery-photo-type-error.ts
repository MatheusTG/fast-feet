import { UseCaseError } from "@/core/errors/abstractions/use-case-error";

export class InvalidProofDeliveryPhotoTypeError extends UseCaseError {
  constructor(type: string) {
    super(`File type "${type}" is not valid.`);
  }
}
