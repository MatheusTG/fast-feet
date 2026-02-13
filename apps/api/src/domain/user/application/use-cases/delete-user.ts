import { Either, left, right } from "@/core/errors/abstractions/either";
import { ForbiddenError } from "@/core/errors/application/Forbidden-error";
import { ResourceNotFoundError } from "@/core/errors/application/resource-not-found.error";
import { UnauthorizedError } from "@/core/errors/application/unauthorized-error";
import { Injectable } from "@nestjs/common";
import { UsersRepository } from "../repositories/users-repository";
import { UserRoleAuthorizationService } from "../services/user-role-authorization.service";

type DeleteUserUseCaseRequest = {
  actorId: string | undefined;
  targetUserId: string;
};

type DeleteUserUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError | ForbiddenError,
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
      return left(new ResourceNotFoundError());
    }

    await this.usersRepository.delete(user);

    return right(null);
  }
}
