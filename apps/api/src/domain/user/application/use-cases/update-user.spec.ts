import { ForbiddenError } from "@/core/errors/application/forbidden-error";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found.error";
import { makeUser } from "@test/factories/make-user";
import { InMemoryUserRepository } from "@test/repositories/in-memory-user-repository";
import { UserRoleAuthorizationService } from "../services/user-role-authorization.service";
import { InvalidCpfError } from "./errors/InvalidCpfError";
import { UpdateUserUseCase } from "./update-user";

describe("Update user", () => {
  let usersRepository: InMemoryUserRepository;
  let userRoleAuthorizationService: UserRoleAuthorizationService;

  let sut: UpdateUserUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUserRepository();
    userRoleAuthorizationService = new UserRoleAuthorizationService(usersRepository);

    sut = new UpdateUserUseCase(usersRepository, userRoleAuthorizationService);
  });

  it("should be able to update an user", async () => {
    const user = makeUser();

    usersRepository.items.push(user);

    const username = "John Doe";

    const userId = user.id.toString();

    const result = await sut.execute({
      actorId: userId,
      targetUserId: userId,
      name: username,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      user: expect.objectContaining({
        name: username,
      }),
    });
  });

  it("should not be able to update an user with an invalid target user identifier", async () => {
    const user = makeUser({
      role: "ADMIN",
    });

    usersRepository.items.push(user);

    const result = await sut.execute({
      actorId: user.id.toString(),
      targetUserId: "invalid_identifier",
      cpf: "936.509.660-00",
      name: "John Doe",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });

  it("should not be able to update an user with an invalid CPF", async () => {
    const user = makeUser();

    usersRepository.items.push(user);

    const userId = user.id.toString();

    const invalidCPF = "111.111.111-11";

    const result = await sut.execute({
      actorId: userId,
      targetUserId: userId,
      cpf: invalidCPF,
      name: "John Doe",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidCpfError);
  });

  it("should not update another user if the actor is not an admin", async () => {
    const actor = makeUser();
    const targetUser = makeUser();

    usersRepository.items.push(actor);
    usersRepository.items.push(targetUser);

    const result = await sut.execute({
      actorId: actor.id.toString(),
      targetUserId: targetUser.id.toString(),
      cpf: "936.509.660-00",
      name: "John Doe",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ForbiddenError);
  });
});
