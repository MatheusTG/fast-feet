import { PrismaClient } from "@/generated/prisma/client";
import { EnvService } from "@/infra/env/env.service";
import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  constructor(envService: EnvService) {
    const databaseUrl = envService.get("DATABASE_URL");

    if (!databaseUrl) {
      throw new Error("DATABASE_URL is not defined!");
    }

    const pool = new Pool({
      connectionString: databaseUrl,
    });

    const adapter = new PrismaPg(pool);

    super({
      adapter,
      log: envService.get("NODE_ENV") === "development" ? ["warn", "error"] : [],
    });

    this.pool = pool;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool.end();
  }
}
