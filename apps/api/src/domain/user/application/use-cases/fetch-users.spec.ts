import { makeUser } from "@test/factories/make-user";
import { InMemoryUsersRepository } from "@test/repositories/in-memory-users-repository";
import { expectRight } from "@test/utils/expect-right";
import { FetchUsersUseCase } from "./fetch-users";

describe("Fetch Users By Role", () => {
  let usersRepository: InMemoryUsersRepository;

  let sut: FetchUsersUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new FetchUsersUseCase(usersRepository);
  });

  it("should be able to fetch deliverymen", async () => {
    usersRepository.items.push(makeUser({ name: "John Doe", role: "DELIVERYMAN" }));
    usersRepository.items.push(makeUser({ name: "Richard Roe", role: "DELIVERYMAN" }));

    const result = await sut.execute({
      role: "DELIVERYMAN",
      page: 1,
    });

    const { users } = expectRight(result, FetchUsersUseCase.name);

    expect(users).toHaveLength(2);
    expect(users).toEqual(
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

    const { users } = expectRight(result, FetchUsersUseCase.name);

    expect(users).toEqual(
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

    const { users } = expectRight(result, FetchUsersUseCase.name);

    expect(users).toHaveLength(2);
    expect(users).toEqual(expect.arrayContaining([expect.objectContaining({ name: "John Doe" })]));
  });

  it("should be able to fetch all users when the role query is empty", async () => {
    usersRepository.items.push(makeUser({ name: "John Doe" }));
    usersRepository.items.push(makeUser({ name: "Richard Roe" }));

    const result = await sut.execute({
      page: 1,
    });

    const { users } = expectRight(result, FetchUsersUseCase.name);

    expect(users).toHaveLength(2);
  });

  it("should not be able to fetch admin users when role query is `DELIVERYMAN`", async () => {
    usersRepository.items.push(makeUser({ name: "John Doe", role: "DELIVERYMAN" }));
    usersRepository.items.push(makeUser({ name: "Richard Roe", role: "ADMIN" }));

    const result = await sut.execute({
      role: "DELIVERYMAN",
      page: 1,
    });

    const { users } = expectRight(result, FetchUsersUseCase.name);

    expect(users).toEqual(expect.arrayContaining([expect.objectContaining({ name: "John Doe" })]));
  });
});
