import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartItemsWithProductAndCategories, DiscountWithProductsAndCategories } from './types/discount-types';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { Discount } from '@prisma/client';
import { ApplicableTo, DiscountType, UpdateDiscountDto } from './dto/update-discount.dto';
import { DiscountApplicationError } from '../errors/discount-application-error';
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
      throw new DiscountApplicationError("We cannot receive discounts or categories if the discount is generally applicable")
    }
    if (creatediscountDto.applicableTo === 'PRODUCT'
      && (!creatediscountDto.products || creatediscountDto.products.length === 0)
    ) {
      throw new DiscountApplicationError("ProductIds list is required")
    }
    if (creatediscountDto.applicableTo === 'CATEGORY'
      && (!creatediscountDto.categories || creatediscountDto.categories.length === 0)) {
      throw new DiscountApplicationError("CategoryIds list is required")
    }

    if (creatediscountDto.startDate
      && creatediscountDto.endDate
      && creatediscountDto.startDate >= creatediscountDto.endDate
    ) {
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

  async calculateDiscounts(
    cartItems: CartItemsWithProductAndCategories[],
    total: number
  ) {
    const appliedDicounts: { id: number, discountAmount: number }[] = []
    let discountAmount = 0;
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
    console.log(discounts)

    if (discounts.length === 0) {
      return {
        appliedDicounts,
        discountAmount,
        finalTotal: total - discountAmount
      }

    }
    //applying general discuounts first because they apply only once per order
    const generalDiscounts = discounts.filter((discount) => discount.applicableTo === 'GENERAL')
    for (const discount of generalDiscounts) {
      if (discount.orderThreshold && discount.orderThreshold > total) continue
      if (discount.maxUses && discount.maxUses < discount.currentUses) continue
      let oneDiscountAmount: number

      if (discount.discountType === 'PERCENTAGE') {
        oneDiscountAmount = (total / 100) * discount.value
        discountAmount += oneDiscountAmount
      } else {
        oneDiscountAmount = discount.value
        discountAmount += oneDiscountAmount
      }
      this.incrementUsage(discount.id)
      appliedDicounts.push({ id: discount.id, discountAmount: oneDiscountAmount })
    }

    //We apply the other applicable discounts if there are any
    for (const cartItem of cartItems) {
      const applicableDiscounts = discounts.filter((discount) => (
        this.isDiscountApplicable(cartItem, discount)
      ))
      //applying all applicable discount for current product, if that discount exists
      for (const discount of applicableDiscounts) {
        if (discount.orderThreshold && discount.orderThreshold > total) continue
        if (discount.maxUses && discount.maxUses < discount.currentUses) continue
        let oneDiscountAmount: number


        if (discount.discountType === 'PERCENTAGE') {
          oneDiscountAmount = (cartItem.product.price / 100) * discount.value
          discountAmount += oneDiscountAmount

        } else {
          oneDiscountAmount = discount.value
          discountAmount += oneDiscountAmount
        }
        this.incrementUsage(discount.id)
        appliedDicounts.push({ id: discount.id, discountAmount: oneDiscountAmount })
      }
    }

    discountAmount = Math.min(discountAmount, total)
    return {
      appliedDicounts,
      discountAmount,
      finalTotal: total - discountAmount
    }
  }

  private async incrementUsage(orderId: number) {
    await this.prisma.discount.update({
      where: {
        id: orderId
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
