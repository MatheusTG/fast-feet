import { DomainError } from "@/core/errors/abstractions/domain-error";

export class InvalidCpfError extends DomainError {
  constructor(cpf?: string) {
    super(cpf ? `Invalid CPF: "${cpf}".` : "Invalid CPF.");
  }
}
