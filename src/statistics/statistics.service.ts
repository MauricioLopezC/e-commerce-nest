import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetTotalSalesByMonthDto } from './dto/get-total-sales.dto';
import { OrderStatus } from 'src/generated/prisma/client';
import { FilledSalesByMonth, SaleByProduct, TotalSalesByMonth } from './types';
import { GetSalesByCategoryDto } from './dto/get-sales-by-category.dto';
import { GetSalesByProductDto } from './dto/get-sales-by-product.dto';
import { GetSalesByUserDto } from './dto/get-sales-by-user.dto';
import {
  getSalesByCategory,
  getSalesByProduct,
} from 'src/generated/prisma/sql';

@Injectable()
export class StatisticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getTotalSalesByMonth(query: GetTotalSalesByMonthDto) {
    const startDate = query.startDate;
    const endDate = query.endDate;
    const result = await this.prisma.$queryRaw<TotalSalesByMonth[]>`
      SELECT
        DATE_TRUNC('month', "createdAt") AS month,
        SUM("finalTotal") AS total_sales
      FROM "Order"
      WHERE "createdAt" BETWEEN ${new Date(startDate)} AND ${new Date(endDate)}
      AND "status" = 'COMPLETED'
      GROUP BY month
      ORDER BY month;
  `;
    return this.fillMissingMonthsInRange(result, startDate, endDate);
  }

  fillMissingMonthsInRange(
    data: TotalSalesByMonth[],
    startDate: Date,
    endDate: Date,
  ): FilledSalesByMonth[] {
    if (startDate > endDate) return [];

    // Crear un Map para lookup rápido de ventas por mes
    const salesMap = new Map<string, number>(
      data.map((item) => [
        item.month.toISOString().slice(0, 7),
        Number(item.total_sales),
      ]),
    );

    const result: FilledSalesByMonth[] = [];

    // Arrancar desde el primer mes del startDate
    const currentDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      1,
    );

    // Iterar hasta llegar al endDate
    while (currentDate <= endDate) {
      const monthKey = currentDate.toISOString().slice(0, 7); // "YYYY-MM"

      result.push({
        month: new Date(currentDate),
        total_sales: salesMap.get(monthKey) ?? 0,
      });

      // Avanzar al siguiente mes
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return result;
  }

  async salesByUser(query: GetSalesByUserDto) {
    const totalSalesByUser = await this.prisma.order.groupBy({
      by: 'userId',
      orderBy: {
        _sum: {
          finalTotal: 'desc',
        },
      },
      where: {
        status: OrderStatus.COMPLETED,
        createdAt: {
          gte: query.startDate,
          lte: query.endDate,
        },
      },
      _sum: {
        finalTotal: true,
      },
      _count: true,
      take: 10,
    });
    //merge with usernames
    const userIds = totalSalesByUser.map((item) => item.userId);
    const users = await this.prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
    });
    const result = totalSalesByUser.map((item) => {
      const user = users.find((user) => user.id === item.userId);
      return { ...item, userName: user.firstName };
    });

    return result;
  }

  async salesByCategory(query: GetSalesByCategoryDto) {
    const startDate = query.startDate;
    const endDate = query.endDate;
    const result = await this.prisma.$queryRawTyped(
      getSalesByCategory(startDate, endDate),
    );
    return result.map((item) => ({ ...item, total: Number(item.total) }));
  }

  async salesByProduct(query: GetSalesByProductDto): Promise<SaleByProduct[]> {
    const startDate = query.startDate;
    const endDate = query.endDate;

    const result = await this.prisma.$queryRawTyped(
      getSalesByProduct(startDate, endDate),
    );
    return result.map((item) => ({ ...item, total: Number(item.total) }));
  }
}
