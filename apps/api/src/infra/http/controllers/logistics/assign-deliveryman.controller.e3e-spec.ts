import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { OrderFactory } from "@test/factories/make-order";
import { RecipientFactory } from "@test/factories/make-recipient";
import { UserFactory } from "@test/factories/make-user";
import request from "supertest";

describe("Assign deliveryman (E2E)", () => {
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

  test("[PATCH] /orders/:id/assign", async () => {
    const admin = await userFactory.makePrismaUser({ role: "ADMIN" });
    const deliveryman = await userFactory.makePrismaUser({ role: "DELIVERYMAN" });

    const token = jwtService.sign({ sub: admin.id.toString() });

    const recipient = await recipientFactory.makePrismaRecipient();

    const order = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
      status: "PENDING",
    });

    const response = await request(app.getHttpServer())
      .patch(`/orders/${order.id}/assign`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        deliverymanId: deliveryman.id.toString(),
      });

    expect(response.statusCode).toBe(204);
  });
});
