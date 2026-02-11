import { Either, right } from "@/core/errors/either";
import { Injectable } from "@nestjs/common";
import { User, UserRole } from "../../enterprise/entities/user";
import { UsersRepository } from "../repositories/users-repository";

type FetchUsersByRoleUseCaseRequest = {
  role?: UserRole;
  page: number;
};

type FetchUsersByRoleUseCaseResponse = Either<null, { users: User[] }>;

@Injectable()
export class FetchUsersByRoleUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute(request: FetchUsersByRoleUseCaseRequest): Promise<FetchUsersByRoleUseCaseResponse> {
    const { role, page } = request;

    const users = await this.userRepository.findMany({ role }, { page });

    return right({
      users,
    });
  }
}
