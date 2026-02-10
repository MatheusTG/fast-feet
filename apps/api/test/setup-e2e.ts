import { PrismaClient } from "@/generated/prisma/client";
import { envSchema } from "@/infra/env/env";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { Pool } from "pg";

const env = envSchema.parse(process.env);

const SCHEMA = randomUUID();

function generateUniqueDatabaseUrl(schemaId: string) {
  if (!env.DATABASE_URL) {
    throw new Error("Please provide a DATABASE_URL environment variable.");
  }

  const url = new URL(env.DATABASE_URL);

  url.searchParams.set("schema", schemaId);

  return url.toString();
}

const databaseUrl = generateUniqueDatabaseUrl(SCHEMA);

const pool = new Pool({
  connectionString: databaseUrl,
  options: `-c search_path=${SCHEMA}`,
});
const adapter = new PrismaPg(pool, { schema: SCHEMA });

let prisma: PrismaClient;

process.env.DATABASE_URL = databaseUrl;
process.env.DATABASE_SCHEMA = SCHEMA;

beforeAll(async () => {
  execSync("pnpm prisma db push");

  prisma = new PrismaClient({
    adapter,
  });
}, 60_000);

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${SCHEMA}" CASCADE`);
  await prisma.$disconnect();
  await pool.end();
});
