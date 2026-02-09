import { User } from "../../enterprise/entities/user";

export abstract class UserRepository {
  abstract create(user: User): Promise<void>;
  abstract findByCpf(cpf: string): Promise<User | null>;
}
