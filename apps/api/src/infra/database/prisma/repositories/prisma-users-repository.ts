import { PaginationParams } from "@/core/repositories/pagination-params";
import { UsersRepository } from "@/domain/user/application/repositories/users-repository";
import { User, UserRole } from "@/domain/user/enterprise/entities/user";
import { CacheRepository } from "@/infra/cache/cache-repository";
import { Injectable } from "@nestjs/common";
import { PrismaUserMapper } from "../mappers/prisma-user-mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(
    private prisma: PrismaService,
    private cache: CacheRepository
  ) {}

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

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  async findMany(filters: { role: UserRole }, params: PaginationParams): Promise<User[]> {
    const { role } = filters;

    const cacheKey = `users:${role ?? "all"}:page:${params.page}`;

    const cacheHit = await this.cache.get(cacheKey);

    if (cacheHit) {
      const cachedData = JSON.parse(cacheHit);

      return cachedData;
    }

    const users = await this.prisma.user.findMany({
      where: role ? { role } : undefined,
      take: 20,
      skip: (params.page - 1) * 20,
    });

    const usersDomain = users.map(PrismaUserMapper.toDomain);

    await this.cache.set(cacheKey, JSON.stringify(usersDomain));

    return usersDomain;
  }

  async create(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);

    await this.prisma.user.create({
      data,
    });

    await this.cache.delete("users:*");
  }

  async update(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);

    await this.prisma.user.update({
      where: {
        id: user.id.toString(),
      },
      data,
    });

    await this.cache.delete("users:*");
  }

  async delete(user: User): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id: user.id.toString(),
      },
    });

    await this.cache.delete("users:*");
  }
}
