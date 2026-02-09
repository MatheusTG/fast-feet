import { Either, left, right } from "@/core/errors/either";
import { Optional } from "@/core/types/optional";
import { Injectable } from "@nestjs/common";
import { User, UserProps } from "../../enterprise/entities/user";
import { HashGenerator } from "../cryptography/hash-generator";
import { UsersRepository } from "../repositories/users-repository";
import { UserAlreadyExistsError } from "./errors/UserAlreadyExistsError";

type RegisterUseCaseRequest = Optional<UserProps, "role" | "createdAt">;

type RegisterUseCaseResponse = Either<UserAlreadyExistsError, { user: User }>;

@Injectable()
export class RegisterUseCase {
  constructor(
    private userRepository: UsersRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute(request: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const { name, cpf, password } = request;

    const userWithSameCpf = await this.userRepository.findByCpf(cpf);

    if (userWithSameCpf) {
      return left(new UserAlreadyExistsError(cpf));
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
