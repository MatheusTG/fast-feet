import { Either, right } from "@/core/errors/either";
import { Injectable } from "@nestjs/common";
import { User, UserRole } from "../../enterprise/entities/user";
import { UsersRepository } from "../repositories/users-repository";
import { UserAlreadyExistsError } from "./errors/UserAlreadyExistsError";

type FetchUsersUseCaseRequest = {
  role?: UserRole;
  page: number;
};

type FetchUsersUseCaseResponse = Either<UserAlreadyExistsError, { users: User[] }>;

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
