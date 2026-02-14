import { Either, left, right } from "@/core/errors/abstractions/either";
import { ForbiddenError } from "@/core/errors/application/forbidden-error";
import { UnauthorizedError } from "@/core/errors/application/unauthorized-error";
import { Injectable } from "@nestjs/common";
import { UserRoleAuthorizationService } from "../../../../core/security/user-role-authorization.service";
import { InvalidCpfError } from "../../enterprise/entities/errors/Invalid-cpf-error";
import { User, UserRole } from "../../enterprise/entities/user";
import { Cpf } from "../../enterprise/entities/value-objects/cpf";
import { HashGenerator } from "../cryptography/hash-generator";
import { UsersRepository } from "../repositories/users-repository";
import { UserAlreadyExistsError } from "./errors/UserAlreadyExistsError";

type RegisterUseCaseRequest = {
  cpf: string;
  name: string;
  password: string;
  role?: UserRole;
  creatorId?: string;
};

type RegisterUseCaseResponse = Either<
  UnauthorizedError | ForbiddenError | InvalidCpfError | UserAlreadyExistsError,
  { user: User }
>;

@Injectable()
export class RegisterUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
    private userRoleAuthorizationService: UserRoleAuthorizationService
  ) {}

  async execute(request: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const { name, cpf: uncheckedCpf, password, role, creatorId } = request;

    if (role === "ADMIN") {
      const authorization = await this.userRoleAuthorizationService.ensureUserHasRole(
        creatorId,
        role
      );

      if (authorization.isLeft()) {
        return left(authorization.value);
      }
    }

    const cpfOrError = Cpf.create(uncheckedCpf);

    if (cpfOrError.isLeft()) {
      return left(cpfOrError.value);
    }

    const cpf = cpfOrError.value;

    const userWithSameCpf = await this.usersRepository.findByCpf(cpf.value);

    if (userWithSameCpf) {
      return left(new UserAlreadyExistsError("cpf", cpf.value));
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const user = User.create({
      name,
      cpf,
      password: hashedPassword,
      role: role ?? "DELIVERYMAN",
    });

    await this.usersRepository.create(user);

    return right({
      user,
    });
  }
}
