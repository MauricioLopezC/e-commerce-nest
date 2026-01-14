-- @param {DateTime} $1:startDate
-- @param {DateTime} $2:endDate
select p.name, sum(oi.price * oi.quantity) total
from "OrderItem" oi
         join "Product" p ON p.id = oi."productId"
where oi."createdAt" between $1 and $2
group by p.name
order by total desc;
