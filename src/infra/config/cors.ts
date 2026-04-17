import type { FastifyInstance } from "fastify";
import Cors from "@fastify/cors";

export const configure = async (app: FastifyInstance) => {
  await app.register(Cors, { origin: "*" });

  app.log.info(
    { layer: "infra", service: "cors", status: "ready" },
    "Cors initialized",
  );
};
