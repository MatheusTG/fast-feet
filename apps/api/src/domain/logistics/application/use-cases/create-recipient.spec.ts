import { ForbiddenError } from "@/core/errors/application/forbidden-error";
import { UserRoleAuthorizationService } from "@/core/security/user-role-authorization.service";
import { makeRecipient } from "@test/factories/make-recipient";
import { makeUser } from "@test/factories/make-user";
import { InMemoryRecipientsRepository } from "@test/repositories/in-memory-recipients-repository";
import { InMemoryUsersRepository } from "@test/repositories/in-memory-users-repository";
import { expect } from "vitest";
import { InvalidAddressError } from "../../enterprise/entities/errors/invalid-address-error";
import { CreateRecipientUseCase } from "./create-recipient";

describe("Create recipient", () => {
  let recipientsRepository: InMemoryRecipientsRepository;
  let usersRepository: InMemoryUsersRepository;
  let userRoleAuthorizationService: UserRoleAuthorizationService;

  let sut: CreateRecipientUseCase;

  beforeEach(() => {
    recipientsRepository = new InMemoryRecipientsRepository();
    usersRepository = new InMemoryUsersRepository();
    userRoleAuthorizationService = new UserRoleAuthorizationService(usersRepository);

    sut = new CreateRecipientUseCase(recipientsRepository, userRoleAuthorizationService);
  });

  it("should be able to create a recipient", async () => {
    const user = makeUser({
      role: "ADMIN",
    });
    const recipient = makeRecipient();

    usersRepository.items.push(user);

    const result = await sut.execute({
      actorId: user.id.toString(),
      recipient,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({ recipient: recipientsRepository.items[0] });
  });

  it("should not be able to create a recipient with an invalid address", async () => {
    const user = makeUser({
      role: "ADMIN",
    });
    const recipient = makeRecipient();

    usersRepository.items.push(user);

    const result = await sut.execute({
      actorId: user.id.toString(),
      recipient: {
        name: recipient.name,
        phone: recipient.phone,
        email: recipient.email,
        address: {
          street: recipient.address.street,
          number: recipient.address.number,
          complement: recipient.address.complement,
          neighborhood: recipient.address.neighborhood,
          city: recipient.address.city,
          state: recipient.address.state,
          zipCode: recipient.address.zipCode,
          latitude: 123.456, // Invalid because longitude is missing
        },
      },
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidAddressError);
  });

  it("should not create a recipient if the actor is not an admin", async () => {
    const user = makeUser({
      role: "DELIVERYMAN",
    });
    const recipient = makeRecipient();

    usersRepository.items.push(user);

    const result = await sut.execute({
      actorId: user.id.toString(),
      recipient,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ForbiddenError);
  });
});
