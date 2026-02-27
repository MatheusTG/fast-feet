import { UsersRepository } from "@/domain/user/application/repositories/users-repository";
import { AppModule } from "@/infra/app.module";
import { CacheRepository } from "@/infra/cache/cache-repository";
import { CacheModule } from "@/infra/cache/cache.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { makeUser, UserFactory } from "@test/factories/make-user";

describe("Prisma Users Repository (E2E)", () => {
  let app: INestApplication;

  let usersRepository: UsersRepository;
  let cacheRepository: CacheRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    usersRepository = moduleRef.get(UsersRepository);
    cacheRepository = moduleRef.get(CacheRepository);

    await app.init();
  });

  it("should cache user list", async () => {
    const deliveryman = makeUser({
      role: "DELIVERYMAN",
    });

    await usersRepository.create(deliveryman);

    const users = await usersRepository.findMany({ role: "DELIVERYMAN" }, { page: 1 });

    const cached = await cacheRepository.get("users:DELIVERYMAN:page:1");

    if (!cached) {
      throw new Error();
    }

    expect(JSON.parse(cached)).toHaveLength(1);
    expect(JSON.parse(cached)).toEqual([
      expect.objectContaining({
        cpf: users[0]?.cpf.value,
      }),
    ]);
  });

  it("should cache user list on subsequent calls", async () => {
    const deliveryman = makeUser({
      role: "DELIVERYMAN",
    });

    await usersRepository.create(deliveryman);

    const cachedUser = makeUser({
      role: "DELIVERYMAN",
    });

    await cacheRepository.set(
      "users:DELIVERYMAN:page:1",
      JSON.stringify([
        {
          cpf: cachedUser.cpf.value,
        },
      ])
    );

    await usersRepository.findMany({ role: "DELIVERYMAN" }, { page: 1 });

    const cached = await cacheRepository.get("users:DELIVERYMAN:page:1");

    if (!cached) {
      throw new Error();
    }

    expect(JSON.parse(cached)).toEqual([expect.objectContaining({ cpf: cachedUser.cpf.value })]);
  });

  it("should reset user list cache when creating a new question", async () => {
    const deliveryman = makeUser({
      role: "DELIVERYMAN",
    });

    await usersRepository.create(deliveryman);

    await usersRepository.findMany({ role: "DELIVERYMAN" }, { page: 1 });

    await usersRepository.update(deliveryman);

    const cached = await cacheRepository.get("users:DELIVERYMAN:page:1");

    expect(cached).toBeNull();
  });
});
