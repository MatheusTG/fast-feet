import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { RecipientFactory } from "@test/factories/make-recipient";
import { UserFactory } from "@test/factories/make-user";
import request from "supertest";

describe("Create recipient (E2E)", () => {
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

  test("[POST] /recipients", async () => {
    const user = await userFactory.makePrismaUser({
      role: "ADMIN",
    });

    const accessToken = jwtService.sign({ sub: user.id.toString() });

    const recipient = await recipientFactory.makePrismaRecipient({ name: "John Doe" });

    const response = await request(app.getHttpServer())
      .post("/recipients")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: recipient.name,
        phone: recipient.phone,
        email: recipient.email,
        address: {
          street: recipient.address.street,
          number: recipient.address.number,
          neighborhood: recipient.address.neighborhood,
          city: recipient.address.city,
          state: recipient.address.state,
          zipCode: recipient.address.zipCode,
          latitude: recipient.address.latitude,
          longitude: recipient.address.longitude,
        },
        deliveryInstructions: recipient.deliveryInstructions,
        isProblematic: recipient.isProblematic,
      });

    expect(response.statusCode).toEqual(201);

    const userOnDatabase = await prisma.recipient.findUnique({
      where: {
        id: recipient.id.toString(),
      },
    });

    expect(userOnDatabase).toEqual(
      expect.objectContaining({
        name: "John Doe",
      })
    );
  });
});
