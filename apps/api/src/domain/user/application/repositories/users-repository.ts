import { User } from "../../enterprise/entities/user";

export abstract class UsersRepository {
  abstract create(user: User): Promise<void>;
  abstract findByCpf(cpf: string): Promise<User | null>;
}
