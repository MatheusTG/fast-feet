import { Either, left, right } from "@/core/errors/abstractions/either";
import { ResourceNotFoundError } from "@/core/errors/application/resource-not-found.error";
import { Injectable } from "@nestjs/common";
import { User } from "../../enterprise/entities/user";
import { HashComparer } from "../cryptography/hash-comparer";
import { HashGenerator } from "../cryptography/hash-generator";
import { UsersRepository } from "../repositories/users-repository";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { NewPasswordMustBeDifferentError } from "./errors/new-password-must-be-different-error";

type ChangeUserPasswordUseCaseRequest = {
  userId: string;
  currentPassword: string;
  newPassword: string;
};

type ChangeUserPasswordUseCaseResponse = Either<
  NewPasswordMustBeDifferentError | ResourceNotFoundError | InvalidCredentialsError,
  { user: User }
>;

@Injectable()
export class ChangeUserPasswordUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
    private hashComparer: HashComparer
  ) {}

  async execute(
    request: ChangeUserPasswordUseCaseRequest
  ): Promise<ChangeUserPasswordUseCaseResponse> {
    const { userId, currentPassword, newPassword } = request;

    if (currentPassword === newPassword) {
      return left(new NewPasswordMustBeDifferentError());
    }

    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return left(new ResourceNotFoundError());
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
