import { GetProductsUseCase } from "../get-products-usecase.js";

export function makeGetProductsUseCase() {
  const getProductsUseCase = new GetProductsUseCase();

  return getProductsUseCase;
}
