import { ResourceNotFoundError } from "@/core/errors/application/resource-not-found.error";
import { makeUser } from "@test/factories/make-user";
import { InMemoryUserRepository } from "@test/repositories/in-memory-user-repository";
import { InvalidCpfError } from "./errors/InvalidCpfError";
import { UpdateUserUseCase } from "./update-user";

describe("Update user", () => {
  let usersRepository: InMemoryUserRepository;

  let sut: UpdateUserUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUserRepository();

    sut = new UpdateUserUseCase(usersRepository);
  });

  it("should be able to update an user", async () => {
    const user = makeUser();

    usersRepository.items.push(user);

    const username = "John Doe";

    const result = await sut.execute({
      userId: user.id.toString(),
      cpf: user.cpf.value,
      name: username,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      user: expect.objectContaining({
        name: username,
      }),
    });
  });

  it("should not be able to update an user with an invalid identifier", async () => {
    const user = makeUser();

    const username = "John Doe";

    const result = await sut.execute({
      userId: "invalid_identifier",
      cpf: user.cpf.value,
      name: username,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to update an user with an invalid CPF", async () => {
    const user = makeUser();

    usersRepository.items.push(user);

    const cpf = "111.111.111-11";

    const result = await sut.execute({
      userId: user.id.toString(),
      cpf,
      name: user.name,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidCpfError);
  });
});
