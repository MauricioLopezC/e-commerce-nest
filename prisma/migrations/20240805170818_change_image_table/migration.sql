/*
  Warnings:

  - You are about to drop the column `productCombId` on the `Images` table. All the data in the column will be lost.
  - Added the required column `productSkuId` to the `Images` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Images" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productSkuId" INTEGER NOT NULL,
    "imgSrc" TEXT NOT NULL,
    CONSTRAINT "Images_productSkuId_fkey" FOREIGN KEY ("productSkuId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Images" ("id", "imgSrc") SELECT "id", "imgSrc" FROM "Images";
DROP TABLE "Images";
ALTER TABLE "new_Images" RENAME TO "Images";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
