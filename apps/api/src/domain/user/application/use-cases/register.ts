import { Either, left, right } from "@/core/errors/either";
import { UserRole } from "@/generated/prisma/enums";
import { Injectable } from "@nestjs/common";
import { User } from "../../enterprise/entities/user";
import { Cpf } from "../../enterprise/entities/value-objects/cpf";
import { HashGenerator } from "../cryptography/hash-generator";
import { UsersRepository } from "../repositories/users-repository";
import { UserRoleAuthorizationService } from "../services/user-role-authorization.service";
import { ForbiddenError } from "./errors/Forbidden-error";
import { InvalidCpfError } from "./errors/InvalidCpfError";
import { UserAlreadyExistsError } from "./errors/UserAlreadyExistsError";
import { UnauthorizedError } from "./errors/unauthorized-error";

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
    private userRepository: UsersRepository,
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

    const userWithSameCpf = await this.userRepository.findByCpf(cpf.value);

    if (userWithSameCpf) {
      return left(new UserAlreadyExistsError(cpf.value));
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const user = User.create({
      name,
      cpf,
      password: hashedPassword,
      role: role ?? "DELIVERYMAN",
    });

    await this.userRepository.create(user);

    return right({
      user,
    });
  }
}
