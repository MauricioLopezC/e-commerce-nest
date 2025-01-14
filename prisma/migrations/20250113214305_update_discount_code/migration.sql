/*
  Warnings:

  - You are about to drop the column `minOrderValue` on the `DiscountCode` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `DiscountCode` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DiscountCode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "discountType" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "maxUses" INTEGER,
    "currentUses" INTEGER NOT NULL DEFAULT 0,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "orderThreshold" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_DiscountCode" ("code", "createdAt", "currentUses", "discountType", "endDate", "id", "isActive", "maxUses", "startDate", "updatedAt", "value") SELECT "code", "createdAt", "currentUses", "discountType", "endDate", "id", "isActive", "maxUses", "startDate", "updatedAt", "value" FROM "DiscountCode";
DROP TABLE "DiscountCode";
ALTER TABLE "new_DiscountCode" RENAME TO "DiscountCode";
CREATE UNIQUE INDEX "DiscountCode_code_key" ON "DiscountCode"("code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
