import { Test, TestingModule } from '@nestjs/testing';
import { CartItemsController } from './cart-items.controller';
import { CartItemsService } from './cart-items.service';

describe('CartItemsController', () => {
  let controller: CartItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartItemsController],
      providers: [
        {
          provide: CartItemsService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CartItemsController>(CartItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
