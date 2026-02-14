import { Either, left, right } from "@/core/errors/abstractions/either";
import { ForbiddenError } from "@/core/errors/application/forbidden-error";
import { UnauthorizedError } from "@/core/errors/application/unauthorized-error";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found.error";
import { Injectable } from "@nestjs/common";
import { UserRoleAuthorizationService } from "../../../../core/security/user-role-authorization.service";
import { User } from "../../enterprise/entities/user";
import { HashComparer } from "../cryptography/hash-comparer";
import { HashGenerator } from "../cryptography/hash-generator";
import { UsersRepository } from "../repositories/users-repository";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { NewPasswordMustBeDifferentError } from "./errors/new-password-must-be-different-error";

type ChangeUserPasswordUseCaseRequest = {
  actorId: string | undefined;
  targetUserId: string;
  currentPassword: string;
  newPassword: string;
};

type ChangeUserPasswordUseCaseResponse = Either<
  | NewPasswordMustBeDifferentError
  | UserNotFoundError
  | InvalidCredentialsError
  | UnauthorizedError
  | ForbiddenError,
  { user: User }
>;

@Injectable()
export class ChangeUserPasswordUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private userRoleAuthorizationService: UserRoleAuthorizationService,
    private hashGenerator: HashGenerator,
    private hashComparer: HashComparer
  ) {}

  async execute(
    request: ChangeUserPasswordUseCaseRequest
  ): Promise<ChangeUserPasswordUseCaseResponse> {
    const { actorId, targetUserId, currentPassword, newPassword } = request;

    if (actorId !== targetUserId) {
      const authorization = await this.userRoleAuthorizationService.ensureUserHasRole(
        actorId,
        "ADMIN"
      );

      if (authorization.isLeft()) {
        return left(authorization.value);
      }
    }

    if (currentPassword === newPassword) {
      return left(new NewPasswordMustBeDifferentError());
    }

    const user = await this.usersRepository.findById(targetUserId);

    if (!user) {
      return left(new UserNotFoundError("id", targetUserId));
    }

    const isPasswordValid = await this.hashComparer.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return left(new InvalidCredentialsError("Current password is incorrect."));
    }

    user.password = await this.hashGenerator.hash(newPassword);

    await this.usersRepository.update(user);

    return right({
      user,
    });
  }
}
