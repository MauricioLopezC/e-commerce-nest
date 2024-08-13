/*
  Warnings:

  - You are about to drop the column `color` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `CartItem` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CartItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cartId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "productSkuId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CartItem_productSkuId_fkey" FOREIGN KEY ("productSkuId") REFERENCES "ProductSku" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CartItem" ("cartId", "createdAt", "id", "productId", "productSkuId", "quantity", "updatedAt") SELECT "cartId", "createdAt", "id", "productId", "productSkuId", "quantity", "updatedAt" FROM "CartItem";
DROP TABLE "CartItem";
ALTER TABLE "new_CartItem" RENAME TO "CartItem";
CREATE UNIQUE INDEX "CartItem_productSkuId_cartId_key" ON "CartItem"("productSkuId", "cartId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
