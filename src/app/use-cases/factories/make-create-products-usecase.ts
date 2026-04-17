import { CreateProductsUseCase } from "../create-products-usecase.js";
import { ProductsGateway } from "../../../infra/gateways/products-gateway.js";

export function makeCreateProductsUseCase() {
  const productsGateway = new ProductsGateway();
  const createProductsUseCase = new CreateProductsUseCase(productsGateway);

  return createProductsUseCase;
}
