import { Test, TestingModule } from '@nestjs/testing';
import { ProductSkusController } from './product-skus.controller';
import { ProductSkusService } from './product-skus.service';

describe('ProductSkusController', () => {
  let controller: ProductSkusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductSkusController],
      providers: [ProductSkusService],
    }).compile();

    controller = module.get<ProductSkusController>(ProductSkusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
