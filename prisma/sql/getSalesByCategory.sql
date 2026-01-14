-- @param {DateTime} $1:startDate
-- @param {DateTime} $2:endDate
select c.id, c.name "categoryName", SUM(oi.price*oi.quantity) total
from "OrderItem" oi
         join "Product" p ON p.id = oi."productId"
         join "_CategoryToProduct" cp on cp."B" = p.id
         join "Category" c on cp."A" = c.id
where oi."createdAt" between $1 and $2
group by c.id
order by total desc;

