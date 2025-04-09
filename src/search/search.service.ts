import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SearchDto } from './dto/search.dto';

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

  async findText() {

  }

}
