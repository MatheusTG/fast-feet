import { Either, left, right } from "@/core/errors/abstractions/either";
import { ForbiddenError } from "@/core/errors/application/forbidden-error";
import { UnauthorizedError } from "@/core/errors/application/unauthorized-error";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found.error";
import { Injectable } from "@nestjs/common";
import { UserRoleAuthorizationService } from "../../../../core/security/user-role-authorization.service";
import { UsersRepository } from "../repositories/users-repository";

type DeleteUserUseCaseRequest = {
  actorId: string | undefined;
  targetUserId: string;
};

type DeleteUserUseCaseResponse = Either<
  UserNotFoundError | UnauthorizedError | ForbiddenError,
  null
>;

@Injectable()
export class DeleteUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private userRoleAuthorizationService: UserRoleAuthorizationService
  ) {}

  async execute(request: DeleteUserUseCaseRequest): Promise<DeleteUserUseCaseResponse> {
    const { actorId, targetUserId } = request;

    if (actorId !== targetUserId) {
      const authorization = await this.userRoleAuthorizationService.ensureUserHasRole(
        actorId,
        "ADMIN"
      );

      if (authorization.isLeft()) {
        return left(authorization.value);
      }
    }

    const user = await this.usersRepository.findById(targetUserId);

    if (!user) {
      return left(new UserNotFoundError("id", targetUserId));
    }

    await this.usersRepository.delete(user);

    return right(null);
  }
}
