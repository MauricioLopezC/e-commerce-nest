import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetTotalSalesByMonthDto } from './dto/get-total-sales.dto';

@Injectable()
export class StatisticsService {
  constructor(private readonly prisma: PrismaService) { }

  async getTotalSalesByMonth(getTotalSalesByMonthDto: GetTotalSalesByMonthDto) {
    const startDate = getTotalSalesByMonthDto.startDate
    const endDate = getTotalSalesByMonthDto.endDate
    const result = await this.prisma.$queryRaw`
    SELECT 
      strftime('%Y-%m', datetime("createdAt" / 1000, 'unixepoch')) AS month, 
      SUM("finalTotal") AS total_sales
    FROM "Order"
    WHERE datetime("createdAt" / 1000, 'unixepoch') BETWEEN datetime(${startDate}, 'unixepoch') 
      AND datetime(${endDate}, 'unixepoch')
      AND "status" = 'COMPLETED'
    GROUP BY month
    ORDER BY month;
  `;
    return result
  }

}
