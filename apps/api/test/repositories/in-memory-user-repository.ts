import { PaginationParams } from "@/core/repositories/pagination-params";
import { UsersRepository } from "@/domain/user/application/repositories/users-repository";
import { User, UserRole } from "@/domain/user/enterprise/entities/user";

export class InMemoryUserRepository implements UsersRepository {
  items: User[] = [];

  async create(user: User): Promise<void> {
    this.items.push(user);
  }

  async findByCpf(cpf: string): Promise<User | null> {
    const user = this.items.find((item) => item.cpf.value === cpf);

    if (!user) {
      return null;
    }

    return user;
  }

  async findMany(filters: { role: UserRole }, params: PaginationParams): Promise<User[]> {
    const { role } = filters;

    const deliverymen = this.items
      .filter((user) => (role ? user.role === role : true))
      .slice((params.page - 1) * 20, params.page * 20);

    return deliverymen;
  }
}
