select u.id, sum(oi.price * oi.quantity) as totalSpent, count(1) as totalOrders
from "OrderItem" oi
         join "Order" o on o.id = oi."orderId"
         join "User" u on u.id = o."userId"
where o.status = 'IN_PROGRESS'::"OrderStatus"
  and u.id = ANY ($1)
group by u.id;