import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ForbiddenError } from "@/core/errors/application/forbidden-error";
import { UserRoleAuthorizationService } from "@/core/security/user-role-authorization.service";
import { makeOrder } from "@test/factories/make-order";
import { makeUser } from "@test/factories/make-user";
import { InMemoryOrdersRepository } from "@test/repositories/in-memory-orders-repository";
import { InMemoryUsersRepository } from "@test/repositories/in-memory-users-repository";
import { expect } from "vitest";
import { FetchOrdersUseCase } from "./fetch-orders";

describe("Fetch orders", () => {
  let ordersRepository: InMemoryOrdersRepository;
  let usersRepository: InMemoryUsersRepository;
  let authService: UserRoleAuthorizationService;
  let sut: FetchOrdersUseCase;

  beforeEach(() => {
    ordersRepository = new InMemoryOrdersRepository();
    usersRepository = new InMemoryUsersRepository();
    authService = new UserRoleAuthorizationService(usersRepository);

    sut = new FetchOrdersUseCase(ordersRepository, authService);
  });

  it("should be able to fetch orders", async () => {
    const user = makeUser({ role: "ADMIN" });
    usersRepository.items.push(user);

    ordersRepository.items.push(makeOrder());
    ordersRepository.items.push(makeOrder());

    const result = await sut.execute({
      actorId: user.id.toString(),
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.isRight() && result.value.orders.length).toBe(2);
  });

  it("should be able to paginate orders", async () => {
    const user = makeUser({ role: "ADMIN" });
    usersRepository.items.push(user);

    for (let i = 0; i < 21; i++) {
      ordersRepository.items.push(makeOrder());
    }

    const result = await sut.execute({
      actorId: user.id.toString(),
      page: 2,
    });

    expect(result.isRight()).toBe(true);
    expect(result.isRight() && result.value.orders.length).toBe(1);
  });

  it("should not allow non admin", async () => {
    const user = makeUser({ role: "DELIVERYMAN" });
    usersRepository.items.push(user);

    const result = await sut.execute({
      actorId: user.id.toString(),
      page: 1,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ForbiddenError);
  });

  it("should filter by recipientId", async () => {
    const user = makeUser({ role: "ADMIN" });
    usersRepository.items.push(user);

    const orderA = makeOrder({ recipientId: new UniqueEntityId("recipient-1") });
    const orderB = makeOrder({ recipientId: new UniqueEntityId("recipient-2") });

    ordersRepository.items.push(orderA, orderB);

    const result = await sut.execute({
      actorId: user.id.toString(),
      page: 1,
      filters: { recipientId: "recipient-1" },
    });

    expect(result.isRight()).toBe(true);
    expect(result.isRight() && result.value.orders).toEqual([
      expect.objectContaining({ recipientId: new UniqueEntityId("recipient-1") }),
    ]);
  });
});
