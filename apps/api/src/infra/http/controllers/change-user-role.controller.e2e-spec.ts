import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { UserFactory } from "@test/factories/make-user";
import request from "supertest";

describe("Change user password (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;

  let userFactory: UserFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwtService = moduleRef.get(JwtService);

    userFactory = moduleRef.get(UserFactory);

    await app.init();
  });

  test("[PATCH] /users/:id/role", async () => {
    const actor = await userFactory.makePrismaUser({
      role: "ADMIN",
    });

    const targetUser = await userFactory.makePrismaUser({
      role: "DELIVERYMAN",
    });

    const accessToken = jwtService.sign({ sub: actor.id.toString() });

    const userId = targetUser.id.toString();

    const response = await request(app.getHttpServer())
      .patch(`/users/${userId}/role`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        role: "ADMIN",
      });

    expect(response.statusCode).toEqual(204);

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    expect(userOnDatabase?.role).toEqual("ADMIN");
  });
});
