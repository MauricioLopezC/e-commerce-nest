import { Prisma } from "@prisma/client";

export type DiscountWithProductsAndCategories = Prisma.DiscountGetPayload<{
  include: {
    products: true,
    categories: true
  }
}>

export type CartItemsWithProductAndCategories = Prisma.CartItemGetPayload<{
  include: {
    product: {
      include: { categories: true }
    }
  }
}>
