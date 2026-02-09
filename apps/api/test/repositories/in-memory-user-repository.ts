import { UserRepository } from "@/domain/user/application/repositories/user-repository";
import { User } from "@/domain/user/enterprise/entities/user";

export class InMemoryUserRepository implements UserRepository {
  items: User[] = [];

  async create(user: User): Promise<void> {
    this.items.push(user);
  }
  async findByCpf(cpf: string): Promise<User | null> {
    const user = this.items.find((item) => item.cpf === cpf);

    if (!user) {
      return null;
    }

    return user;
  }
}
