import { PaginationParams } from "@/core/repositories/pagination-params";
import { User, UserRole } from "../../enterprise/entities/user";

export abstract class UsersRepository {
  abstract create(user: User): Promise<void>;
  abstract findByCpf(cpf: string): Promise<User | null>;
  abstract findMany(filters: { role?: UserRole }, params?: PaginationParams): Promise<User[]>;
}
