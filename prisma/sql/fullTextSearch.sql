select * from "Product" p
where to_tsvector('spanish', p."name") @@ to_tsquery('spanish', ${term})
or to_tsvector('spanish', p."description") @@ to_tsquery('spanish', ${term});
