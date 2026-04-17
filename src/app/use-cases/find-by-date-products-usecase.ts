import { prisma } from "../../infra/database/prisma-client.js";
import type { ProductModel } from "../../infra/database/generated/prisma/models.js";

interface FindByDateProductsUseCaseRequest {
  from: Date;
  to: Date;
}

type FindByDateProductsUseCaseResponse = {
  items: ProductModel[];
  total: number;
};

export class FindByDateProductsUseCase {
  async execute({
    from,
    to,
  }: FindByDateProductsUseCaseRequest): Promise<FindByDateProductsUseCaseResponse> {
    const start = new Date(from);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(to);
    end.setUTCDate(end.getUTCDate() + 1);
    end.setUTCHours(0, 0, 0, 0);

    const products = await prisma.product.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      items: products,
      total: products.length,
    };
  }
}
