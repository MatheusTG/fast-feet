import { User } from "@/domain/user/enterprise/entities/user";
import { Prisma, User as PrismaUser } from "@/generated/prisma/client";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create({
      cpf: raw.cpf,
      name: raw.name,
      password: raw.password,
      role: raw.role,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt ?? undefined,
    });
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      cpf: user.cpf,
      name: user.name,
      password: user.password,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
