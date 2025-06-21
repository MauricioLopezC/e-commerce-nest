import { Controller, Get, Query } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { GetTotalSalesByMonthDto } from './dto/get-total-sales.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

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
  async getTotalSalesByUser() {
    return await this.statisticsService.salesByUser()
  }
}

