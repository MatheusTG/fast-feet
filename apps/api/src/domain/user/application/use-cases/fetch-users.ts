import { DomainError } from "@/core/errors/abstractions/domain-error";
import { Either, right } from "@/core/errors/abstractions/either";
import { UseCaseError } from "@/core/errors/abstractions/use-case-error";
import { Injectable } from "@nestjs/common";
import { User, UserRole } from "../../enterprise/entities/user";
import { UsersRepository } from "../repositories/users-repository";

type FetchUsersUseCaseRequest = {
  role?: UserRole;
  page: number;
};

type FetchUsersUseCaseResponse = Either<DomainError | UseCaseError, { users: User[] }>;

@Injectable()
export class FetchUsersUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute(request: FetchUsersUseCaseRequest): Promise<FetchUsersUseCaseResponse> {
    const { role, page } = request;

    const users = await this.userRepository.findMany({ role }, { page });

    return right({
      users,
    });
  }
}
