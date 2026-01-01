import { Test, TestingModule } from '@nestjs/testing';
import { UsersFavoritesController } from './usersFavoritesController';
import { FavoritesService } from './favorites.service';

describe('FavoritesController', () => {
  let controller: UsersFavoritesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersFavoritesController],
      providers: [FavoritesService],
    }).compile();

    controller = module.get<UsersFavoritesController>(UsersFavoritesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
