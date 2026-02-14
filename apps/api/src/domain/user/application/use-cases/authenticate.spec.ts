import { FakeEncrypter } from "@test/cryptography/fake-encrypter";
import { FakeHasher } from "@test/cryptography/fake-hasher";
import { makeUser } from "@test/factories/make-user";
import { InMemoryUsersRepository } from "@test/repositories/in-memory-users-repository";
import { AuthenticateUseCase } from "./authenticate";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

describe("Authenticate", () => {
  let usersRepository: InMemoryUsersRepository;
  let fakeHasher: FakeHasher;
  let fakeEncrypter: FakeEncrypter;

  let sut: AuthenticateUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();

    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();

    sut = new AuthenticateUseCase(usersRepository, fakeHasher, fakeEncrypter);
  });

  it("should be able to authenticate", async () => {
    const password = "123456";
    const user = makeUser({
      password: await fakeHasher.hash(password),
    });

    usersRepository.items.push(user);

    const result = await sut.execute({
      cpf: user.cpf.value,
      password: password,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });

  it("should not be able to authenticate with an incorrect CPF", async () => {
    const password = "123456";
    const user = makeUser({
      password: await fakeHasher.hash(password),
    });

    usersRepository.items.push(user);

    const result = await sut.execute({
      cpf: "incorrect-cpf",
      password: password,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to authenticate with an incorrect password", async () => {
    const user = makeUser({});

    usersRepository.items.push(user);

    const result = await sut.execute({
      cpf: user.cpf.value,
      password: "incorrect-password",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidCredentialsError);
  });
});
