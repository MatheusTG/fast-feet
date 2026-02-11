import { Either } from "@/core/errors/either";
import { UseCaseError } from "@/core/errors/use-case-error";

/**
 * Ensures a Use Case returned a successful (Right) result.
 *
 * This helper is intended for tests where no error is expected.
 * If the use case does not return a Right result,
 * the test fails with a descriptive message.
 *
 * It is useful for catching unexpected UseCaseError results
 * that are not part of the scenario being tested.
 */
export function expectRight<T>(result: Either<UseCaseError, T>, useCaseName: string): T {
  if (!result.isRight()) {
    throw new Error(`Expected ${useCaseName} to succeed, but failed with: ${result.value.message}`);
  }

  return result.value;
}
