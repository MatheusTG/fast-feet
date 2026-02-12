import { Either } from "@/core/errors/abstractions/either";
import { UseCaseError } from "@/core/errors/abstractions/use-case-error";
import { HttpException } from "@nestjs/common";

export function resolveUseCase<T>(result: Either<UseCaseError, T>): T {
  if (result.isLeft()) {
    const error = result.value;

    throw new HttpException(
      {
        message: error.message,
        code: error.code,
      },
      error.statusCode
    );
  }

  return result.value;
}
