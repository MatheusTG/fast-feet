import { DomainError } from "@/core/errors/abstractions/domain-error";
import { ForbiddenError } from "@/core/errors/application/forbidden-error";
import { UnauthorizedError } from "@/core/errors/application/unauthorized-error";

/* USER */
import { InvalidCredentialsError } from "@/domain/user/application/use-cases/errors/invalid-credentials-error";
import { NewPasswordMustBeDifferentError } from "@/domain/user/application/use-cases/errors/new-password-must-be-different-error";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found.error";
import { UserAlreadyExistsError } from "@/domain/user/application/use-cases/errors/UserAlreadyExistsError";
import { InvalidCpfError } from "@/domain/user/enterprise/entities/errors/Invalid-cpf-error";

/* RECIPIENT */
import { RecipientNotFoundError } from "@/domain/logistics/application/use-cases/errors/recipient-not-found-error";

/* ORDER */
import { InvalidOrderStatusForAssignmentError } from "@/domain/logistics/application/use-cases/errors/invalid-order-status-for-assignment-error";
import { InvalidOrderStatusForPickupError } from "@/domain/logistics/application/use-cases/errors/invalid-order-status-for-pickup-error";
import { InvalidOrderStatusForWaitingError } from "@/domain/logistics/application/use-cases/errors/invalid-order-status-for-waiting-error";
import { InvalidProofDeliveryPhotoTypeError } from "@/domain/logistics/application/use-cases/errors/invalid-proof-delivery-photo-type-error";
import { NotAllowedDeliverymanError } from "@/domain/logistics/application/use-cases/errors/not-allowed-deliveryman-error";
import { OrderAlreadyHasDeliverymanError } from "@/domain/logistics/application/use-cases/errors/order-already-has-deliveryman-error";
import { OrderNotAssignedToDeliverymanError } from "@/domain/logistics/application/use-cases/errors/order-not-assigned-to-deliveryman-error";
import { OrderNotFoundError } from "@/domain/logistics/application/use-cases/errors/order-not-found-error";

/* ENTITY */
import { InvalidAddressError } from "@/domain/logistics/enterprise/entities/errors/invalid-address-error";

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
      /* USER */
      case UserNotFoundError:
        return new NotFoundException(error.message);

      case UserAlreadyExistsError:
        return new ConflictException(error.message);

      case InvalidCredentialsError:
      case UnauthorizedError:
        return new UnauthorizedException(error.message);

      case ForbiddenError:
        return new ForbiddenException(error.message);

      case InvalidCpfError:
      case NewPasswordMustBeDifferentError:
        return new BadRequestException(error.message);

      /* RECIPIENT */
      case RecipientNotFoundError:
        return new NotFoundException(error.message);

      /* ORDER - not found */
      case OrderNotFoundError:
        return new NotFoundException(error.message);

      /* ORDER - validation */
      case InvalidProofDeliveryPhotoTypeError:
      case InvalidAddressError:
        return new BadRequestException(error.message);

      /* ORDER - authorization (belongs to deliveryman) */
      case NotAllowedDeliverymanError:
        return new ForbiddenException(error.message);

      /* ORDER - state conflicts */
      case InvalidOrderStatusForAssignmentError:
      case InvalidOrderStatusForPickupError:
      case InvalidOrderStatusForWaitingError:
      case OrderAlreadyHasDeliverymanError:
      case OrderNotAssignedToDeliverymanError:
        return new ConflictException(error.message);

      default:
        return new InternalServerErrorException();
    }
  }
}
