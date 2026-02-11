import { User } from "@/domain/user/enterprise/entities/user";

export class UserPresenter {
  static toHTTP(user: User) {
    return {
      id: user.id.toString(),
      cpf: user.cpf.value,
      name: user.name,
      password: user.password,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
