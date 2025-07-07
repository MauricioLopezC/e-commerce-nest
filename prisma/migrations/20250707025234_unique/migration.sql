/*
  Warnings:

  - A unique constraint covering the columns `[productId,size,color]` on the table `ProductSku` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProductSku_productId_size_color_key" ON "ProductSku"("productId", "size", "color");
