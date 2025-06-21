-- @param {String} $1:term
select * from "Product" p
where to_tsvector('spanish', p."name") @@ to_tsquery('spanish', $1)
or to_tsvector('spanish', p."description") @@ to_tsquery('spanish', $1);
