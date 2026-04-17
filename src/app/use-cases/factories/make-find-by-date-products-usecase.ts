import { FindByDateProductsUseCase } from "../find-by-date-products-usecase.js";

export function makeFindByDateProductsUseCase() {
  const findByDateProductsUseCase = new FindByDateProductsUseCase();

  return findByDateProductsUseCase;
}
