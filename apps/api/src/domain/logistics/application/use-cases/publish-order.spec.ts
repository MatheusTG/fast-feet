import { UserRoleAuthorizationService } from "@/core/security/user-role-authorization.service";
import { makeOrder } from "@test/factories/make-order";
import { makeUser } from "@test/factories/make-user";
import { InMemoryOrdersRepository } from "@test/repositories/in-memory-orders-repository";
import { InMemoryUsersRepository } from "@test/repositories/in-memory-users-repository";
import { expect } from "vitest";
import { InvalidOrderStatusForWaitingError } from "./errors/invalid-order-status-for-waiting-error";
import { PublishOrderUseCase } from "./publish-order";

describe("Publish order", () => {
  let ordersRepository: InMemoryOrdersRepository;
  let usersRepository: InMemoryUsersRepository;
  let userRoleAuthorizationService: UserRoleAuthorizationService;

  let sut: PublishOrderUseCase;

  beforeEach(() => {
    ordersRepository = new InMemoryOrdersRepository();
    usersRepository = new InMemoryUsersRepository();
    userRoleAuthorizationService = new UserRoleAuthorizationService(usersRepository);

    sut = new PublishOrderUseCase(ordersRepository, userRoleAuthorizationService);
  });

  it("should mark order as waiting", async () => {
    const admin = makeUser({ role: "ADMIN" });
    usersRepository.items.push(admin);

    const order = makeOrder({ status: "PENDING" });
    ordersRepository.items.push(order);

    const result = await sut.execute({
      actorId: admin.id.toString(),
      orderId: order.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(ordersRepository.items[0]?.status).toBe("AVAILABLE_FOR_PICKUP");
  });

  it("should not mark non pending order", async () => {
    const admin = makeUser({ role: "ADMIN" });
    usersRepository.items.push(admin);

    const order = makeOrder({ status: "DELIVERED" });
    ordersRepository.items.push(order);

    const result = await sut.execute({
      actorId: admin.id.toString(),
      orderId: order.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidOrderStatusForWaitingError);
  });
});
