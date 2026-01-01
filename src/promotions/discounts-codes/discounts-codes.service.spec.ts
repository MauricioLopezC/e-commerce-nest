import { Test, TestingModule } from '@nestjs/testing';
import { DiscountsCodesService } from './discounts-codes.service';

describe('DiscountsCodesService', () => {
  let service: DiscountsCodesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiscountsCodesService],
    }).compile();

    service = module.get<DiscountsCodesService>(DiscountsCodesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
