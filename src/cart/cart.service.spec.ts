import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { DiscountsService } from 'src/promotions/discounts/discounts.service';

describe('CartService', () => {
  let service: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: PrismaService,
          useValue: {
            cart: {
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: DiscountsService,
          useValue: {
            calculateDiscount: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
