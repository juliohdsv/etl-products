import { prisma } from "../../infra/database/prisma-client.js";
import type { ProductModel } from "../../infra/database/generated/prisma/models.js";

type GetProductsUseCaseResponse = {
  products: ProductModel[];
};

export class GetProductsUseCase {
  constructor() {}

  async execute(): Promise<GetProductsUseCaseResponse> {
    const products = await prisma.product.findMany();

    return {
      products,
    };
  }
}
