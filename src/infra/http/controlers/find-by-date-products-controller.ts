import type { FastifyRequest, FastifyReply } from "fastify";

import { makeFindByDateProductsUseCase } from "../../../app/use-cases/factories/make-find-by-date-products-usecase.js";
import type { FindByDateQuerySchema } from "../schemas/find-by-date-products-schemas.js";

export class FindByDateProductsController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { from, to } = request.query as FindByDateQuerySchema;

      const data = await makeFindByDateProductsUseCase().execute({
        from: new Date(from),
        to: new Date(to),
      });

      return reply.status(200).send({
        success: true,
        message: "Products retrieved successfully",
        data,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      throw error;
    }
  }
}
