import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { User, UserProps } from "@/domain/user/enterprise/entities/user";
import { Cpf } from "@/domain/user/enterprise/entities/value-objects/cpf";
import { PrismaUserMapper } from "@/infra/database/prisma/mappers/prisma-user-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { fakerPT_BR as faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { cpfGenerator } from "@test/utils/cpf-generator";

export function makeUser(override?: Partial<UserProps>, id?: UniqueEntityId) {
  const uncheckedCpf = cpfGenerator();

  const cpf = Cpf.create(uncheckedCpf);

  if (!cpf) {
    throw new Error(`Test setup failed: generated invalid CPF (${uncheckedCpf})`);
  }

  const user = User.create(
    {
      cpf,
      name: faker.person.fullName(),
      password: faker.internet.password(),
      ...override,
    },
    id
  );
  return user;
}

@Injectable()
export class UserFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaUser(data: Partial<UserProps> = {}): Promise<User> {
    const user = makeUser(data);

    await this.prisma.user.create({
      data: PrismaUserMapper.toPrisma(user),
    });

    return user;
  }
}
