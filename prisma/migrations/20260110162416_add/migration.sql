-- DropForeignKey
ALTER TABLE "DicountsOnOrders" DROP CONSTRAINT "DicountsOnOrders_discountId_fkey";

-- DropForeignKey
ALTER TABLE "DicountsOnOrders" DROP CONSTRAINT "DicountsOnOrders_orderId_fkey";

-- AddForeignKey
ALTER TABLE "DicountsOnOrders" ADD CONSTRAINT "DicountsOnOrders_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "Discount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DicountsOnOrders" ADD CONSTRAINT "DicountsOnOrders_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
