import { ForbiddenError } from "@/core/errors/application/Forbidden-error";
import { ResourceNotFoundError } from "@/core/errors/application/resource-not-found.error";
import { FakeHasher } from "@test/cryptography/fake-hasher";
import { makeUser } from "@test/factories/make-user";
import { InMemoryUserRepository } from "@test/repositories/in-memory-user-repository";
import { UserRoleAuthorizationService } from "../services/user-role-authorization.service";
import { ChangeUserPasswordUseCase } from "./change-user-password";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { NewPasswordMustBeDifferentError } from "./errors/new-password-must-be-different-error";

describe("Change user password", () => {
  let usersRepository: InMemoryUserRepository;
  let userRoleAuthorizationService: UserRoleAuthorizationService;
  let fakeHasher: FakeHasher;

  let sut: ChangeUserPasswordUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUserRepository();
    userRoleAuthorizationService = new UserRoleAuthorizationService(usersRepository);
    fakeHasher = new FakeHasher();

    sut = new ChangeUserPasswordUseCase(
      usersRepository,
      userRoleAuthorizationService,
      fakeHasher,
      fakeHasher
    );
  });

  it("should be able to change the user password", async () => {
    const currentPassword = "123456";

    const user = makeUser({
      password: await fakeHasher.hash(currentPassword),
    });

    usersRepository.items.push(user);

    const userId = user.id.toString();
    const newPassword = "new_password";

    const result = await sut.execute({
      actorId: userId,
      targetUserId: userId,
      currentPassword,
      newPassword,
    });

    const userWithNewPassword = await usersRepository.findById(userId);

    expect(userWithNewPassword).toBeDefined();

    if (!userWithNewPassword) return;

    const isOldPasswordValid = await fakeHasher.compare(newPassword, userWithNewPassword?.password);

    expect(result.isRight()).toBe(true);
    expect(isOldPasswordValid).toBe(true);
  });

  it("should not change password back to the same password", async () => {
    const password = "123456";

    const user = makeUser({
      password: await fakeHasher.hash(password),
    });

    usersRepository.items.push(user);

    const userId = user.id.toString();

    const result = await sut.execute({
      actorId: userId,
      targetUserId: userId,
      currentPassword: password,
      newPassword: password,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NewPasswordMustBeDifferentError);
  });

  it("should not be able to change password with an invalid user ID", async () => {
    const currentPassword = "123456";

    const user = makeUser({
      password: await fakeHasher.hash(currentPassword),
      role: "ADMIN",
    });

    usersRepository.items.push(user);

    const newPassword = "new_password";

    const result = await sut.execute({
      actorId: user.id.toString(),
      targetUserId: "invalid_user_id",
      currentPassword,
      newPassword,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not change password if current password is wrong", async () => {
    const user = makeUser({
      password: await fakeHasher.hash("123456"),
    });

    usersRepository.items.push(user);

    const userId = user.id.toString();

    const result = await sut.execute({
      actorId: userId,
      targetUserId: userId,
      currentPassword: "incorrect_current_password",
      newPassword: "new_password",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not change another user's password if the actor is not an admin", async () => {
    const actor = makeUser({
      password: await fakeHasher.hash("123456"),
      role: "DELIVERYMAN",
    });

    const targetUser = makeUser({
      password: await fakeHasher.hash("123456"),
      role: "DELIVERYMAN",
    });

    usersRepository.items.push(actor);
    usersRepository.items.push(targetUser);

    const result = await sut.execute({
      actorId: actor.id.toString(),
      targetUserId: targetUser.id.toString(),
      currentPassword: "123456",
      newPassword: "new_password",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ForbiddenError);
  });
});
