import { z } from "zod";

const successResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean().default(true),
    message: z.string(),
    ...(dataSchema ? { data: dataSchema } : {}),
    timestamp: z.string(),
  });

const errorResponseSchema = z.object({
  success: z.boolean().default(false),
  error: z.object({
    message: z.string(),
  }),
  timestamp: z.string(),
});

export { successResponseSchema, errorResponseSchema };
