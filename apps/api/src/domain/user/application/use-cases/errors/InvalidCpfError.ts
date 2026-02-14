import { UseCaseError } from "@/core/errors/abstractions/use-case-error";

export class InvalidCpfError extends UseCaseError {
  constructor(cpf?: string) {
    super(cpf ? `Invalid CPF: "${cpf}".` : "Invalid CPF.");
  }
}
