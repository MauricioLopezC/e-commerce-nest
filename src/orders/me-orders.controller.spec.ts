import { Test, TestingModule } from '@nestjs/testing';
import { MeOrdersController } from './me-orders.controller';
import { OrdersService } from './orders.service';

describe('OrdersController', () => {
  let controller: MeOrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeOrdersController],
      providers: [OrdersService],
    }).compile();

    controller = module.get<MeOrdersController>(MeOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
