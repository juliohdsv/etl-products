import fastify from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import "./infra/jobs/products-cron.js";

import * as Cors from "./infra/config/cors.js";
import * as Swagger from "./infra/config/swagger.js";
import { productsRoutes } from "./infra/http/routes/products-routes.js";
import * as ErrorHandlerGlobal from "./infra/config/error-handler-global.js";

import { env } from "./env.js";

const PORT = env.NODE_PORT;
const ENV = env.NODE_ENV;
const HOST = env.NODE_ENV === "production" ? "0.0.0.0" : "127.0.0.1";

const app = fastify({
  logger:
    ENV === "production"
      ? true
      : {
          customLevels: {
            trace: 10,
            debug: 20,
            log: 30,
            warn: 40,
            error: 50,
          },
          transport: {
            target: "pino-pretty",
            options: {
              colorize: true,
              translateTime: "HH:MM:ss",
              ignore: "pid,hostname",
            },
          },
        },
}).withTypeProvider<ZodTypeProvider>();

async function build() {
  try {
    await Swagger.configure(app);
    await Cors.configure(app);

    ErrorHandlerGlobal.configure(app);

    await app.register(productsRoutes, { prefix: "/api" });

    await app.ready();
    await app.listen({ port: PORT, host: HOST });

    console.log(app.swagger());

    return app;
  } catch (error) {
    app.log.info("Stoping app...");
    app.log.error(error);

    process.exit(1);
  }
}

build();
