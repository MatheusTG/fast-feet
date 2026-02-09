import { User } from "../../enterprise/entities/user";

export abstract class UserRepository {
  abstract create(user: User): void;
  abstract findByCpf(cpf: string): User | null;
}
