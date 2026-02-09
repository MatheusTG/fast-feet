import { BadRequestException, PipeTransform } from "@nestjs/common";
import { ZodError, ZodType } from "zod";
import { fromZodError } from "zod-validation-error";

export class ZodValidationsPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: "Validation failed",
          statusCode: 400,
          error: fromZodError(error),
        });
      }

      throw new BadRequestException("validation failed");
    }
  }
}
