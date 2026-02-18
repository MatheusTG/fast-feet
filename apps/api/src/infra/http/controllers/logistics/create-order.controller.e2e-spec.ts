import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { OrderFactory } from "@test/factories/make-order";
import { RecipientFactory } from "@test/factories/make-recipient";
import { UserFactory } from "@test/factories/make-user";
import request from "supertest";

describe("Create order (E2E)", () => {
  let app: INestApplication;

  let prisma: PrismaService;
  let jwtService: JwtService;

  let userFactory: UserFactory;
  let recipientFactory: RecipientFactory;
  let orderFactory: OrderFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, RecipientFactory, OrderFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    jwtService = moduleRef.get(JwtService);

    userFactory = moduleRef.get(UserFactory);
    recipientFactory = moduleRef.get(RecipientFactory);
    orderFactory = moduleRef.get(OrderFactory);

    await app.init();
  });

  test("[POST] /orders", async () => {
    const user = await userFactory.makePrismaUser({
      role: "ADMIN",
    });

    const recipient = await recipientFactory.makePrismaRecipient();

    const accessToken = jwtService.sign({ sub: user.id.toString() });

    const order = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
    });

    const response = await request(app.getHttpServer())
      .post("/orders")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        recipientId: recipient.id.toString(),
        deliveryAddress: {
          street: order.deliveryAddress.street,
          number: order.deliveryAddress.number,
          neighborhood: order.deliveryAddress.neighborhood,
          city: order.deliveryAddress.city,
          state: order.deliveryAddress.state,
          zipCode: order.deliveryAddress.zipCode,
          latitude: order.deliveryAddress.latitude,
          longitude: order.deliveryAddress.longitude,
        },
        postedAt: order.postedAt,
      });

    expect(response.statusCode).toEqual(201);

    const orderOnDatabase = await prisma.order.findUnique({
      where: {
        id: response.body.id,
      },
    });

    expect(orderOnDatabase).toBeTruthy();
    expect(orderOnDatabase?.recipientId).toEqual(recipient.id.toString());
  });
});
