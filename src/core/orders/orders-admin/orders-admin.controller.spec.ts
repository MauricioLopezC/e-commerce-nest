import { Test, TestingModule } from '@nestjs/testing';
import { OrdersAdminController } from './orders-admin.controller';

describe('OrdersAdminController', () => {
  let controller: OrdersAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersAdminController],
    }).compile();

    controller = module.get<OrdersAdminController>(OrdersAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
