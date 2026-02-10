import { Either, left, right } from "@/core/errors/either";
import { UserRole } from "@/generated/prisma/enums";
import { Injectable } from "@nestjs/common";
import { User } from "../../enterprise/entities/user";
import { Cpf } from "../../enterprise/entities/value-objects/cpf";
import { HashGenerator } from "../cryptography/hash-generator";
import { UsersRepository } from "../repositories/users-repository";
import { InvalidCpfError } from "./errors/InvalidCpfError";
import { UserAlreadyExistsError } from "./errors/UserAlreadyExistsError";

type RegisterUseCaseRequest = {
  cpf: string;
  name: string;
  password: string;
  role?: UserRole;
};

type RegisterUseCaseResponse = Either<UserAlreadyExistsError, { user: User }>;

@Injectable()
export class RegisterUseCase {
  constructor(
    private userRepository: UsersRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute(request: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const { name, cpf: uncheckedCpf, password } = request;

    const cpf = Cpf.create(uncheckedCpf);

    if (!cpf) {
      return left(new InvalidCpfError(uncheckedCpf));
    }

    const userWithSameCpf = await this.userRepository.findByCpf(cpf.value);

    if (userWithSameCpf) {
      return left(new UserAlreadyExistsError(cpf.value));
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const user = User.create({
      name,
      cpf,
      password: hashedPassword,
    });

    this.userRepository.create(user);

    return right({
      user,
    });
  }
}
