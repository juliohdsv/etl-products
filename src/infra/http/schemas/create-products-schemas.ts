import z from "zod";

import { successResponseSchema } from "./http-schema.js";

const createProductSuccessResponseSchema = successResponseSchema(
  z.object({
    data: z.object({
      total: z.number(),
      inserted: z.number(),
      duplicates: z.number(),
    }),
  }),
);
export { createProductSuccessResponseSchema };
