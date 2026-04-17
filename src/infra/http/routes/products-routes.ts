import type { FastifyInstance } from "fastify";

import { GetProductsController } from "../controlers/get-products-controller.js";
import { FindByDateProductsController } from "../controlers/find-by-date-products-controller.js";
import { CreateProductController } from "../controlers/create-product-controller.js";
import { errorResponseSchema } from "../schemas/http-schema.js";
import { createProductSuccessResponseSchema } from "../schemas/create-products-schemas.js";
import { getProductsSuccessResponseSchema } from "../schemas/get-products-schemas.js";
import {
  findByDateSchema,
  findByDateProductsSuccessResponseSchema,
} from "../schemas/find-by-date-products-schemas.js";

const createProductController = new CreateProductController();
const getProductsController = new GetProductsController();
const findByDateProductsController = new FindByDateProductsController();

export async function productsRoutes(app: FastifyInstance) {
  app.post(
    "/products",
    {
      schema: {
        tags: ["Products"],
        summary: "Create a products",
        response: {
          201: createProductSuccessResponseSchema,
          400: errorResponseSchema,
          502: errorResponseSchema,
        },
      },
    },
    createProductController.handle.bind(createProductController),
  );

  app.get(
    "/products",
    {
      schema: {
        tags: ["Products"],
        summary: "Get a products",
        response: {
          200: getProductsSuccessResponseSchema,
          400: errorResponseSchema,
        },
      },
    },
    getProductsController.handle.bind(getProductsController),
  );

  app.get(
    "/products/by-date",
    {
      schema: {
        tags: ["Products"],
        ummary: "Get products (optionally filter by date)",
        querystring: findByDateSchema,
        response: {
          200: findByDateProductsSuccessResponseSchema,
          400: errorResponseSchema,
        },
      },
    },
    findByDateProductsController.handle.bind(findByDateProductsController),
  );
}
