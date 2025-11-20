import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { PublicRoute } from 'src/auth/decorators/public-routes.decorator';
import { SearchDto } from './dto/search.dto';
import { query } from 'express';

@Controller('search/products')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get()
  @PublicRoute()
  async searchProduct(@Query() query: SearchDto) {
    const products = await this.searchService.findByName(query);
    return products;
  }

  @Get('test')
  @PublicRoute()
  async searchText(@Query() query: SearchDto) {
    const result = await this.searchService.findByNameOrDescription(query);
    return { result };
  }
}
