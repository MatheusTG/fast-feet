import { ForbiddenError } from "@/core/errors/application/forbidden-error";
import { makeUser } from "@test/factories/make-user";
import { InMemoryUsersRepository } from "@test/repositories/in-memory-users-repository";
import { UserRoleAuthorizationService } from "../services/user-role-authorization.service";
import { DeleteUserUseCase } from "./delete-user";

describe("Delete user", () => {
  let usersRepository: InMemoryUsersRepository;
  let userRoleAuthorizationService: UserRoleAuthorizationService;

  let sut: DeleteUserUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    userRoleAuthorizationService = new UserRoleAuthorizationService(usersRepository);

    sut = new DeleteUserUseCase(usersRepository, userRoleAuthorizationService);
  });

  it("should be able to delete an user", async () => {
    const user = makeUser();

    usersRepository.items.push(user);

    const userId = user.id.toString();

    const result = await sut.execute({
      actorId: userId,
      targetUserId: userId,
    });

    expect(result.isRight()).toBe(true);
    expect(usersRepository.items).toHaveLength(0);
  });

  it("should be able to delete another user if the actor is an admin", async () => {
    const actor = makeUser({
      role: "ADMIN",
    });
    const targetuser = makeUser();

    usersRepository.items.push(actor);
    usersRepository.items.push(targetuser);

    const result = await sut.execute({
      actorId: actor.id.toString(),
      targetUserId: targetuser.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(usersRepository.items).toHaveLength(1);
  });

  it("should not delete another user if the actor is not an admin", async () => {
    const actor = makeUser({
      role: "DELIVERYMAN",
    });
    const targetuser = makeUser();

    usersRepository.items.push(actor);
    usersRepository.items.push(targetuser);

    const result = await sut.execute({
      actorId: actor.id.toString(),
      targetUserId: targetuser.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ForbiddenError);
  });
});
