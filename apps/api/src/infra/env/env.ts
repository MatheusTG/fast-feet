import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().optional().default(3333),

  DATABASE_URL: z.url(),
  DATABASE_SCHEMA: z.string().optional().default("public"),

  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),

  HASH_SALT_ROUNDS: z.coerce.number().optional().default(10),
});

export type Env = z.infer<typeof envSchema>;
