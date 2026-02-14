import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { EnvService } from "@/infra/env/env.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { UserFactory } from "@test/factories/make-user";
import { compare, hash } from "bcryptjs";
import request from "supertest";

describe("Change user password (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let envService: EnvService;

  let userFactory: UserFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwtService = moduleRef.get(JwtService);
    envService = moduleRef.get(EnvService);

    userFactory = moduleRef.get(UserFactory);

    await app.init();
  });

  test("[PATCH] /users/:id/password", async () => {
    const user = await userFactory.makePrismaUser({
      password: await hash("current_password", envService.get("HASH_SALT_ROUNDS")),
    });

    const accessToken = jwtService.sign({ sub: user.id.toString() });

    const userId = user.id.toString();

    const response = await request(app.getHttpServer())
      .patch(`/users/${userId}/password`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        currentPassword: "current_password",
        newPassword: "new_password",
      });

    expect(response.statusCode).toEqual(204);

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    expect(userOnDatabase).toBeTruthy();
    if (!userOnDatabase) return;

    const isPasswordUpdated = await compare("new_password", userOnDatabase.password);

    expect(isPasswordUpdated).toBe(true);
  });
});
