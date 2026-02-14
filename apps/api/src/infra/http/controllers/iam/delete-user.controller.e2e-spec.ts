import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { UserFactory } from "@test/factories/make-user";
import request from "supertest";

describe("Delete user (E2E)", () => {
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

  test("[DELETE] /users/:id/delete", async () => {
    const user = await userFactory.makePrismaUser();

    const accessToken = jwtService.sign({ sub: user.id.toString() });

    const userId = user.id.toString();

    const response = await request(app.getHttpServer())
      .delete(`/users/${userId}/delete`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toEqual(204);

    const deletedUser = await prisma.user.findUnique({
      where: {
        id: user.id.toString(),
      },
    });

    expect(deletedUser).toBeNull();
  });
});
