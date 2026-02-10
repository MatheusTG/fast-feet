import { z } from "zod";

export const envSchema = z.object({
  DATABASE_URL: z.url(),
  DATABASE_SCHEMA: z.string().optional().default("public"),
  PORT: z.coerce.number().optional().default(3333),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export type Env = z.infer<typeof envSchema>;
