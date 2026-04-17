import type { FastifyRequest, FastifyReply } from "fastify";

import { makeCreateProductsUseCase } from "../../../app/use-cases/factories/make-create-products-usecase.js";

export class CreateProductController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = await makeCreateProductsUseCase().execute();

      return reply.status(201).send({
        success: true,
        message: "Products saved successfully",
        data,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      throw error;
    }
  }
}
