import { Controller, Get, Query } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { GetTotalSalesByMonthDto } from './dto/get-total-sales.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { GetSalesByCategoryDto } from './dto/get-sales-by-category.dto';
import { GetSalesByProductDto } from './dto/get-sales-by-product.dto';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) { }


  @Roles(Role.Admin)
  @Get('sales/monthly')
  async getTotalSalesByMonth(@Query() query: GetTotalSalesByMonthDto) {
    return await this.statisticsService.getTotalSalesByMonth(query)
  }

  @Roles(Role.Admin)
  @Get('sales/by-user')
  async salesByUser() {
    return await this.statisticsService.salesByUser()
  }

  @Roles(Role.Admin)
  @Get('sales/by-category')
  async salesByCategory(@Query() query: GetSalesByCategoryDto) {
    return await this.statisticsService.salesByCategory(query)
  }

  @Roles(Role.Admin)
  @Get('sales/by-product')
  async salesByProduct(@Query() query: GetSalesByProductDto) {
    return await this.statisticsService.salesByProduct(query)
  }

}

