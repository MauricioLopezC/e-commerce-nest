import { Test, TestingModule } from '@nestjs/testing';
import { ProductSkusService } from './product-skus.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('ProductSkusService', () => {
  let service: ProductSkusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductSkusService,
        {
          provide: PrismaService,
          useValue: {
            productSku: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              createMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ProductSkusService>(ProductSkusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
