import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SearchDto } from './dto/search.dto';

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
        categories: true,
      },
      skip: offset,
      take: limit,
    });

    const count = await this.prisma.product.count({
      where: {
        name: {
          contains: productName,
        },
      },
    });

    return {
      products,
      metadata: { _count: count },
    };
  }
}
