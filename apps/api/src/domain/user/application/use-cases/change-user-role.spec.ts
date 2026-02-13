import { ForbiddenError } from "@/core/errors/application/forbidden-error";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found.error";
import { makeUser } from "@test/factories/make-user";
import { InMemoryUserRepository } from "@test/repositories/in-memory-user-repository";
import { UserRoleAuthorizationService } from "../services/user-role-authorization.service";
import { ChangeUserRoleUseCase } from "./change-user-role";

describe("Change user role", () => {
  let usersRepository: InMemoryUserRepository;
  let userRoleAuthorizationService: UserRoleAuthorizationService;

  let sut: ChangeUserRoleUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUserRepository();
    userRoleAuthorizationService = new UserRoleAuthorizationService(usersRepository);

    sut = new ChangeUserRoleUseCase(usersRepository, userRoleAuthorizationService);
  });

  it("should be able to change the user role", async () => {
    const actor = makeUser({
      role: "ADMIN",
    });

    const targetUser = makeUser({
      role: "DELIVERYMAN",
    });

    usersRepository.items.push(actor);
    usersRepository.items.push(targetUser);

    const result = await sut.execute({
      actorId: actor.id.toString(),
      targetUserId: targetUser.id.toString(),
      newRole: "ADMIN",
    });

    const targetUserId = targetUser.id.toString();

    expect(result.isRight()).toBe(true);
    expect(await usersRepository.findById(targetUserId)).toEqual(
      expect.objectContaining({ role: "ADMIN" })
    );
  });

  it("should not allow changing the user role if the actor is not an admin", async () => {
    const actor = makeUser({
      role: "DELIVERYMAN",
    });

    const targetUser = makeUser({
      role: "DELIVERYMAN",
    });

    usersRepository.items.push(actor);
    usersRepository.items.push(targetUser);

    const result = await sut.execute({
      actorId: actor.id.toString(),
      targetUserId: targetUser.id.toString(),
      newRole: "ADMIN",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ForbiddenError);
  });

  it("should not allow changing the user role when the target user does not exist", async () => {
    const actor = makeUser({
      role: "ADMIN",
    });

    usersRepository.items.push(actor);

    const result = await sut.execute({
      actorId: actor.id.toString(),
      targetUserId: "invalid_target_user_id",
      newRole: "ADMIN",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });
});
