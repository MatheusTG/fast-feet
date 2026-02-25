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

describe("On answer created (E2E)", () => {
  let app: INestApplication;

  let prisma: PrismaService;
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

    prisma = moduleRef.get(PrismaService);
    jwtService = moduleRef.get(JwtService);

    userFactory = moduleRef.get(UserFactory);
    orderFactory = moduleRef.get(OrderFactory);
    recipientFactory = moduleRef.get(RecipientFactory);

    await app.init();
  });

  it("should send a notification when answer is created", async () => {
    const admin = await userFactory.makePrismaUser({ role: "ADMIN" });

    const token = jwtService.sign({ sub: admin.id.toString() });

    const recipient = await recipientFactory.makePrismaRecipient();

    const order = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
      status: "PENDING",
    });

    await request(app.getHttpServer())
      .patch(`/orders/${order.id}/publish`)
      .set("Authorization", `Bearer ${token}`);

    await vi.waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findMany({
        where: {
          recipientId: recipient.id.toString(),
        },
      });
      expect(notificationOnDatabase).not.toBeNull();
    });
  });
});
