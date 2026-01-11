import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SearchDto } from './dto/search.dto';
import { fullTextSearch } from '../generated/prisma/sql/fullTextSearch';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async findByName(searchDto: SearchDto) {
    const limit = searchDto.limit;
    const page = searchDto.page;
    const offset = (page - 1) * limit; //for pagination offset
    const productName = searchDto.productName.toLowerCase();
    const products = await this.prisma.product.findMany({
      where: {
        name: {
          contains: productName,
        },
      },
      include: {
        images: true,
      },
      skip: offset,
      take: limit,
    });
    return products;
  }

  /**
   * Format query.productName because fullTextSearch doesn't support words
   * separated with spaces
   */
  async findByNameOrDescription(query: SearchDto) {
    const term = query.productName.split(' ').join(' | ');
    const result = await this.prisma.$queryRawTyped(fullTextSearch(term));
    console.log(result);
    return result;
  }
}
