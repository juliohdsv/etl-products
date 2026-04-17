/*
  Warnings:

  - A unique constraint covering the columns `[id_fake_store_products]` on the table `products` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "products_id_fake_store_products_key" ON "products"("id_fake_store_products");
