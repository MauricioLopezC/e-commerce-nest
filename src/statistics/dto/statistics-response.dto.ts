export class TotalSalesByMonth {
  month: Date;
  total_sales: string;
}

export class SalesByCategory {
  id: number;
  categoryName: string;
  total: number;
}

export class SalesByProduct {
  name: string;
  total: number;
}
