import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { OrderFactory } from "@test/factories/make-order";
import { RecipientFactory } from "@test/factories/make-recipient";
import { UserFactory } from "@test/factories/make-user";
import request from "supertest";
import { expect } from "vitest";

describe("Upload delivery photo (E2E)", () => {
  let app: INestApplication;

  let jwtService: JwtService;

  let userFactory: UserFactory;
  let orderFactory: OrderFactory;
  let recipientFactory: RecipientFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, OrderFactory, RecipientFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    jwtService = moduleRef.get(JwtService);

    userFactory = moduleRef.get(UserFactory);
    orderFactory = moduleRef.get(OrderFactory);
    recipientFactory = moduleRef.get(RecipientFactory);

    await app.init();
  });

  test("[POST] /orders/:orderId/proof-of-delivery", async () => {
    const user = await userFactory.makePrismaUser({
      role: "ADMIN",
    });

    const accessToken = jwtService.sign({ sub: user.id.toString() });

    const recipient = await recipientFactory.makePrismaRecipient();

    const order = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
      status: "IN_TRANSIT",
    });

    const response = await request(app.getHttpServer())
      .post(`/orders/${order.id}/proof-of-delivery`)
      .set("Authorization", `Bearer ${accessToken}`)
      .attach("file", "./test/e2e/sample-upload.png");

    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual({
      orderId: expect.any(String),
      proofOfDeliveryUrl: expect.any(String),
    });
  });
});
