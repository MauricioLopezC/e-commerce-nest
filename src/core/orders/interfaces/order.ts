import { OrderItem } from '@prisma/client';
import { Shipping } from '@prisma/client';
import { Payment } from '@prisma/client';
import { User } from '@prisma/client';

interface OrderInterface {
  id: number;
  userId: number;
  status: string;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  orderItems: OrderItem[];
  shipping: Shipping;
  payment: Payment;
  user: User;
}
