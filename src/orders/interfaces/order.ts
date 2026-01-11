import { OrderItem, Shipping, Payment, User } from 'src/generated/prisma/client';

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
