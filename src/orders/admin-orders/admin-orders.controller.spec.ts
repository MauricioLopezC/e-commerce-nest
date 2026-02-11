import { Test, TestingModule } from '@nestjs/testing';
import { AdminOrdersController } from './admin-orders.controller';
import { OrdersService } from '../orders.service';

describe('AdminOrdersController', () => {
  let controller: AdminOrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminOrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            updateStatus: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AdminOrdersController>(AdminOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
