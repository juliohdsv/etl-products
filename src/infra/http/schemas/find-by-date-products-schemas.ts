import z from "zod";

import { successResponseSchema } from "./http-schema.js";

const productSchema = z.object({
  id: z.string(),
  title: z.string(),
  idFakeStoreProducts: z.number(),
  price: z.number(),
  image: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const findByDateSchema = z.object({
  from: z.string(),
  to: z.string(),
});

const findByDateProductsSuccessResponseSchema = successResponseSchema(
  z.object({
    items: z.array(productSchema),
    total: z.number(),
  }),
);

type FindByDateQuerySchema = z.infer<typeof findByDateSchema>;

export {
  findByDateSchema,
  type FindByDateQuerySchema,
  findByDateProductsSuccessResponseSchema,
};
