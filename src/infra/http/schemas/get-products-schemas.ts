import z from "zod";

import { successResponseSchema } from "./http-schema.js";

const getProductsSuccessResponseSchema = successResponseSchema(
  z.object({
    total: z.number(),
    inserted: z.number(),
    duplicates: z.number(),
  }),
);
export { getProductsSuccessResponseSchema };
