import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeOrder } from "@test/factories/make-order";
import { makeUser } from "@test/factories/make-user";
import { InMemoryOrdersRepository } from "@test/repositories/in-memory-orders-repository";
import { InMemoryUsersRepository } from "@test/repositories/in-memory-users-repository";
import { expect } from "vitest";
import { FetchOrdersUseCase } from "./fetch-orders";

describe("Fetch orders", () => {
  let ordersRepository: InMemoryOrdersRepository;
  let usersRepository: InMemoryUsersRepository;
  let sut: FetchOrdersUseCase;

  beforeEach(() => {
    ordersRepository = new InMemoryOrdersRepository();
    usersRepository = new InMemoryUsersRepository();

    sut = new FetchOrdersUseCase(ordersRepository);
  });

  it("should be able to fetch orders", async () => {
    const deliveryman = makeUser({ role: "DELIVERYMAN" });

    usersRepository.items.push(deliveryman);

    ordersRepository.items.push(makeOrder({ deliverymanId: deliveryman.id }));
    ordersRepository.items.push(makeOrder({ deliverymanId: deliveryman.id }));

    const result = await sut.execute({
      actorId: deliveryman.id.toString(),
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.isRight() && result.value.orders).toHaveLength(2);
  });

  it("should be able to paginate orders", async () => {
    const deliveryman = makeUser({ role: "DELIVERYMAN" });
    usersRepository.items.push(deliveryman);

    for (let i = 0; i < 21; i++) {
      ordersRepository.items.push(makeOrder({ deliverymanId: deliveryman.id }));
    }

    const result = await sut.execute({
      actorId: deliveryman.id.toString(),
      page: 2,
    });

    expect(result.isRight()).toBe(true);
    expect(result.isRight() && result.value.orders.length).toBe(1);
  });

  it("should not allow deliverymen to see orders from other deliverymen", async () => {
    const deliveryman1 = makeUser({ role: "DELIVERYMAN" });
    const deliveryman2 = makeUser({ role: "DELIVERYMAN" });

    const order1 = makeOrder({ deliverymanId: deliveryman1.id });
    const order2 = makeOrder({ deliverymanId: deliveryman2.id });

    usersRepository.items.push(deliveryman1);
    usersRepository.items.push(deliveryman2);

    ordersRepository.items.push(order1);
    ordersRepository.items.push(order2);

    const result = await sut.execute({
      actorId: deliveryman1.id.toString(),
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.isRight() && result.value.orders).toHaveLength(1);
    expect(result.isRight() && result.value.orders).toEqual([order1]);
  });

  it("should filter orders by location when latitude and longitude are provided", async () => {
    const deliverymanId = "deliveryman-1";

    // Pedido próximo (~mesma coordenada)
    const nearbyOrder = makeOrder({
      deliverymanId: new UniqueEntityId(deliverymanId),
      deliveryAddress: {
        latitude: -23.0,
        longitude: -51.0,
      },
    });

    // Pedido longe
    const farOrder = makeOrder({
      deliverymanId: new UniqueEntityId(deliverymanId),
      deliveryAddress: {
        latitude: -10.0,
        longitude: -40.0,
      },
    });

    ordersRepository.items.push(nearbyOrder, farOrder);

    const result = await sut.execute({
      actorId: deliverymanId,
      page: 1,
      locationParams: {
        userLatitude: -23.0,
        userLongitude: -51.0,
        radiusInKm: 5,
      },
    });

    expect(result.isRight()).toBe(true);
    expect(result.isRight() && result.value.orders).toHaveLength(1);
    expect(result.isRight() && result.value.orders[0]?.id.toString()).toBe(
      nearbyOrder.id.toString()
    );
  });
});
