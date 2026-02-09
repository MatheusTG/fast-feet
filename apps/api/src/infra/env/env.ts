import { z } from "zod";

export const envSchema = z.object({
  DATABASE_URL: z.url(),
  PORT: z.coerce.number().optional().default(3333),
  NODE_ENV: z.enum(["development", "production"]),
});

export type Env = z.infer<typeof envSchema>;
