import type { FastifyInstance } from "fastify";
import { ZodError } from "zod";

import { AppError } from "../../app/errors/app-error.js";
import { env } from "../../env.js";

export const configure = async (app: FastifyInstance) => {
  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        success: false,
        error: {
          message: "Validation error.",
          issues: error.issues.map((issue) => issue.message),
        },
        timestamp: new Date().toISOString(),
      });
    }

    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        success: false,
        error: {
          message: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }

    app.log.error(error);

    if (error instanceof Error && error.name === "ResponseSerializationError") {
      return reply.status(500).send({
        success: false,
        error: {
          message: "Response schema mismatch",
        },
        timestamp: new Date().toISOString(),
      });
    }

    return reply.status(500).send({
      success: false,
      error: {
        message: "Internal server error.",
        stack: env.NODE_ENV === "development" ? error.stack : undefined,
      },

      timestamp: new Date().toISOString(),
    });
  });
};
