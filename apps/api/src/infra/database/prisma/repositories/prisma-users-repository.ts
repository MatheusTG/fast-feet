import { PaginationParams } from "@/core/repositories/pagination-params";
import { UsersRepository } from "@/domain/user/application/repositories/users-repository";
import { User } from "@/domain/user/enterprise/entities/user";
import { UserRole } from "@/generated/prisma/enums";
import { Injectable } from "@nestjs/common";
import { PrismaUserMapper } from "../mappers/prisma-user-mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}

  async create(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);

    await this.prisma.user.create({
      data,
    });
  }

  async findByCpf(cpf: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        cpf,
      },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  async findMany(filters: { role: UserRole }, params: PaginationParams): Promise<User[]> {
    const { role } = filters;

    const deliveryman = await this.prisma.user.findMany({
      where: role ? { role } : undefined,
      take: 20,
      skip: (params.page - 1) * 20,
    });

    return deliveryman.map(PrismaUserMapper.toDomain);
  }
}
