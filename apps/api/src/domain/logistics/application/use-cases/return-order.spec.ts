import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { UserRoleAuthorizationService } from "@/core/security/user-role-authorization.service";
import { makeOrder } from "@test/factories/make-order";
import { InMemoryOrdersRepository } from "@test/repositories/in-memory-orders-repository";
import { InMemoryUsersRepository } from "@test/repositories/in-memory-users-repository";
import { expect } from "vitest";
import { OrderNotAssignedToDeliverymanError } from "./errors/order-not-assigned-to-deliveryman-error";
import { ReturnOrderUseCase } from "./return-order";

describe("Return order", () => {
  let ordersRepository: InMemoryOrdersRepository;
  let usersRepository: InMemoryUsersRepository;
  let userRoleAuthorizationService: UserRoleAuthorizationService;

  let sut: ReturnOrderUseCase;

  beforeEach(() => {
    ordersRepository = new InMemoryOrdersRepository();
    usersRepository = new InMemoryUsersRepository();
    userRoleAuthorizationService = new UserRoleAuthorizationService(usersRepository);

    sut = new ReturnOrderUseCase(ordersRepository, userRoleAuthorizationService);
  });

  it("should allow to return an order", async () => {
    const order = makeOrder({
      deliverymanId: new UniqueEntityId("deliveryman-1"),
    });

    ordersRepository.items.push(order);

    const result = await sut.execute({
      actorId: "deliveryman-1",
      orderId: order.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(order.status).toBe("RETURNED");
  });

  it("should not allow return orders from other deliverymen", async () => {
    const order = makeOrder({
      status: "AWAITING_PICKUP",
      deliverymanId: new UniqueEntityId("deliveryman-1"),
    });

    ordersRepository.items.push(order);

    const result = await sut.execute({
      actorId: "deliveryman-2",
      orderId: order.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(OrderNotAssignedToDeliverymanError);
  });
});
