import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { EnvModule } from "@/infra/env/env.module";
import { EnvService } from "@/infra/env/env.service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { UserFactory } from "@test/factories/make-user";
import { hash } from "bcryptjs";
import request from "supertest";

describe("Authenticate (E2E)", () => {
  let app: INestApplication;
  let envService: EnvService;

  let userFactory: UserFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, EnvModule],
      providers: [UserFactory, EnvService],
    }).compile();

    app = moduleRef.createNestApplication();
    envService = moduleRef.get(EnvService);

    userFactory = moduleRef.get(UserFactory);

    await app.init();
  });

  test("[POST] /sessions", async () => {
    const plainPassword = "123456";

    const user = await userFactory.makePrismaUser({
      password: await hash(plainPassword, envService.get("HASH_SALT_ROUNDS")),
    });

    const response = await request(app.getHttpServer()).post("/sessions").send({
      cpf: user.cpf.value,
      password: plainPassword,
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      access_token: expect.any(String),
    });
  });
});
