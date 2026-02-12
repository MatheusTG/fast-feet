import { Either, left, right } from "@/core/errors/abstractions/either";
import { ResourceNotFoundError } from "@/core/errors/application/resource-not-found.error";
import { Injectable } from "@nestjs/common";
import { User } from "../../enterprise/entities/user";
import { Cpf } from "../../enterprise/entities/value-objects/cpf";
import { UsersRepository } from "../repositories/users-repository";

type UpdateUserUseCaseRequest = {
  userId: string;
  cpf?: string;
  name?: string;
};

type UpdateUserUseCaseResponse = Either<ResourceNotFoundError, { user: User }>;

@Injectable()
export class UpdateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(request: UpdateUserUseCaseRequest): Promise<UpdateUserUseCaseResponse> {
    const { userId, name, cpf: uncheckedCpf } = request;

    const user = await this.usersRepository.findById(userId);

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
