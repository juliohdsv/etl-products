import type { FastifyInstance } from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

export const configure = async (app: FastifyInstance) => {
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(swagger, {
    openapi: {
      info: {
        title: "ETL API",
        description: "API documentation",
        version: "1.0.0",
        license: {
          name: "MIT",
        },
      },
      tags: [{ name: "Products" }],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
    transform: jsonSchemaTransform,
  });

  await app.register(swaggerUi, {
    routePrefix: "/api/docs",
    theme: {
      title: "ETL API Documentation",
    },
    uiConfig: {
      docExpansion: "list",
      deepLinking: true,
    },
  });

  app.log.info(
    { layer: "infra", service: "swagger", status: "ready" },
    "Swagger initialized",
  );
};
