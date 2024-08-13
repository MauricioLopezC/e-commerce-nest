/*
  Warnings:

  - Added the required column `productSkuId` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `CartItem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Ratings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "score" REAL NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Ratings_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Favorites" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Favorites_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Purchases" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "productSkuId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Purchases_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Purchases_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Purchases_productSkuId_fkey" FOREIGN KEY ("productSkuId") REFERENCES "ProductSku" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CartItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cartId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "productSkuId" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CartItem_productSkuId_fkey" FOREIGN KEY ("productSkuId") REFERENCES "ProductSku" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CartItem" ("cartId", "color", "id", "productId", "quantity", "size") SELECT "cartId", "color", "id", "productId", "quantity", "size" FROM "CartItem";
DROP TABLE "CartItem";
ALTER TABLE "new_CartItem" RENAME TO "CartItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
