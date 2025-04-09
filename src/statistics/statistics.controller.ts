import { Controller, Get, Query } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { GetTotalSalesByMonthDto } from './dto/get-total-sales.dto';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) { }


  @Get('sales/monthly')
  async getTotalSalesByMonth(@Query() query: GetTotalSalesByMonthDto) {
    return await this.statisticsService.getTotalSalesByMonth(query)
  }

  @Get('sales/by-user')
  async getTotalSalesByUser() {
    return await this.statisticsService.salesByUser()
  }



}
