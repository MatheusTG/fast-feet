import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { RecipientFactory } from "@test/factories/make-recipient";
import { UserFactory } from "@test/factories/make-user";
import request from "supertest";
import { expect } from "vitest";

describe("Update recipient (E2E)", () => {
  let app: INestApplication;

  let prisma: PrismaService;
  let jwtService: JwtService;

  let userFactory: UserFactory;
  let recipientFactory: RecipientFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, RecipientFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    jwtService = moduleRef.get(JwtService);

    userFactory = moduleRef.get(UserFactory);
    recipientFactory = moduleRef.get(RecipientFactory);

    await app.init();
  });

  test("[PATCH] /recipients/:id", async () => {
    const user = await userFactory.makePrismaUser({
      role: "ADMIN",
    });

    const accessToken = jwtService.sign({ sub: user.id.toString() });

    const recipient = await recipientFactory.makePrismaRecipient({ name: "Old name" });

    const response = await request(app.getHttpServer())
      .patch(`/recipients/${recipient.id.toString()}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "New name",
      });

    const recipientOnDatabase = await prisma.recipient.findUnique({
      where: {
        id: recipient.id.toString(),
      },
    });

    expect(response.statusCode).toEqual(204);
    expect(recipientOnDatabase).toEqual(expect.objectContaining({ name: "New name" }));
  });
});
