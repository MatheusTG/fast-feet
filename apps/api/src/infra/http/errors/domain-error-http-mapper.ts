import { DomainError } from "@/core/errors/abstractions/domain-error";
import { ForbiddenError } from "@/core/errors/application/forbidden-error";
import { UnauthorizedError } from "@/core/errors/application/unauthorized-error";
import { InvalidCredentialsError } from "@/domain/user/application/use-cases/errors/invalid-credentials-error";
import { NewPasswordMustBeDifferentError } from "@/domain/user/application/use-cases/errors/new-password-must-be-different-error";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found.error";
import { UserAlreadyExistsError } from "@/domain/user/application/use-cases/errors/UserAlreadyExistsError";
import { InvalidCpfError } from "@/domain/user/enterprise/entities/errors/Invalid-cpf-error";

import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";

export class DomainErrorHttpMapper {
  static toHttp(error: DomainError) {
    switch (error.constructor) {
      case UserNotFoundError:
        return new NotFoundException(error.message);

      case UserAlreadyExistsError:
        return new ConflictException(error.message);

      case InvalidCredentialsError:
        return new UnauthorizedException(error.message);

      case UnauthorizedError:
        return new UnauthorizedException(error.message);

      case ForbiddenError:
        return new ForbiddenException(error.message);

      case InvalidCpfError:
        return new BadRequestException(error.message);

      case NewPasswordMustBeDifferentError:
        return new BadRequestException(error.message);

      default:
        return new InternalServerErrorException();
    }
  }
}
