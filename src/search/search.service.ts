import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SearchDto } from './dto/search.dto';
import { fullTextSearch } from "@prisma/client/sql"

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) { }

  async findByName(searchDto: SearchDto) {
    const productName = searchDto.productName.toLowerCase()
    const products = await this.prisma.product.findMany({
      where: {
        name: {
          contains: productName
        }
      },
      include: {
        images: true
      }
    })
    console.log(products)
    return products
  }

  /**
  * Format query.productName because fullTextSearch doesn't support words
  * separated with spaces
  */
  async findByNameOrDescription(query: SearchDto) {
    const term = query.productName.split(" ").join(" | ")
    const result = await this.prisma.$queryRawTyped(fullTextSearch(term))
    console.log(result)
    return result;
  }

}
