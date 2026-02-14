import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { UserFactory } from "@test/factories/make-user";
import request from "supertest";

describe("Fetch users (E2E)", () => {
  let app: INestApplication;
  let jwtService: JwtService;

  let userFactory: UserFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    jwtService = moduleRef.get(JwtService);

    userFactory = moduleRef.get(UserFactory);

    await app.init();
  });

  test("[GET] /users?role=DELIVERYMAN", async () => {
    const user = await userFactory.makePrismaUser({ name: "Jane Smith", role: "ADMIN" });

    const accessToken = jwtService.sign({ sub: user.id.toString() });

    const deliveryman1 = await userFactory.makePrismaUser({
      name: "John Doe",
      role: "DELIVERYMAN",
    });
    const deliveryman2 = await userFactory.makePrismaUser({
      name: "Richard Roe",
      role: "DELIVERYMAN",
    });

    const response = await request(app.getHttpServer())
      .get("/users?role=DELIVERYMAN")
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: deliveryman1.name }),
        expect.objectContaining({ name: deliveryman2.name }),
      ])
    );
  });
});
