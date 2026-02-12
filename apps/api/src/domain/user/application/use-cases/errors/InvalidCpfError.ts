import { UseCaseError } from "@/core/errors/abstractions/use-case-error";

export class InvalidCpfError extends UseCaseError {
  constructor(cpf: string) {
    super({
      message: `Invalid CPF: ${cpf}`,
      statusCode: 400,
      code: "INVALID_CPF",
    });
  }
}
