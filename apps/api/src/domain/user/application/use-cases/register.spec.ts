import { FakeHasher } from "@test/cryptography/fake-hasher";
import { makeUser } from "@test/factories/make-user";
import { InMemoryUserRepository } from "@test/repositories/in-memory-user-repository";
import { RegisterUseCase } from "./register";

describe("Register", () => {
  let userRepository: InMemoryUserRepository;
  let hashGenerator: FakeHasher;
  let sut: RegisterUseCase;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    hashGenerator = new FakeHasher();
    sut = new RegisterUseCase(userRepository, hashGenerator);
  });

  it("should be able to register.", async () => {
    const user = makeUser();

    const result = await sut.execute(user);

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({ user: userRepository.items[0] });
  });
});
