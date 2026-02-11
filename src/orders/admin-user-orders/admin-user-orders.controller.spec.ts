import { Test, TestingModule } from '@nestjs/testing';
import { AdminUserOrdersController } from './admin-user-orders.controller';
import { OrdersService } from '../orders.service';

describe('AdminUserOrdersController', () => {
  let controller: AdminUserOrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminUserOrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: {
            findAllByUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AdminUserOrdersController>(AdminUserOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
