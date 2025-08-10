import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppliedDiscount, CartItemsWithProductAndCategories, DiscountWithProductsAndCategories } from './types/discount-types';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { Discount, Prisma } from '@prisma/client';
import { ApplicableTo, DiscountType, UpdateDiscountDto } from './dto/update-discount.dto';
import { NotFoundError } from 'src/common/errors/not-found-error';
import { ValidationError } from 'src/common/errors/validation-error';
import { ListAllDiscountsDto } from './dto/list-all-discounts.dto';

@Injectable()
export class DiscountsService {
  constructor(
    private prisma: PrismaService,
  ) { }

  async findAll(query: ListAllDiscountsDto) {
    console.log(query)
    const limit = query.limit
    const page = query.page
    const offset = (page - 1) * limit //for pagination offset

    const currentDate = new Date()
    await this.prisma.discount.updateMany({
      where: {
        endDate: {
          lt: currentDate
        }
      },
      data: {
        isActive: false
      }
    })

    const discounts = await this.prisma.discount.findMany({
      include: {
        categories: true,
        products: true
      }
    })

    for (const discount of discounts) {
      if (discount.currentUses && discount.maxUses && discount.currentUses > discount.maxUses) {
        await this.prisma.discount.update({
          where: {
            id: discount.id
          },
          data: {
            isActive: false
          }
        })
      }
    }

    delete query.limit
    delete query.page
    delete query.orderBy
    const finalDiscounts = await this.prisma.discount.findMany({
      skip: offset,
      take: limit,
      where: query,
      include: {
        categories: true,
        products: true
      }
    })

    const aggregate = await this.prisma.discount.aggregate({
      where: query,
      _count: true
    })

    return {
      discounts: finalDiscounts,
      metadata: { ...aggregate }
    }
  }


  async create(body: CreateDiscountDto): Promise<Discount> {
    const { products, categories, ...data } = body
    let connectedProducts: { id: number }[]
    let connectedCategories: { id: number }[]

    if (body.applicableTo === ApplicableTo.GENERAL
      && (body.products || body.categories)
    ) {
      throw new ValidationError("We cannot receive discounts or categories if the discount is generally applicable")
    }

    if (body.applicableTo === ApplicableTo.PRODUCT) {
      if (!body.products || body.products.length === 0) {
        throw new ValidationError("ProductIds list is required")
      }
      connectedProducts = body.products.map((productId) => ({ id: productId }))
    }
    if (body.applicableTo === ApplicableTo.CATEGORY) {
      if (!body.categories || body.categories.length === 0) {
        throw new ValidationError("CategoryIds list is required")
      }
      connectedCategories = body.categories.map((categoryId) => ({ id: categoryId }))
    }

    if (body.startDate >= body.endDate) {
      throw new ValidationError('End date must be greater than the Start Date')
    }

    if (body.discountType === DiscountType.PERCENTAGE && body.value > 100) {
      throw new ValidationError('Only percentages less than 100% are allowed.')
    }

    const discount = await this.prisma.discount.create({
      data: {
        ...data,
        products: {
          connect: connectedProducts
        },
        categories: {
          connect: connectedCategories
        }
      },
    })
    return discount
  }


  async findOne(id: number): Promise<DiscountWithProductsAndCategories> {
    const discount = await this.prisma.discount.findUnique({
      where: {
        id
      },
      include: {
        products: {
          include: {
            images: true
          }
        },
        categories: true
      }
    })
    if (!discount) throw new NotFoundError("discount not found")

    return discount
  }

  async update(id: number, body: UpdateDiscountDto): Promise<Discount> {
    console.log("bodyy", body)
    const discount = await this.prisma.discount.findUnique({
      where: {
        id: id
      }
    })
    if (!discount) throw new NotFoundError("Discount not found")

    //if user update both startDate and endDate
    if (body.startDate
      && body.endDate
      && body.startDate >= body.endDate
    ) {
      throw new ValidationError('End date must be greater than the Start Date')
    }

    //if user update only startDate
    if (body.startDate && !body.endDate && body.startDate >= discount.endDate) {
      throw new ValidationError('End date must be greater than the Start Date')
    }

    //if user update only endDate
    if (body.endDate && !body.startDate && body.endDate <= discount.startDate) {
      throw new ValidationError('End date must be greater than the Start Date')
    }

    if (body.discountType === DiscountType.PERCENTAGE && body.value > 100) {
      throw new ValidationError('Only percentages less than 100% are allowed.')
    }

    const now = new Date()
    if (body.isActive && body.endDate <= now) {
      body.isActive = false
    }

    let products: { id: number }[]
    let categories: { id: number }[]

    if (body.applicableTo === ApplicableTo.PRODUCT) {
      if (!body.products) {
        throw new ValidationError("Send productIds or empty list [] for clear")
      }
      products = body.products?.map(pid => ({ id: pid })) //undefined if there is no productIds
    }

    if (body.applicableTo === ApplicableTo.CATEGORY) {
      if (!body.categories) {
        throw new ValidationError("Send categoriesIds or empty list [] for clear")
      }
      categories = body.categories?.map(cid => ({ id: cid })) //undefined if there is no categoryIds
    }

    console.log(products, categories)

    const updatedDiscount = await this.prisma.discount.update({
      where: { id },
      data: {
        ...body,
        ...(body.products !== undefined && {
          products: {
            set: products
          }
        }),
        ...(body.categories !== undefined && {
          categories: {
            set: categories
          }
        })
      }
    })
    return updatedDiscount
  }


