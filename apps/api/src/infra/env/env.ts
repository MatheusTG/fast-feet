import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().optional().default(3333),

  DATABASE_URL: z.url(),
  DATABASE_SCHEMA: z.string().optional().default("public"),

  HASH_SALT_ROUNDS: z.coerce.number().optional().default(10),

  CLOUDFLARE_ACCOUNT_ID: z.string(),

  AWS_BUCKET_NAME: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),

  EMAIL_HOST: z.string(),
  EMAIL_PORT: z.coerce.number(),
  EMAIL_SECURE: z.enum(["true", "false"]).transform((value) => value === "true"),

  EMAIL_USER: z.email(),
  EMAIL_PASS: z.string(),

  EMAIL_FROM_NAME: z.string(),
  EMAIL_FROM_ADDRESS: z.email(),

  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
});

export type Env = z.infer<typeof envSchema>;
