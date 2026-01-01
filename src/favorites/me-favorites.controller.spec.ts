import { Test, TestingModule } from '@nestjs/testing';
import { MeFavoritesController } from './me-favorites.controller';

describe('MeFavoritesController', () => {
  let controller: MeFavoritesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeFavoritesController],
    }).compile();

    controller = module.get<MeFavoritesController>(MeFavoritesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
