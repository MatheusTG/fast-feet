import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { cpfGenerator } from "@test/utils/cpf-generator";
import request from "supertest";

describe("Register (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test("[POST] /sessions", async () => {
    const cpf = cpfGenerator();

    const response = await request(app.getHttpServer()).post("/accounts").send({
      cpf,
      name: "John Doe",
      password: "123456",
    });

    expect(response.statusCode).toEqual(201);

    const userOnDatabase = prisma.user.findUnique({
      where: {
        cpf,
      },
    });

    console.log(cpf);

    expect(userOnDatabase).toBeTruthy();
  });
});
