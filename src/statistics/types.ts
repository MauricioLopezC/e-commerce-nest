export interface TotalSalesByMonth {
  month: Date
  total_sales: number
}

export interface FilledSalesByMonth {
  month: Date;        // ISO string
  total_sales: number;
}

export interface SalesByCategory {
  id: number
  categoryName: string
  total: number
}

export interface SalesByProduct {
  name: string
  total: number
}
