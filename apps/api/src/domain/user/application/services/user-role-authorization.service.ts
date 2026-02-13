import { Either, left, right } from "@/core/errors/abstractions/either";
import { ForbiddenError } from "@/core/errors/application/forbidden-error";
import { UnauthorizedError } from "@/core/errors/application/unauthorized-error";
import { UserRole } from "@/generated/prisma/enums";
import { Injectable } from "@nestjs/common";
import { UsersRepository } from "../repositories/users-repository";

type AuthorizationError = UnauthorizedError | ForbiddenError;

type AuthorizationResponse = Either<AuthorizationError, null>;

@Injectable()
export class UserRoleAuthorizationService {
  constructor(private usersRepository: UsersRepository) {}

  async ensureUserHasRole(
    actorId: string | undefined,
    requiredRole: UserRole
  ): Promise<AuthorizationResponse> {
    if (!actorId) {
      return left(new UnauthorizedError());
    }

    const user = await this.usersRepository.findById(actorId);

    if (!user) {
      return left(new UnauthorizedError());
    }

    if (user.role !== requiredRole) {
      return left(new ForbiddenError());
    }

    return right(null);
  }
}
