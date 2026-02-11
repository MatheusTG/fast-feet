import { makeUser } from "@test/factories/make-user";
import { InMemoryUserRepository } from "@test/repositories/in-memory-user-repository";
import { FetchUsersByRoleUseCase } from "./fetch-users-by-role";

describe("Fetch Users By Role", () => {
  let usersRepository: InMemoryUserRepository;

  let sut: FetchUsersByRoleUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUserRepository();
    sut = new FetchUsersByRoleUseCase(usersRepository);
  });

  it("should be able to fetch deliverymen", async () => {
    usersRepository.items.push(makeUser({ name: "John Doe", role: "DELIVERYMAN" }));
    usersRepository.items.push(makeUser({ name: "Richard Roe", role: "DELIVERYMAN" }));

    const result = await sut.execute({
      role: "DELIVERYMAN",
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.users).toHaveLength(2);
    expect(result.value?.users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "John Doe" }),
        expect.objectContaining({ name: "Richard Roe" }),
      ])
    );
  });

  it("should be able to fetch admins", async () => {
    usersRepository.items.push(makeUser({ name: "John Doe", role: "ADMIN" }));
    usersRepository.items.push(makeUser({ name: "Richard Roe", role: "ADMIN" }));

    const result = await sut.execute({
      role: "ADMIN",
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.users).toHaveLength(2);
    expect(result.value?.users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "John Doe" }),
        expect.objectContaining({ name: "Richard Roe" }),
      ])
    );
  });

  it("should be able to fetch paginated users", async () => {
    for (let i = 1; i <= 21; i++) {
      usersRepository.items.push(makeUser());
    }
    usersRepository.items.push(makeUser({ name: "John Doe" }));

    const result = await sut.execute({
      page: 2,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.users).toHaveLength(2);
    expect(result.value?.users).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "John Doe" })])
    );
  });

  it("should be able to fetch all users when the role query is empty", async () => {
    usersRepository.items.push(makeUser({ name: "John Doe" }));
    usersRepository.items.push(makeUser({ name: "Richard Roe" }));

    const result = await sut.execute({
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.users).toHaveLength(2);
  });

  it("should not be able to fetch admin users when role query is `DELIVERYMAN`", async () => {
    usersRepository.items.push(makeUser({ name: "John Doe", role: "DELIVERYMAN" }));
    usersRepository.items.push(makeUser({ name: "Richard Roe", role: "ADMIN" }));

    const result = await sut.execute({
      role: "DELIVERYMAN",
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.users).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "John Doe" })])
    );
  });
});