  async delete(id: number): Promise<Discount> {
    try {
      return await this.prisma.discount.delete({
        where: { id }
      })
    } catch (error) {
      throw new NotFoundError("discount not found")
    }
  }

  /**
  * @param cartId user cart id
  * @param total total amount of cart
  * @param isApplying  Flag indicating that the discount is being calculated for an order, 
  * in which case the use of the discount must be recorded in the database.
  */
  async calculateDiscounts(
    cartId: number,
    total: Prisma.Decimal,
    isApplying: boolean
  ) {
    const appliedDiscounts: AppliedDiscount[] = []
    let discountAmount = new Prisma.Decimal(0);
    const now = new Date()
    const discounts = await this.prisma.discount.findMany({
      where: {
        isActive: true,
        endDate: { gt: now }
      },
      include: {
        products: true,
        categories: true
      }
    })
    //console.log(discounts)

    if (discounts.length === 0) {
      return {
        appliedDiscounts,
        discountAmount,
        finalTotal: new Prisma.Decimal(total).minus(discountAmount)
      }

    }
    //applying general discuounts first because they apply only once per order
    const generalDiscounts = discounts.filter((discount) => discount.applicableTo === 'GENERAL')
    for (const discount of generalDiscounts) {
      if (discount.orderThreshold && new Prisma.Decimal(discount.orderThreshold).gt(total)) continue
      if (discount.maxUses && discount.maxUses < discount.currentUses) continue
      let oneDiscountAmount: Prisma.Decimal

      if (discount.discountType === 'PERCENTAGE') {
        oneDiscountAmount = total.divToInt(100).times(discount.value)
        discountAmount = discountAmount.plus(oneDiscountAmount)
      } else {
        oneDiscountAmount = new Prisma.Decimal(discount.value)
        discountAmount = discountAmount.plus(oneDiscountAmount)
      }
      if (isApplying) { this.incrementUsage(discount.id) }
      this.registerDiscount(appliedDiscounts, discount.id, oneDiscountAmount)
    }

    //We apply the other applicable discounts if there are any
    const cartItems = await this.prisma.cartItem.findMany({
      where: {
        cartId
      },
      include: {
        product: {
          include: {
            categories: true,
          },
        }
      }
    })
    //HACK: check if discount is being applied with cartItem quantity,
    //because if i order 2 units of product with discount,discount must be applied to each of the 2 product
    for (const cartItem of cartItems) {
      const applicableDiscounts = discounts.filter((discount) => (
        this.isDiscountApplicable(cartItem, discount)
      ))
      //applying all applicable discount for current product, if that discount exists
      for (const discount of applicableDiscounts) {
        if (discount.orderThreshold && new Prisma.Decimal(discount.orderThreshold).gt(total)) continue
        if (discount.maxUses && discount.maxUses < discount.currentUses) continue
        let oneDiscountAmount: Prisma.Decimal

        if (discount.discountType === 'PERCENTAGE') {
          const price = new Prisma.Decimal(cartItem.product.price)
          const discountValue = new Prisma.Decimal(discount.value)
          oneDiscountAmount = (price.divToInt(100)).times(discountValue)
          discountAmount = discountAmount.plus(oneDiscountAmount.times(cartItem.quantity)) //verificar
        } else {
          oneDiscountAmount = new Prisma.Decimal(discount.value)
          discountAmount = discountAmount.plus(oneDiscountAmount.times(cartItem.quantity))
        }
        if (isApplying) { this.incrementUsage(discount.id) }
        this.registerDiscount(appliedDiscounts, discount.id, oneDiscountAmount)
      }
    }

    discountAmount = Prisma.Decimal.min(discountAmount, total)
    return {
      appliedDiscounts,
      discountAmount,
      finalTotal: total.minus(discountAmount)
    }
  }


  private registerDiscount(
    appliedDiscounts: AppliedDiscount[],
    discountId: number,
    discountAmount: Prisma.Decimal
  ) {
    const existing = appliedDiscounts.find(d => d.discountId === discountId);

    if (existing) {
      existing.appliedTimes += 1;
    } else {
      appliedDiscounts.push({
        discountId,
        discountAmount,
        appliedTimes: 1,
      });
    }
  }

  private async incrementUsage(discountId: number) {
    await this.prisma.discount.update({
      where: {
        id: discountId
      },
      data: {
        currentUses: {
          increment: 1
        }
      }
    })
  }

  private isDiscountApplicable(
    cartItem: CartItemsWithProductAndCategories,
    discount: DiscountWithProductsAndCategories
  ) {
    const productFound = discount.products.some((product) => product.id === cartItem.productId)
    const discountCategories = discount.categories
    const productCategories = cartItem.product.categories
    const productCategoriesIds = new Set(productCategories.map(item => item.id))
    const categoryFound = discountCategories.some((category) => productCategoriesIds.has(category.id))
    if (discount.applicableTo === 'PRODUCT' && productFound) return true;
    if (discount.applicableTo === 'CATEGORY' && categoryFound) return true;
    return false;
  }

}
