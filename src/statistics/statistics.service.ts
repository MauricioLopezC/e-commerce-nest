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
        DATE_TRUNC('month', "createdAt") AS month, 
        SUM("finalTotal") AS total_sales
      FROM "Order"
      WHERE "createdAt" BETWEEN ${new Date(startDate)} AND ${new Date(endDate)}
      AND "status" = 'COMPLETED'
      GROUP BY month
      ORDER BY month;
  `;
    return result
  }

}
