import { ForbiddenError } from "@/core/errors/application/forbidden-error";
import { UserRoleAuthorizationService } from "@/core/security/user-role-authorization.service";
import { makeOrder } from "@test/factories/make-order";
import { makeUser } from "@test/factories/make-user";
import { InMemoryOrdersRepository } from "@test/repositories/in-memory-orders-repository";
import { InMemoryUsersRepository } from "@test/repositories/in-memory-users-repository";
import { expect } from "vitest";
import { OrderNotFoundError } from "./errors/order-not-found-error";
import { UpdateOrderUseCase } from "./update-order";

describe("Update order", () => {
  let ordersRepository: InMemoryOrdersRepository;
  let usersRepository: InMemoryUsersRepository;
  let userRoleAuthorizationService: UserRoleAuthorizationService;

  let sut: UpdateOrderUseCase;

  beforeEach(() => {
    ordersRepository = new InMemoryOrdersRepository();
    usersRepository = new InMemoryUsersRepository();
    userRoleAuthorizationService = new UserRoleAuthorizationService(usersRepository);

    sut = new UpdateOrderUseCase(ordersRepository, userRoleAuthorizationService);
  });

  it("should be able to update an order", async () => {
    const user = makeUser({ role: "ADMIN" });
    const order = makeOrder();

    usersRepository.items.push(user);
    ordersRepository.items.push(order);

    const result = await sut.execute({
      actorId: user.id.toString(),
      orderId: order.id.toString(),
      order: {
        status: "DELIVERED",
      },
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      order: expect.objectContaining({ status: "DELIVERED" }),
    });
  });

  it("should not update with invalid id", async () => {
    const user = makeUser({ role: "ADMIN" });

    usersRepository.items.push(user);

    const result = await sut.execute({
      actorId: user.id.toString(),
      orderId: "invalid_id",
      order: { status: "DELIVERED" },
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(OrderNotFoundError);
  });

  it("should not update if actor is not admin", async () => {
    const user = makeUser({ role: "DELIVERYMAN" });
    const order = makeOrder();

    usersRepository.items.push(user);
    ordersRepository.items.push(order);

    const result = await sut.execute({
      actorId: user.id.toString(),
      orderId: order.id.toString(),
      order: { status: "DELIVERED" },
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ForbiddenError);
  });
});
