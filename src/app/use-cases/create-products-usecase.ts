import { prisma } from "../../infra/database/prisma-client.js";
import { ProductsGateway } from "../../infra/gateways/products-gateway.js";

type CreateProductsUseCaseResponse = {
  total: number;
  inserted: number;
  duplicates: number;
};

type ProductsDTO = {
  idFakeStoreProducts: number;
  title: string;
  price: number;
  image: string;
};

export class CreateProductsUseCase {
  constructor(private productsGateway: ProductsGateway) {}

  async execute(): Promise<CreateProductsUseCaseResponse> {
    const { data: products } = await this.productsGateway.fetchProducts();

    if (!Array.isArray(products) || products.length === 0) {
      return {
        total: 0,
        inserted: 0,
        duplicates: 0,
      };
    }

    const mappedProducts: ProductsDTO[] = products.map((product) => ({
      idFakeStoreProducts: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
    }));

    const result = await prisma.product.createMany({
      data: mappedProducts,
      skipDuplicates: true,
    });

    const total = products.length;
    const inserted = result.count;
    const duplicates = total - inserted;

    return {
      total,
      inserted,
      duplicates,
    };
  }
}
