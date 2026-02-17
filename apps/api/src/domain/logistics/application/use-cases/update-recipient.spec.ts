import { ForbiddenError } from "@/core/errors/application/forbidden-error";
import { UserRoleAuthorizationService } from "@/core/security/user-role-authorization.service";
import { makeRecipient } from "@test/factories/make-recipient";
import { makeUser } from "@test/factories/make-user";
import { InMemoryRecipientsRepository } from "@test/repositories/in-memory-recipients-repository";
import { InMemoryUsersRepository } from "@test/repositories/in-memory-users-repository";
import { expect } from "vitest";
import { RecipientNotFoundError } from "./errors/recipient-not-found.error";
import { UpdateRecipientUseCase } from "./update-recipient";

describe("Update recipient", () => {
  let recipientsRepository: InMemoryRecipientsRepository;
  let usersRepository: InMemoryUsersRepository;
  let userRoleAuthorizationService: UserRoleAuthorizationService;

  let sut: UpdateRecipientUseCase;

  beforeEach(() => {
    recipientsRepository = new InMemoryRecipientsRepository();
    usersRepository = new InMemoryUsersRepository();
    userRoleAuthorizationService = new UserRoleAuthorizationService(usersRepository);

    sut = new UpdateRecipientUseCase(recipientsRepository, userRoleAuthorizationService);
  });

  it("should be able to update a recipient", async () => {
    const user = makeUser({
      role: "ADMIN",
    });
    const recipient = makeRecipient({
      name: "Old name",
    });

    usersRepository.items.push(user);
    recipientsRepository.items.push(recipient);

    const result = await sut.execute({
      actorId: user.id.toString(),
      recipientId: recipient.id.toString(),
      recipient: {
        name: "New name",
      },
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({ recipient: expect.objectContaining({ name: "New name" }) });
  });

  it("should not be able to update an recipient with an invalid identifier", async () => {
    const user = makeUser({
      role: "ADMIN",
    });

    usersRepository.items.push(user);

    const result = await sut.execute({
      actorId: user.id.toString(),
      recipientId: "invalid_identifier",
      recipient: {
        name: "New name",
      },
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(RecipientNotFoundError);
  });

  it("should not update a recipient if the actor is not an admin", async () => {
    const user = makeUser({
      role: "DELIVERYMAN",
    });
    const recipient = makeRecipient({
      name: "Old name",
    });

    usersRepository.items.push(user);
    recipientsRepository.items.push(recipient);

    const result = await sut.execute({
      actorId: user.id.toString(),
      recipientId: recipient.id.toString(),
      recipient: {
        name: "New name",
      },
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ForbiddenError);
  });
});
