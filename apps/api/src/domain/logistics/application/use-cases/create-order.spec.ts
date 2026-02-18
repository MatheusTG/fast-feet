import { ForbiddenError } from "@/core/errors/application/forbidden-error";
import { UserRoleAuthorizationService } from "@/core/security/user-role-authorization.service";
import { makeOrder } from "@test/factories/make-order";
import { makeRecipient } from "@test/factories/make-recipient";
import { makeUser } from "@test/factories/make-user";
import { InMemoryOrdersRepository } from "@test/repositories/in-memory-orders-repository";
import { InMemoryRecipientsRepository } from "@test/repositories/in-memory-recipients-repository";
import { InMemoryUsersRepository } from "@test/repositories/in-memory-users-repository";
import { expect } from "vitest";
import { InvalidAddressError } from "../../enterprise/entities/errors/invalid-address-error";
import { CreateOrderUseCase } from "./create-order";

describe("Create order", () => {
  let ordersRepository: InMemoryOrdersRepository;
  let recipientsRepository: InMemoryRecipientsRepository;
  let usersRepository: InMemoryUsersRepository;
  let userRoleAuthorizationService: UserRoleAuthorizationService;

  let sut: CreateOrderUseCase;

  beforeEach(() => {
    ordersRepository = new InMemoryOrdersRepository();
    recipientsRepository = new InMemoryRecipientsRepository();
    usersRepository = new InMemoryUsersRepository();
    userRoleAuthorizationService = new UserRoleAuthorizationService(usersRepository);

    sut = new CreateOrderUseCase(
      ordersRepository,
      recipientsRepository,
      userRoleAuthorizationService
    );
  });

  it("should be able to create an order", async () => {
    const user = makeUser({ role: "ADMIN" });
    const recipient = makeRecipient();

    usersRepository.items.push(user);
    recipientsRepository.items.push(recipient);

    const order = makeOrder({
      recipientId: recipient.id,
    });

    const result = await sut.execute({
      actorId: user.id.toString(),
      order: {
        recipientId: order.recipientId.toString(),
        deliveryAddress: order.deliveryAddress,
        postedAt: order.postedAt,
      },
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({ order: ordersRepository.items[0] });
  });

  it("should not be able to create an order with invalid address", async () => {
    const user = makeUser({ role: "ADMIN" });
    const recipient = makeRecipient();

    usersRepository.items.push(user);
    recipientsRepository.items.push(recipient);

    const order = makeOrder({
      recipientId: recipient.id,
    });

    const result = await sut.execute({
      actorId: user.id.toString(),
      order: {
        recipientId: order.recipientId.toString(),
        deliveryAddress: {
          street: order.deliveryAddress.street,
          number: order.deliveryAddress.number,
          complement: order.deliveryAddress.complement,
          neighborhood: order.deliveryAddress.neighborhood,
          city: order.deliveryAddress.city,
          state: order.deliveryAddress.state,
          zipCode: order.deliveryAddress.zipCode,
          latitude: 10, // inválido sem longitude
        },
      },
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidAddressError);
  });

  it("should not create an order if the actor is not an admin", async () => {
    const user = makeUser({ role: "DELIVERYMAN" });
    const recipient = makeRecipient();

    usersRepository.items.push(user);
    recipientsRepository.items.push(recipient);

    const order = makeOrder({
      recipientId: recipient.id,
    });

    const result = await sut.execute({
      actorId: user.id.toString(),
      order: {
        recipientId: order.recipientId.toString(),
        deliveryAddress: order.deliveryAddress,
        postedAt: order.postedAt,
      },
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ForbiddenError);
  });
});
