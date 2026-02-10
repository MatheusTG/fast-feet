import { User } from "@/domain/user/enterprise/entities/user";
import { Cpf } from "@/domain/user/enterprise/entities/value-objects/cpf";
import { Prisma, User as PrismaUser } from "@/generated/prisma/client";
import { Injectable } from "@nestjs/common";
import { cpfGenerator } from "@test/utils/cpf-generator";

@Injectable()
export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    const uncheckedCpf = cpfGenerator();

    const cpf = Cpf.create(uncheckedCpf);

    if (!cpf) {
      throw new Error(`Invalid CPF stored in database: ${raw.cpf}`);
    }

    return User.create({
      cpf,
      name: raw.name,
      password: raw.password,
      role: raw.role,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt ?? undefined,
    });
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      cpf: user.cpf.value,
      name: user.name,
      password: user.password,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
