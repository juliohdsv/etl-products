import z from "zod";
import "dotenv/config";

const envSchema = z.object({
  NODE_PORT: z.coerce.number(),
  NODE_ENV: z.enum(["development", "production", "test"]),
  DATABASE_URL: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.log("Environment variables loaded successfully");
  throw new Error("Environment variables validation failed");
}

export const env = _env.data;
