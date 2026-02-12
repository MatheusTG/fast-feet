import { Either, left, right } from "@/core/errors/either";
import { UserRole } from "@/generated/prisma/enums";
import { Injectable } from "@nestjs/common";
import { UsersRepository } from "../repositories/users-repository";
import { ForbiddenError } from "../use-cases/errors/Forbidden-error";
import { UnauthorizedError } from "../use-cases/errors/unauthorized-error";

type AuthorizationError = UnauthorizedError | ForbiddenError;

type AuthorizationResponse = Either<AuthorizationError, null>;

@Injectable()
export class UserRoleAuthorizationService {
  constructor(private usersRepository: UsersRepository) {}

  async ensureUserHasRole(
    userId: string | undefined,
    requiredRole: UserRole
  ): Promise<AuthorizationResponse> {
    if (!userId) {
      return left(new UnauthorizedError());
    }

    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return left(new UnauthorizedError());
    }

    if (user.role !== requiredRole) {
      return left(new ForbiddenError());
    }

    return right(null);
  }
}
