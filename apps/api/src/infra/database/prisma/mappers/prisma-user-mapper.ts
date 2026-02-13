import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { User } from "@/domain/user/enterprise/entities/user";
import { Cpf } from "@/domain/user/enterprise/entities/value-objects/cpf";
import { Prisma, User as PrismaUser } from "@/generated/prisma/client";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    const cpfOrError = Cpf.create(raw.cpf);

    if (cpfOrError.isLeft()) {
      throw new Error(`Invalid CPF stored in database: ${raw.cpf}`);
    }

    const cpf = cpfOrError.value;

    return User.create(
      {
        cpf: cpf,
        name: raw.name,
        password: raw.password,
        role: raw.role,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ?? undefined,
      },
      new UniqueEntityId(raw.id)
    );
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
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
