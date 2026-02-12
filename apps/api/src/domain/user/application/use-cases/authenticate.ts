import { Either, left, right } from "@/core/errors/abstractions/either";
import { Injectable } from "@nestjs/common";
import { Encrypter } from "../cryptography/encrypter";
import { HashComparer } from "../cryptography/hash-comparer";
import { UsersRepository } from "../repositories/users-repository";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

type AuthenticateUseCaseRequest = {
  cpf: string;
  password: string;
};

type AuthenticateUseCaseResponse = Either<InvalidCredentialsError, { accessToken: string }>;

@Injectable()
export class AuthenticateUseCase {
  constructor(
    private userRepository: UsersRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter
  ) {}

  async execute(request: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const { cpf, password } = request;

    const user = await this.userRepository.findByCpf(cpf);

    if (!user) {
      return left(new InvalidCredentialsError());
    }

    const isPasswordValid = await this.hashComparer.compare(password, user.password);

    if (!isPasswordValid) {
      return left(new InvalidCredentialsError());
    }

    const accessToken = await this.encrypter.encrypt({ sub: user.id.toString() });

    return right({
      accessToken,
    });
  }
}
