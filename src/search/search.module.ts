import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [SearchController],
  providers: [SearchService],
  imports: [PrismaModule],
})
// to implment search functionality switch from sqlte to postgres, which suportt full text search
// or fuzzy find search
export class SearchModule {}
