export class TotalSalesByMonth {
  month: Date;
  total_sales: number;
}

export class SaleByCategory {
  id: number;
  categoryName: string;
  total: number;
}

export class SaleByProduct {
  name: string;
  total: number;
}

export interface SaleByUser {
  _count: number;
  userId: number;
  userName: string;
  _sum: {
    finalTotal: number;
  };
}
