import cron from "node-cron";
import { makeCreateProductsUseCase } from "../../app/use-cases/factories/make-create-products-usecase.js";

let isRunning = false;

cron.schedule("*/1 * * * *", async () => {
  if (isRunning) return;

  isRunning = true;

  try {
    const result = await makeCreateProductsUseCase().execute();
    console.log("✅ ETL result:", result);
  } finally {
    isRunning = false;
  }
});
