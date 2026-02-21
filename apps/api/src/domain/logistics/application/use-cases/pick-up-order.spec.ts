import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeOrder } from "@test/factories/make-order";
import { InMemoryOrdersRepository } from "@test/repositories/in-memory-orders-repository";
import { expect } from "vitest";
import { InvalidOrderStatusForPickupError } from "./errors/invalid-order-status-for-pickup-error";
import { OrderNotAssignedToDeliverymanError } from "./errors/order-not-assigned-to-deliveryman-error";
import { PickUpOrderUseCase } from "./pick-up-order";

describe("Pick up order", () => {
  let ordersRepository: InMemoryOrdersRepository;
  let sut: PickUpOrderUseCase;

  beforeEach(() => {
    ordersRepository = new InMemoryOrdersRepository();
    sut = new PickUpOrderUseCase(ordersRepository);
  });

  it("should allow deliveryman to pick up", async () => {
    const order = makeOrder({
      status: "AWAITING_PICKUP",
      deliverymanId: new UniqueEntityId("deliveryman-1"),
    });

    ordersRepository.items.push(order);

    const result = await sut.execute({
      actorId: "deliveryman-1",
      orderId: order.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(order.status).toBe("PICKED_UP");
  });

  it("should not allow other deliveryman", async () => {
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

  it("should not allow pickup if status invalid", async () => {
    const order = makeOrder({
      status: "PENDING",
      deliverymanId: new UniqueEntityId("deliveryman-1"),
    });

    ordersRepository.items.push(order);

    const result = await sut.execute({
      actorId: "deliveryman-1",
      orderId: order.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidOrderStatusForPickupError);
  });
});
