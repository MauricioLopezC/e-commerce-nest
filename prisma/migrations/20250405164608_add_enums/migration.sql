/*
  Warnings:

  - The `status` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `category` on the `Product` table. All the data in the column will be lost.
  - The `sex` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `discountType` on the `Discount` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `applicableTo` on the `Discount` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `provider` on the `Payment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('MALE', 'FEMALE', 'UNISEX');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('COMPLETED', 'CANCELLED', 'IN_PROGRESS', 'FAILED');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('PAYPAL', 'VISA', 'MASTERCARD', 'APPLE_PAY', 'OTHER');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FIXED');

-- CreateEnum
CREATE TYPE "DiscountApplication" AS ENUM ('PRODUCT', 'CATEGORY', 'ORDER', 'GENERAL');

-- AlterTable
ALTER TABLE "Discount" DROP COLUMN "discountType",
ADD COLUMN     "discountType" "DiscountType" NOT NULL,
DROP COLUMN "applicableTo",
ADD COLUMN     "applicableTo" "DiscountApplication" NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "status",
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'IN_PROGRESS';

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "provider",
ADD COLUMN     "provider" "PaymentProvider" NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "category",
DROP COLUMN "sex",
ADD COLUMN     "sex" "Sex" NOT NULL DEFAULT 'UNISEX';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
