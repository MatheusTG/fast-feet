import { Either, left, right } from "@/core/errors/abstractions/either";
import { ForbiddenError } from "@/core/errors/application/forbidden-error";
import { UnauthorizedError } from "@/core/errors/application/unauthorized-error";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found.error";
import { Injectable } from "@nestjs/common";
import { UserRoleAuthorizationService } from "../../../../core/security/user-role-authorization.service";
import { User, UserRole } from "../../enterprise/entities/user";
import { UsersRepository } from "../repositories/users-repository";

type ChangeUserRoleUseCaseRequest = {
  actorId: string | undefined;
  targetUserId: string;
  newRole: UserRole;
};

type ChangeUserRoleUseCaseResponse = Either<
  UnauthorizedError | ForbiddenError | UserNotFoundError,
  { user: User }
>;

@Injectable()
export class ChangeUserRoleUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private userRoleAuthorizationService: UserRoleAuthorizationService
  ) {}

  async execute(request: ChangeUserRoleUseCaseRequest): Promise<ChangeUserRoleUseCaseResponse> {
    const { actorId, targetUserId, newRole } = request;

    const authorization = await this.userRoleAuthorizationService.ensureUserHasRole(
      actorId,
      "ADMIN"
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const user = await this.usersRepository.findById(targetUserId);

    if (!user) {
      return left(new UserNotFoundError("id", targetUserId));
    }

    user.role = newRole;

    await this.usersRepository.update(user);

    return right({
      user,
    });
  }
}
