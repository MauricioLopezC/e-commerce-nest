import { Test, TestingModule } from '@nestjs/testing';
import { CartItemsService } from './cart-items.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('CartItemsService', () => {
  let service: CartItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartItemsService,
        {
          provide: PrismaService,
          useValue: {
            cartItem: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              findFirst: jest.fn(),
            },
            productSku: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CartItemsService>(CartItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
