import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { User, UserProps } from "@/domain/user/enterprise/entities/user";
import { Cpf } from "@/domain/user/enterprise/entities/value-objects/cpf";
import { fakerPT_BR as faker } from "@faker-js/faker";
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
