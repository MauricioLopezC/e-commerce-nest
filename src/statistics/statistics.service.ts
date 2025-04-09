import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetTotalSalesByMonthDto } from './dto/get-total-sales.dto';
import { OrderStatus } from '@prisma/client';

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

  //TODO: add startDate and endDate filters
  async salesByUser() {
    const totalSalesByUser = await this.prisma.order.groupBy({
      by: 'userId',
      orderBy: {
        _sum: {
          finalTotal: 'desc'
        }
      },
      where: {
        status: OrderStatus.COMPLETED
      },
      _sum: {
        finalTotal: true
      },
      _count: true,
      take: 10
    })
    //merge with usernames
    const userIds = totalSalesByUser.map((item) => item.userId)
    const users = await this.prisma.user.findMany({
      where: {
        id: {
          in: userIds
        }
      }
    })
    const result = totalSalesByUser.map((item) => {
      const user = users.find((user) => user.id === item.userId)
      return { ...item, userName: user.firstName }
    })

    return result
  }

}
