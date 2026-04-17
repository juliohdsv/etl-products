import type { FastifyRequest, FastifyReply } from "fastify";

import { makeGetProductsUseCase } from "../../../app/use-cases/factories/make-get-products-usecase.js";

export class GetProductsController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { products } = await makeGetProductsUseCase().execute();

      return reply.status(200).send({
        success: true,
        message: "Products retrieved successfully",
        data: products,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      throw error;
    }
  }
}
