import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { User } from "@/domain/user/enterprise/entities/user";
import { fakerPT_BR as faker } from "@faker-js/faker";

export function makeUser(override?: Partial<User>, id?: UniqueEntityId) {
  const user = User.create(
    {
      cpf: faker.string.numeric("###.###.###-##"),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      ...override,
    },
    id
  );
  return user;
}
