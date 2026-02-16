import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { RecipientFactory } from "@test/factories/make-recipient";
import { UserFactory } from "@test/factories/make-user";
import request from "supertest";
import { expect } from "vitest";

describe("Fetch recipients (E2E)", () => {
  let app: INestApplication;

  let jwtService: JwtService;

  let userFactory: UserFactory;
  let recipientFactory: RecipientFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, RecipientFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    jwtService = moduleRef.get(JwtService);

    userFactory = moduleRef.get(UserFactory);
    recipientFactory = moduleRef.get(RecipientFactory);

    await app.init();
  });

  test("[GET] /recipients", async () => {
    const user = await userFactory.makePrismaUser({
      role: "ADMIN",
    });

    const accessToken = jwtService.sign({ sub: user.id.toString() });

    await recipientFactory.makePrismaRecipient({ name: "John Doe" });
    await recipientFactory.makePrismaRecipient({ name: "Richard Roe" });

    const response = await request(app.getHttpServer())
      .get("/recipients?name=John")
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.recipients).toEqual([
      expect.objectContaining({
        name: "John Doe",
      }),
    ]);
  });
});
