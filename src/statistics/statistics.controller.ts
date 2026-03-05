import { Controller, Get, Query } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { GetTotalSalesByMonthDto } from './dto/get-total-sales.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { GetSalesByCategoryDto } from './dto/get-sales-by-category.dto';
import { GetSalesByProductDto } from './dto/get-sales-by-product.dto';
import { GetSalesByUserDto } from './dto/get-sales-by-user.dto';
import {
  SaleByCategory,
  SaleByProduct,
  SaleByUser,
  TotalSalesByMonth,
} from './dto/statistics-response.dto';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Roles(Role.Admin)
  @Get('sales/monthly')
  async getTotalSalesByMonth(
    @Query() query: GetTotalSalesByMonthDto,
  ): Promise<TotalSalesByMonth[]> {
    return await this.statisticsService.getTotalSalesByMonth(query);
  }

  @Roles(Role.Admin)
  @Get('sales/by-user')
  async salesByUser(@Query() query: GetSalesByUserDto): Promise<SaleByUser[]> {
    return await this.statisticsService.salesByUser(query);
  }

  @Roles(Role.Admin)
  @Get('sales/by-category')
  async salesByCategory(
    @Query() query: GetSalesByCategoryDto,
  ): Promise<SaleByCategory[]> {
    return await this.statisticsService.salesByCategory(query);
  }

  @Roles(Role.Admin)
  @Get('sales/by-product')
  async salesByProduct(
    @Query() query: GetSalesByProductDto,
  ): Promise<SaleByProduct[]> {
    return await this.statisticsService.salesByProduct(query);
  }
}
