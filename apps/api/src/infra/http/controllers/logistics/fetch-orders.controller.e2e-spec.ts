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

describe("Update recipient (E2E)", () => {
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

  test("[GET] /orders", async () => {
    const deliveryman1 = await userFactory.makePrismaUser({ role: "DELIVERYMAN" });
    const deliveryman2 = await userFactory.makePrismaUser({ role: "DELIVERYMAN" });
    const accessToken = jwtService.sign({ sub: deliveryman1.id.toString() });

    const recipient = await recipientFactory.makePrismaRecipient();

    const selected_order = await orderFactory.makePrismaOrder({
      notes: "selected_order",
      recipientId: recipient.id,
      deliverymanId: deliveryman1.id,
      deliveryAddress: {
        latitude: -23.55052,
        longitude: -51.4425,
      },
      status: "PENDING",
    });
    await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
      deliverymanId: deliveryman1.id,
      deliveryAddress: {
        latitude: -32.55052,
        longitude: -15.4425,
      },
      status: "PENDING",
    });
    await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
      deliverymanId: deliveryman1.id,
      status: "CANCELED",
    });
    await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
      deliverymanId: deliveryman2.id,
      status: "DELIVERED",
    });

    const response = await request(app.getHttpServer())
      .get("/orders?status=PENDING&userLatitude=-23.55052&userLongitude=-51.44250")
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.orders).toEqual([
      expect.objectContaining({ notes: selected_order.notes, status: "PENDING" }),
    ]);
  });
});
