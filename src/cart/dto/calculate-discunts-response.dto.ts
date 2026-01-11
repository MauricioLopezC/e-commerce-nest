import { Prisma } from 'src/generated/prisma/client';

interface AppliedDiscount {
  discountId: number;
  discountName: string;
  discountValue: number;
  discountAmount: Prisma.Decimal;
  appliedTimes: number;
}

export interface CalculateDiscountsResponse {
  discountAmount: Prisma.Decimal;
  finalTotal: Prisma.Decimal;
  appliedDiscounts: AppliedDiscount[];
}
