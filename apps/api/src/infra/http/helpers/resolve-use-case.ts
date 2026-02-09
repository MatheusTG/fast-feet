import { Either } from "@/core/errors/either";
import { UseCaseError } from "@/core/errors/use-case-error";
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
