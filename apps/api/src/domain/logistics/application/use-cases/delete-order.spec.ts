import { ForbiddenError } from "@/core/errors/application/forbidden-error";
import { UserRoleAuthorizationService } from "@/core/security/user-role-authorization.service";
import { makeOrder } from "@test/factories/make-order";
import { makeUser } from "@test/factories/make-user";
import { InMemoryOrdersRepository } from "@test/repositories/in-memory-orders-repository";
import { InMemoryUsersRepository } from "@test/repositories/in-memory-users-repository";
import { expect } from "vitest";
import { DeleteOrderUseCase } from "./delete-order";
import { OrderNotFoundError } from "./errors/order-not-found-error";

describe("Delete orders", () => {
  let ordersRepository: InMemoryOrdersRepository;
  let usersRepository: InMemoryUsersRepository;
  let userRoleAuthorizationService: UserRoleAuthorizationService;

  let sut: DeleteOrderUseCase;

  beforeEach(() => {
    ordersRepository = new InMemoryOrdersRepository();
    usersRepository = new InMemoryUsersRepository();
    userRoleAuthorizationService = new UserRoleAuthorizationService(usersRepository);

    sut = new DeleteOrderUseCase(ordersRepository, userRoleAuthorizationService);
  });

  it("should be able to delete an order", async () => {
    const user = makeUser({ role: "ADMIN" });
    const order = makeOrder();

    usersRepository.items.push(user);
    ordersRepository.items.push(order);

    const result = await sut.execute({
      actorId: user.id.toString(),
      orderId: order.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toBeNull();
  });

  it("should not be able to delete an order with invalid id", async () => {
    const user = makeUser({ role: "ADMIN" });
    const order = makeOrder();

    usersRepository.items.push(user);
    ordersRepository.items.push(order);

    const result = await sut.execute({
      actorId: user.id.toString(),
      orderId: "invalid_identifier",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(OrderNotFoundError);
  });

  it("should not delete an order if user is not admin", async () => {
    const user = makeUser({ role: "DELIVERYMAN" });
    const order = makeOrder();

    usersRepository.items.push(user);
    ordersRepository.items.push(order);

    const result = await sut.execute({
      actorId: user.id.toString(),
      orderId: order.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ForbiddenError);
  });
});
