import { fakeStoreApi } from "../../lib/fakes-store-api.js";
import { FetchBadGatewayError } from "../../app/errors/fetch-bad-gateway-error.js";

export class ProductsGateway {
  async fetchProducts() {
    try {
      return await fakeStoreApi.get("/products");
    } catch (error) {
      throw new FetchBadGatewayError(
        `An error occurred while fetching products: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
