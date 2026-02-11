import { Test, TestingModule } from '@nestjs/testing';
import { MeFavoritesController } from './me-favorites.controller';
import { FavoritesService } from './favorites.service';

describe('MeFavoritesController', () => {
  let controller: MeFavoritesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeFavoritesController],
      providers: [
        {
          provide: FavoritesService,
          useValue: {
            create: jest.fn(),
            findAllByUser: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MeFavoritesController>(MeFavoritesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
