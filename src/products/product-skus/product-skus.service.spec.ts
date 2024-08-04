import { Test, TestingModule } from '@nestjs/testing';
import { ProductSkusService } from './product-skus.service';

describe('ProductSkusService', () => {
  let service: ProductSkusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductSkusService],
    }).compile();

    service = module.get<ProductSkusService>(ProductSkusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
