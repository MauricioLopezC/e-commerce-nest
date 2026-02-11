import { Test, TestingModule } from '@nestjs/testing';
import { UsersFavoritesController } from './favorites.controler';
import { FavoritesService } from './favorites.service';

describe('FavoritesController', () => {
  let controller: UsersFavoritesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersFavoritesController],
      providers: [
        {
          provide: FavoritesService,
          useValue: {
            // Add mock methods here based on controller usage
            findAllByUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersFavoritesController>(UsersFavoritesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
