import { FakeHasher } from "@test/cryptography/fake-hasher";
import { makeUser } from "@test/factories/make-user";
import { InMemoryUsersRepository } from "@test/repositories/in-memory-users-repository";
import { InvalidCpfError } from "../../enterprise/entities/errors/Invalid-cpf-error";
import { UserRoleAuthorizationService } from "../services/user-role-authorization.service";
import { RegisterUseCase } from "./register";

describe("Register", () => {
  let usersRepository: InMemoryUsersRepository;
  let fakeHasher: FakeHasher;
  let userRoleAuthorizationService: UserRoleAuthorizationService;

  let sut: RegisterUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();
    userRoleAuthorizationService = new UserRoleAuthorizationService(usersRepository);

    sut = new RegisterUseCase(usersRepository, fakeHasher, userRoleAuthorizationService);
  });

  it("should be able to register", async () => {
    const user = makeUser();

    const result = await sut.execute({
      cpf: user.cpf.value,
      name: user.name,
      password: user.password,
      role: user.role,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({ user: usersRepository.items[0] });
  });

  it("should hash user password upon registration", async () => {
    const user = makeUser();

    await sut.execute({
      cpf: user.cpf.value,
      name: user.name,
      password: user.password,
      role: user.role,
    });

    const hashedPassword = await fakeHasher.hash(user.password);

    expect(usersRepository.items[0]?.password).toEqual(hashedPassword);
  });

  it("should not be able to register with an invalid CPF", async () => {
    const user = makeUser();
    const cpf = "111.111.111-11";

    const result = await sut.execute({
      cpf,
      name: user.name,
      password: user.password,
      role: user.role,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidCpfError);
  });
});
