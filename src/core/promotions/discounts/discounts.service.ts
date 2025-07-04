import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppliedDiscount, CartItemsWithProductAndCategories, DiscountWithProductsAndCategories } from './types/discount-types';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { Discount, Prisma } from '@prisma/client';
import { ApplicableTo, DiscountType, UpdateDiscountDto } from './dto/update-discount.dto';
import { ConnectOrDisconnectCategoriesDto, ConnectOrDisconectProductsDto } from './dto/connect-relations.dto';
import { NotFoundError } from 'src/common/errors/not-found-error';
import { ValidationError } from 'src/common/errors/validation-error';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NotAllowedError } from 'src/common/errors/not-allowed-error';

@Injectable()
export class DiscountsService {
  constructor(
    private prisma: PrismaService,
  ) { }

  async findAll(): Promise<DiscountWithProductsAndCategories[]> {
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
    return await this.prisma.discount.findMany({
      include: {
        categories: true,
        products: true
      }
    })
  }


  async create(creatediscountDto: CreateDiscountDto): Promise<Discount> {
    if (creatediscountDto.applicableTo === 'GENERAL'
      && (creatediscountDto.products || creatediscountDto.categories)
    ) {
      throw new ValidationError("We cannot receive discounts or categories if the discount is generally applicable")
    }
    if (creatediscountDto.applicableTo === 'PRODUCT'
      && (!creatediscountDto.products || creatediscountDto.products.length === 0)
    ) {
      throw new ValidationError("ProductIds list is required")
    }
    if (creatediscountDto.applicableTo === 'CATEGORY'
      && (!creatediscountDto.categories || creatediscountDto.categories.length === 0)) {
      throw new ValidationError("CategoryIds list is required")
    }

    if (creatediscountDto.startDate >= creatediscountDto.endDate) {
      throw new ValidationError('End date must be greater than the Start Date')
    }

    if (
      creatediscountDto.discountType === DiscountType.PERCENTAGE
      && creatediscountDto.value > 100
    ) {
      throw new ValidationError('Only percentages less than 100% are allowed.')
    }

    const { products, categories, ...data } = creatediscountDto
    let connectedProducts = creatediscountDto.products?.map((productId) => (
      { id: productId }
    ))
    let connectedCategories = creatediscountDto.categories?.map((categoryId) => (
      { id: categoryId }
    ))

    if (creatediscountDto.applicableTo === 'PRODUCT') connectedCategories = undefined
    if (creatediscountDto.applicableTo === 'CATEGORY') connectedProducts = undefined


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
    return discount
  }

  async update(id: number, updateDiscountDto: UpdateDiscountDto): Promise<Discount> {
    if (updateDiscountDto.startDate
      && updateDiscountDto.endDate
      && updateDiscountDto.startDate >= updateDiscountDto.endDate
    ) {
      throw new ValidationError('End date must be greater than the Start Date')
    }

    if (updateDiscountDto.discountType === DiscountType.PERCENTAGE && updateDiscountDto.value > 100) {
      throw new ValidationError('Only percentages less than 100% are allowed.')
    }

    const discount = await this.prisma.discount.update({
      where: { id },
      data: { ...updateDiscountDto }
    })
    return discount
  }

  async connectProducts(id: number, connectProductDto: ConnectOrDisconectProductsDto) {
    const discount = await this.findOne(id)
    if (!discount) throw new NotFoundError('discount not found')
    if (discount.applicableTo === ApplicableTo.GENERAL || discount.applicableTo === ApplicableTo.CATEGORY) {
      throw new NotAllowedError("You cannot connect products to a discount that is applicable generally or to categories.")
    }

    try {
      const productsToConnect = connectProductDto.productIds
        .map((productId) => ({ id: productId }))

      const updatedDiscount = await this.prisma.discount.update({
        where: { id },
        data: {
          products: {
            connect: productsToConnect
          }
        },
        include: {
          products: true
        }
      })
      return updatedDiscount
    } catch (error) {
      console.log(error)
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2018') {
        throw new NotFoundError(error.message)
      }
    }
  }

  async connectCategories(id: number, connectCategoryDto: ConnectOrDisconnectCategoriesDto) {
    const discount = await this.findOne(id)
    if (!discount) throw new NotFoundError('discount not found')
    if (discount.applicableTo === ApplicableTo.GENERAL || discount.applicableTo === ApplicableTo.PRODUCT) {
      throw new NotAllowedError("You cannot connect categories to a discount that is applicable generally or to products.")
    }

    const categoriesToConnect = connectCategoryDto.categoryIds
      .map((categoryId) => ({ id: categoryId }))

    try {
      const discount = await this.prisma.discount.update({
        where: { id },
        data: {
          categories: {
            connect: categoriesToConnect
          }
        },
        include: {
          categories: true
        }
      })
      return discount
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2018') {
        console.log(error)
        throw new NotFoundError(error.message)
      }
    }
  }

  async disconnectProducts(id: number, disconnectProductsDto: ConnectOrDisconectProductsDto) {
    const productsToDisconnect = disconnectProductsDto.productIds
      .map((productId) => ({ id: productId }))

    const discount = await this.prisma.discount.update({
      where: { id },
      data: {
        products: {
          disconnect: productsToDisconnect
        }
      },
      include: {
        products: true
      }
    })
    return discount
  }

  async disconnectCategories(id: number, disconnectCategoriesDto: ConnectOrDisconnectCategoriesDto) {
    const categoriesToDisconnect = disconnectCategoriesDto.categoryIds.map((categoryId) => ({ id: categoryId }))
    const discount = await this.prisma.discount.update({
      where: { id },
      data: {
        categories: {
          disconnect: categoriesToDisconnect
        }
      },
      include: {
        categories: true
      }
    })
    return discount
  }

  async delete(id: number): Promise<Discount> {
    try {
      return await this.prisma.discount.delete({
        where: { id }
      })
    } catch (error) {
      throw new NotFoundError("Cart item not found")
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
    //
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
          oneDiscountAmount = (new Prisma.Decimal(cartItem.product.price).divToInt(100)).times(new Prisma.Decimal(discount.value))
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
