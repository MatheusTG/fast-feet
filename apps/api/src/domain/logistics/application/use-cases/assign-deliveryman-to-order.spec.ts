import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ForbiddenError } from "@/core/errors/application/forbidden-error";
import { UserRoleAuthorizationService } from "@/core/security/user-role-authorization.service";
import { makeOrder } from "@test/factories/make-order";
import { makeUser } from "@test/factories/make-user";
import { InMemoryOrdersRepository } from "@test/repositories/in-memory-orders-repository";
import { InMemoryUsersRepository } from "@test/repositories/in-memory-users-repository";
import { AssignDeliverymanToOrderUseCase } from "./assign-deliveryman-to-order";
import { InvalidOrderStatusForAssignmentError } from "./errors/invalid-order-status-for-assignment-error";
import { OrderAlreadyHasDeliverymanError } from "./errors/order-already-has-deliveryman-error";
import { OrderNotFoundError } from "./errors/order-not-found-error";

describe("Assign deliveryman to order", () => {
  let ordersRepository: InMemoryOrdersRepository;
  let usersRepository: InMemoryUsersRepository;
  let userRoleAuthorizationService: UserRoleAuthorizationService;
  let sut: AssignDeliverymanToOrderUseCase;

  beforeEach(() => {
    ordersRepository = new InMemoryOrdersRepository();
    usersRepository = new InMemoryUsersRepository();
    userRoleAuthorizationService = new UserRoleAuthorizationService(usersRepository);

    sut = new AssignDeliverymanToOrderUseCase(ordersRepository, userRoleAuthorizationService);
  });

  it("should assign deliveryman", async () => {
    const admin = makeUser({ role: "ADMIN" });
    const deliveryman = makeUser({ role: "DELIVERYMAN" });

    usersRepository.items.push(admin, deliveryman);

    const order = makeOrder({ status: "PENDING" });
    ordersRepository.items.push(order);

    const result = await sut.execute({
      actorId: admin.id.toString(),
      orderId: order.id.toString(),
      deliverymanId: deliveryman.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(order.deliverymanId?.toString()).toBe(deliveryman.id.toString());
    expect(order.status).toBe("AWAITING_PICKUP");
  });

  it("should not allow non admin", async () => {
    const user = makeUser({ role: "DELIVERYMAN" });
    usersRepository.items.push(user);

    const order = makeOrder({ status: "PENDING" });
    ordersRepository.items.push(order);

    const result = await sut.execute({
      actorId: user.id.toString(),
      orderId: order.id.toString(),
      deliverymanId: user.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ForbiddenError);
  });

  it("should return OrderNotFoundError when order does not exist", async () => {
    const admin = makeUser({ role: "ADMIN" });
    usersRepository.items.push(admin);

    const result = await sut.execute({
      actorId: admin.id.toString(),
      orderId: "non-existing-id",
      deliverymanId: new UniqueEntityId().toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(OrderNotFoundError);
  });

  it("should return OrderAlreadyHasDeliverymanError when order already has a deliveryman", async () => {
    const admin = makeUser({ role: "ADMIN" });
    usersRepository.items.push(admin);

    const order = makeOrder({
      deliverymanId: new UniqueEntityId("deliveryman-1"),
      status: "PENDING",
    });

    ordersRepository.items.push(order);

    const result = await sut.execute({
      actorId: admin.id.toString(),
      orderId: order.id.toString(),
      deliverymanId: new UniqueEntityId("deliveryman-2").toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(OrderAlreadyHasDeliverymanError);
  });

  it("should return InvalidOrderStatusForAssignmentError when order is not PENDING", async () => {
    const admin = makeUser({ role: "ADMIN" });
    const deliveryman = makeUser({ role: "DELIVERYMAN" });

    usersRepository.items.push(admin, deliveryman);

    const order = makeOrder({ status: "CANCELED" });
    ordersRepository.items.push(order);

    const result = await sut.execute({
      actorId: admin.id.toString(),
      orderId: order.id.toString(),
      deliverymanId: deliveryman.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidOrderStatusForAssignmentError);
  });
});
