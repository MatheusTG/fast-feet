import { ForbiddenError } from "@/core/errors/application/forbidden-error";
import { UserRoleAuthorizationService } from "@/core/security/user-role-authorization.service";
import { makeRecipient } from "@test/factories/make-recipient";
import { makeUser } from "@test/factories/make-user";
import { InMemoryRecipientsRepository } from "@test/repositories/in-memory-recipients-repository";
import { InMemoryUsersRepository } from "@test/repositories/in-memory-users-repository";
import { expect } from "vitest";
import { DeleteRecipientUseCase } from "./delete-recipient";
import { RecipientNotFoundError } from "./errors/recipient-not-found.error";

describe("Delete recipients", () => {
  let recipientsRepository: InMemoryRecipientsRepository;
  let usersRepository: InMemoryUsersRepository;
  let userRoleAuthorizationService: UserRoleAuthorizationService;

  let sut: DeleteRecipientUseCase;

  beforeEach(() => {
    recipientsRepository = new InMemoryRecipientsRepository();
    usersRepository = new InMemoryUsersRepository();
    userRoleAuthorizationService = new UserRoleAuthorizationService(usersRepository);

    sut = new DeleteRecipientUseCase(recipientsRepository, userRoleAuthorizationService);
  });

  it("should be able to delete a recipient", async () => {
    const user = makeUser({
      role: "ADMIN",
    });

    const recipient = makeRecipient();

    usersRepository.items.push(user);
    recipientsRepository.items.push(recipient);

    const result = await sut.execute({
      actorId: user.id.toString(),
      recipientId: recipient.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toBeNull();
  });

  it("should not be able to delete a recipient with an invalid identifier", async () => {
    const user = makeUser({
      role: "ADMIN",
    });

    const recipient = makeRecipient();

    usersRepository.items.push(user);
    recipientsRepository.items.push(recipient);

    const result = await sut.execute({
      actorId: user.id.toString(),
      recipientId: "invalid_identifier",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(RecipientNotFoundError);
  });

  it("should not delete a recipient if the actor is not an admin", async () => {
    const user = makeUser({
      role: "DELIVERYMAN",
    });

    const recipient = makeRecipient();

    usersRepository.items.push(user);
    recipientsRepository.items.push(recipient);

    const result = await sut.execute({
      actorId: user.id.toString(),
      recipientId: recipient.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ForbiddenError);
  });
});
