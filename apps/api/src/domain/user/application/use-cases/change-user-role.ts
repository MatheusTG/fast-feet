import { Either, left, right } from "@/core/errors/abstractions/either";
import { ForbiddenError } from "@/core/errors/application/Forbidden-error";
import { ResourceNotFoundError } from "@/core/errors/application/resource-not-found.error";
import { UnauthorizedError } from "@/core/errors/application/unauthorized-error";
import { Injectable } from "@nestjs/common";
import { User, UserRole } from "../../enterprise/entities/user";
import { UsersRepository } from "../repositories/users-repository";
import { UserRoleAuthorizationService } from "../services/user-role-authorization.service";

type ChangeUserRoleUseCaseRequest = {
  actorId: string | undefined;
  targetUserId: string;
  newRole: UserRole;
};

type ChangeUserRoleUseCaseResponse = Either<
  UnauthorizedError | ForbiddenError | ResourceNotFoundError,
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
      return left(new ResourceNotFoundError());
    }

    user.role = newRole;

    await this.usersRepository.update(user);

    return right({
      user,
    });
  }
}
