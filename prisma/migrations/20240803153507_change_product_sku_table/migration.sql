/*
  Warnings:

  - You are about to drop the column `sku` on the `ProductSku` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductSku" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "size" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProductSku_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProductSku" ("color", "createdAt", "id", "productId", "quantity", "size", "updatedAt") SELECT "color", "createdAt", "id", "productId", "quantity", "size", "updatedAt" FROM "ProductSku";
DROP TABLE "ProductSku";
ALTER TABLE "new_ProductSku" RENAME TO "ProductSku";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
