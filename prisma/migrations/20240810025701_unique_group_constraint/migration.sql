/*
  Warnings:

  - A unique constraint covering the columns `[productSkuId,cartId]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productId,userId]` on the table `Favorites` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CartItem_productSkuId_cartId_key" ON "CartItem"("productSkuId", "cartId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorites_productId_userId_key" ON "Favorites"("productId", "userId");
