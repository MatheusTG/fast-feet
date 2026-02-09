import { Either, left, right } from "@/core/errors/either";
import { User, UserProps } from "../../enterprise/entities/user";
import { HashGenerator } from "../cryptography/hash-generator";
import { UserRepository } from "../repositories/user-repository";
import { UserAlreadyExistsError } from "./errors/UserAlreadyExistsError";

type RegisterUseCaseRequest = Omit<UserProps, "role">;

type RegisterUseCaseResponse = Either<UserAlreadyExistsError, { user: User }>;

export class RegisterUseCase {
  constructor(
    private userRepository: UserRepository,
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
