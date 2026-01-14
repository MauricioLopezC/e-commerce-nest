import { Test, TestingModule } from '@nestjs/testing';
import { DiscountsService } from './discounts.service';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ApplicableTo,
  DiscountType,
} from 'src/promotions/discounts/dto/update-discount.dto';
import {
  CartItemsWithProductAndCategories,
  DiscountWithProductsAndCategories,
} from 'src/promotions/discounts/types/discount-types';
import { DiscountApplication, Prisma, Sex } from 'src/generated/prisma/client';

describe('DiscountsService._calculateDiscounts', () => {
  let service: DiscountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiscountsService,
        {
          provide: PrismaService,
          useValue: {
            // we don't need to mock prisma calls for this pure function
          },
        },
      ],
    }).compile();

    service = module.get<DiscountsService>(DiscountsService);
  });

  type MockCategory = Prisma.CategoryGetPayload<any>;
  type MockProductWithCategories = Prisma.ProductGetPayload<{
    include: { categories: true };
  }>;

  const mockCategory1: MockCategory = {
    id: 1,
    name: 'Category A',
    description: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const mockCategory2: MockCategory = {
    id: 2,
    name: 'Category B',
    description: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockProduct1: MockProductWithCategories = {
    id: 1,
    name: 'Product 1',
    description: '',
    price: new Prisma.Decimal(100),
    sex: Sex.UNISEX,
    unitsOnOrder: 0,
    totalCollected: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    categories: [mockCategory1],
  };

  const mockProduct2: MockProductWithCategories = {
    id: 2,
    name: 'Product 2',
    description: '',
    price: new Prisma.Decimal(50),
    sex: Sex.UNISEX,
    unitsOnOrder: 0,
    totalCollected: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    categories: [mockCategory2],
  };

  it('should apply a general percentage discount correctly', () => {
    const discounts: DiscountWithProductsAndCategories[] = [
      {
        id: 1,
        name: '10% OFF',
        description: '',
        discountType: DiscountType.PERCENTAGE,
        value: 10,
        applicableTo: ApplicableTo.GENERAL as DiscountApplication,
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
        products: [],
        categories: [],
        maxUses: null,
        currentUses: 0,
        orderThreshold: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    const cartItems: CartItemsWithProductAndCategories[] = []; // Correctly typed
    const total = new Prisma.Decimal(200);

    const result = service['_calculateDiscounts'](discounts, cartItems, total);

    expect(result.discountAmount.toNumber()).toBe(20);
    expect(result.discountsToIncrement).toEqual([1]);
    expect(result.appliedDiscounts.length).toBe(1);
    expect(result.appliedDiscounts[0].discountId).toBe(1);
  });

  it('should apply a fixed amount product-specific discount with quantity', () => {
    const discounts: DiscountWithProductsAndCategories[] = [
      {
        id: 2,
        name: '5 OFF Product 1',
        description: '',
        discountType: DiscountType.FIXED,
        value: 5,
        applicableTo: ApplicableTo.PRODUCT as DiscountApplication,
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
        products: [mockProduct1],
        categories: [],
        maxUses: null,
        currentUses: 0,
        orderThreshold: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    const cartItems: CartItemsWithProductAndCategories[] = [
      {
        id: 1,
        cartId: 1,
        productId: 1,
        productSkuId: 1,
        quantity: 3,
        product: mockProduct1, // Ensure mockProduct1 matches type of product in CartItemsWithProductAndCategories
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    const total = new Prisma.Decimal(300);

    const result = service['_calculateDiscounts'](discounts, cartItems, total);

    // 5 discount * 3 items = 15
    expect(result.discountAmount.toNumber()).toBe(15);
    expect(result.discountsToIncrement).toEqual([2]);
    expect(result.appliedDiscounts.length).toBe(1);
  });

  it('should apply a category-specific percentage discount', () => {
    const discounts: DiscountWithProductsAndCategories[] = [
      {
        id: 3,
        name: '20% OFF Category B',
        description: '',
        discountType: DiscountType.PERCENTAGE,
        value: 20,
        applicableTo: ApplicableTo.CATEGORY as DiscountApplication,
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
        products: [],
        categories: [mockCategory2],
        maxUses: null,
        currentUses: 0,
        orderThreshold: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    const cartItems: CartItemsWithProductAndCategories[] = [
      {
        id: 2,
        cartId: 1,
        productId: 2,
        productSkuId: 2,
        quantity: 2,
        product: mockProduct2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    const total = new Prisma.Decimal(100);

    const result = service['_calculateDiscounts'](discounts, cartItems, total);

    // Product 2 price is 50. 20% of 50 is 10. Quantity is 2. Total discount is 20.
    expect(result.discountAmount.toNumber()).toBe(20);
    expect(result.discountsToIncrement).toEqual([3]);
    expect(result.appliedDiscounts.length).toBe(1);
  });

  it('should apply multiple discounts (general and specific)', () => {
    const discounts: DiscountWithProductsAndCategories[] = [
      {
        id: 1,
        name: '10% OFF',
        description: '',
        discountType: DiscountType.PERCENTAGE,
        value: 10,
        applicableTo: ApplicableTo.GENERAL as DiscountApplication,
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
        products: [],
        categories: [],
        maxUses: null,
        currentUses: 0,
        orderThreshold: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: '5 OFF Product 1',
        description: '',
        discountType: DiscountType.FIXED,
        value: 5,
        applicableTo: ApplicableTo.PRODUCT as DiscountApplication,
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
        products: [mockProduct1],
        categories: [],
        maxUses: null,
        currentUses: 0,
        orderThreshold: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    const cartItems: CartItemsWithProductAndCategories[] = [
      {
        id: 1,
        cartId: 1,
        productId: 1,
        productSkuId: 1,
        quantity: 1,
        product: mockProduct1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    const total = new Prisma.Decimal(100);

    const result = service['_calculateDiscounts'](discounts, cartItems, total);

    // General 10% on 100 = 10. Product discount of 5 * 1 item = 5. Total = 15.
    expect(result.discountAmount.toNumber()).toBe(15);
    expect(result.discountsToIncrement).toEqual([1, 2]);
    expect(result.appliedDiscounts.length).toBe(2);
  });

  it('should not apply any discounts if conditions are not met', () => {
    const discounts: DiscountWithProductsAndCategories[] = [
      {
        id: 4,
        name: '100 OFF on orders over 500',
        description: '',
        discountType: DiscountType.FIXED,
        value: 100,
        applicableTo: ApplicableTo.GENERAL as DiscountApplication,
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
        products: [],
        categories: [],
        maxUses: null,
        currentUses: 0,
        orderThreshold: 500,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    const cartItems: CartItemsWithProductAndCategories[] = [];
    const total = new Prisma.Decimal(200);

    const result = service['_calculateDiscounts'](discounts, cartItems, total);

    expect(result.discountAmount.toNumber()).toBe(0);
    expect(result.discountsToIncrement).toEqual([]);
    expect(result.appliedDiscounts.length).toBe(0);
  });

  it('should cap the discount amount to the total order value', () => {
    const discounts: DiscountWithProductsAndCategories[] = [
      {
        id: 5,
        name: '200 OFF',
        description: '',
        discountType: DiscountType.FIXED,
        value: 200,
        applicableTo: ApplicableTo.GENERAL as DiscountApplication,
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
        products: [],
        categories: [],
        maxUses: null,
        currentUses: 0,
        orderThreshold: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    const cartItems: CartItemsWithProductAndCategories[] = [];
    const total = new Prisma.Decimal(150);

    const result = service['_calculateDiscounts'](discounts, cartItems, total);

    expect(result.discountAmount.toNumber()).toBe(150);
    expect(result.discountsToIncrement).toEqual([5]);
  });
});
