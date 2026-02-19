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

describe("Pick up order (E2E)", () => {
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

  test("[PATCH] /orders/:id/pick-up", async () => {
    const deliveryman = await userFactory.makePrismaUser({ role: "DELIVERYMAN" });
    const token = jwtService.sign({ sub: deliveryman.id.toString() });

    const recipient = await recipientFactory.makePrismaRecipient();

    const order = await orderFactory.makePrismaOrder({
      status: "AVAILABLE_FOR_PICKUP",
      recipientId: recipient.id,
      deliverymanId: deliveryman.id,
    });

    const response = await request(app.getHttpServer())
      .patch(`/orders/${order.id}/pick-up`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(204);
  });
});
