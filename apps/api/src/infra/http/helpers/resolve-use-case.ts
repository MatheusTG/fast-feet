import { DomainError } from "@/core/errors/abstractions/domain-error";
import { Either } from "@/core/errors/abstractions/either";
import { DomainErrorHttpMapper } from "../errors/domain-error-http-mapper";

export function resolveUseCase<T>(result: Either<DomainError, T>): T {
  if (result.isLeft()) {
    throw DomainErrorHttpMapper.toHttp(result.value);
  }

  return result.value;
}
