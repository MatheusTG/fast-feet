import { ForbiddenError } from "@/core/errors/application/forbidden-error";
import { UserRoleAuthorizationService } from "@/core/security/user-role-authorization.service";
import { makeRecipient } from "@test/factories/make-recipient";
import { makeUser } from "@test/factories/make-user";
import { InMemoryRecipientsRepository } from "@test/repositories/in-memory-recipients-repository";
import { InMemoryUsersRepository } from "@test/repositories/in-memory-users-repository";
import { expect } from "vitest";
import { FetchRecipientsUseCase } from "./fetch-recipients";

describe("Fetch recipients", () => {
  let recipientsRepository: InMemoryRecipientsRepository;
  let usersRepository: InMemoryUsersRepository;
  let userRoleAuthorizationService: UserRoleAuthorizationService;

  let sut: FetchRecipientsUseCase;

  beforeEach(() => {
    recipientsRepository = new InMemoryRecipientsRepository();
    usersRepository = new InMemoryUsersRepository();
    userRoleAuthorizationService = new UserRoleAuthorizationService(usersRepository);

    sut = new FetchRecipientsUseCase(recipientsRepository, userRoleAuthorizationService);
  });

  it("should be able to fetch filtered recipients", async () => {
    const user = makeUser({
      role: "ADMIN",
    });

    const recipient = makeRecipient({
      name: "John Doe",
      address: {
        city: "Araruna",
      },
    });

    usersRepository.items.push(user);
    recipientsRepository.items.push(recipient);

    const result = await sut.execute({
      actorId: user.id.toString(),
      filters: {
        name: "John Doe",
        city: "Araruna",
      },
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(
      expect.objectContaining({
        recipients: expect.arrayContaining([expect.objectContaining({ name: "John Doe" })]),
      })
    );
  });

  it("should be able to fetch all recipients when there are no filters", async () => {
    const user = makeUser({
      role: "ADMIN",
    });

    usersRepository.items.push(user);

    recipientsRepository.items.push(makeRecipient());
    recipientsRepository.items.push(makeRecipient());

    const result = await sut.execute({
      actorId: user.id.toString(),
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(
      expect.objectContaining({
        recipients: expect.arrayContaining([
          expect.objectContaining({ name: recipientsRepository.items[0]?.name }),
          expect.objectContaining({ name: recipientsRepository.items[1]?.name }),
        ]),
      })
    );
  });

  it("should be able to fetch paginated recipients", async () => {
    const user = makeUser({
      role: "ADMIN",
    });

    usersRepository.items.push(user);

    for (let i = 1; i <= 20; i++) {
      recipientsRepository.items.push(makeRecipient());
    }
    recipientsRepository.items.push(makeRecipient({ name: "John Doe" }));

    const result = await sut.execute({
      actorId: user.id.toString(),
      page: 2,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toHaveProperty("recipients", [
      expect.objectContaining({ name: "John Doe" }),
    ]);
  });

  it("should not be able to fetch recipients if the actor is not an admin", async () => {
    const user = makeUser({
      role: "DELIVERYMAN",
    });

    usersRepository.items.push(user);

    for (let i = 1; i <= 20; i++) {
      recipientsRepository.items.push(makeRecipient());
    }
    recipientsRepository.items.push(makeRecipient({ name: "John Doe" }));

    const result = await sut.execute({
      actorId: user.id.toString(),
      page: 2,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ForbiddenError);
  });
});
