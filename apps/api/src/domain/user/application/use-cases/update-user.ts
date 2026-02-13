import { Either, left, right } from "@/core/errors/abstractions/either";
import { ForbiddenError } from "@/core/errors/application/Forbidden-error";
import { ResourceNotFoundError } from "@/core/errors/application/resource-not-found.error";
import { UnauthorizedError } from "@/core/errors/application/unauthorized-error";
import { Injectable } from "@nestjs/common";
import { User } from "../../enterprise/entities/user";
import { Cpf } from "../../enterprise/entities/value-objects/cpf";
import { UsersRepository } from "../repositories/users-repository";
import { UserRoleAuthorizationService } from "../services/user-role-authorization.service";

type UpdateUserUseCaseRequest = {
  actorId: string | undefined;
  targetUserId: string;
  cpf?: string;
  name?: string;
};

type UpdateUserUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError | ForbiddenError,
  { user: User }
>;

@Injectable()
export class UpdateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private userRoleAuthorizationService: UserRoleAuthorizationService
  ) {}

  async execute(request: UpdateUserUseCaseRequest): Promise<UpdateUserUseCaseResponse> {
    const { actorId, targetUserId, name, cpf: uncheckedCpf } = request;

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

    if (uncheckedCpf) {
      const cpfOrError = Cpf.create(uncheckedCpf);

      if (cpfOrError.isLeft()) {
        return left(cpfOrError.value);
      }

      user.cpf = cpfOrError.value;
    }

    if (name) {
      user.name = name;
    }

    await this.usersRepository.update(user);

    return right({
      user,
    });
  }
}
