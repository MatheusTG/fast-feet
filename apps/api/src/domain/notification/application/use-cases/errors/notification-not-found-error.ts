import { UseCaseError } from "@/core/errors/abstractions/use-case-error";

export class NotificationNotFoundError extends UseCaseError {
  constructor(field: string, value: string) {
    super(`Notification with ${field} "${value}" was not found.`);
  }
}
