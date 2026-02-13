import { PaginationParams } from "@/core/repositories/pagination-params";
import { User, UserRole } from "../../enterprise/entities/user";

export abstract class UsersRepository {
  abstract findById(id: string): Promise<User | null>;
  abstract findByCpf(cpf: string): Promise<User | null>;
  abstract findMany(filters: { role?: UserRole }, params?: PaginationParams): Promise<User[]>;
  abstract create(user: User): Promise<void>;
  abstract update(user: User): Promise<void>;
  abstract delete(user: User): Promise<void>;
}
