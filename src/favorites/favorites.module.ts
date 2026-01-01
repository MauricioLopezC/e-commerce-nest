import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { UsersFavoritesController } from './usersFavoritesController';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MeFavoritesController } from './me-favorites.controller';

@Module({
  controllers: [UsersFavoritesController, MeFavoritesController],
  providers: [FavoritesService],
  imports: [PrismaModule],
})
export class FavoritesModule {}
