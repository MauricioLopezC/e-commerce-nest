--
-- PostgreSQL database dump
--

\restrict vlhpvvWwKUicQa74g3mBHoKe6sgkIlhRPXizJAHAUcbCOtDbBIlDNq9VAUo2P6R

-- Dumped from database version 17.6 (Debian 17.6-1.pgdg13+1)
-- Dumped by pg_dump version 17.6 (Debian 17.6-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: mauro
--

SET SESSION AUTHORIZATION DEFAULT;

ALTER TABLE public."User" DISABLE TRIGGER ALL;

INSERT INTO public."User" (id, "firstName", "lastName", email, "verifiedEmail", password, "isBanned", "profileImage", "createdAt", "updatedAt", role) VALUES (1, 'john', 'doe', 'johndoe@example.com', false, '$2b$10$vHEktXQts9q2fJBuISUm6OKoUTxssQm9fmDrVQX6aNrBhCdSdp1Aa', false, NULL, '2026-01-10 17:14:07.444', '2026-01-10 17:14:07.444', 'ADMIN');
INSERT INTO public."User" (id, "firstName", "lastName", email, "verifiedEmail", password, "isBanned", "profileImage", "createdAt", "updatedAt", role) VALUES (2, 'mauro', 'lopez', 'mauro@example.com', false, '$2b$10$OWEkAfy2b8eTrcO8Kk216uPPYbWNkHaCeZ4pde00.6dNRR0O5Nf.O', false, NULL, '2026-01-10 17:20:22.217', '2026-01-10 17:20:22.217', 'USER');


ALTER TABLE public."User" ENABLE TRIGGER ALL;

--
-- Data for Name: Cart; Type: TABLE DATA; Schema: public; Owner: mauro
--

ALTER TABLE public."Cart" DISABLE TRIGGER ALL;

INSERT INTO public."Cart" (id, "userId", "createdAt", "updatedAt") VALUES (1, 1, '2026-01-10 17:14:07.444', '2026-01-10 17:14:07.444');
INSERT INTO public."Cart" (id, "userId", "createdAt", "updatedAt") VALUES (2, 2, '2026-01-10 17:20:22.217', '2026-01-10 17:20:22.217');


ALTER TABLE public."Cart" ENABLE TRIGGER ALL;

--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: mauro
--

ALTER TABLE public."Product" DISABLE TRIGGER ALL;

INSERT INTO public."Product" (id, name, price, description, "unitsOnOrder", "totalCollected", "createdAt", "updatedAt", sex) VALUES (1, 'campera de cuero', 50000.000000000000000000000000000000, 'campera de cuero linda ', 1, 50000, '2024-10-26 03:47:57', '2026-01-10 17:31:04.947', 'UNISEX');
INSERT INTO public."Product" (id, name, price, description, "unitsOnOrder", "totalCollected", "createdAt", "updatedAt", sex) VALUES (8, 'zapato hombre', 80000.000000000000000000000000000000, 'Experimenta la elegancia y el confort con el zapato de cuero para hombre. Fabricado con cuero de alta calidad, este zapato ofrece una durabilidad excepcional y un acabado impecable. Su diseño clásico y sofisticado lo convierte en la elección perfecta para cualquier ocasión, ya sea una reunión de negocios o un evento formal. La plantilla acolchada y la suela de goma proporcionan una comodidad superior y una tracción fiable, asegurando que cada paso sea firme y cómodo. Ideal para el hombre moderno que valora tanto el estilo como la funcionalidad.', 0, 0, '2024-10-26 03:47:57', '2024-10-26 03:47:57', 'MALE');
INSERT INTO public."Product" (id, name, price, description, "unitsOnOrder", "totalCollected", "createdAt", "updatedAt", sex) VALUES (5, 'remera blanca mujer', 12000.000000000000000000000000000000, 'Descubre la esencia de la elegancia minimalista con nuestra remera blanca de mujer, una prenda imprescindible que combina estilo y confort con sofisticación. Confeccionada con tejido de algodón de alta calidad, esta remera ofrece una suavidad excepcional y una sensación ligera que la hace perfecta para cualquier ocasión.

El diseño femenino de cuello redondo y ajuste favorecedor realza tu figura de manera sutil y elegante. Ya sea que la uses sola para un look fresco y casual o como base para capas durante las estaciones más frías, esta remera se adapta perfectamente a tu estilo personal y a tus necesidades diarias.

Los detalles cuidadosamente elaborados, como las costuras finamente tejidas y el acabado impecable en los bordes, garantizan una durabilidad excepcional y una calidad que perdura con el tiempo. La remera blanca es una pieza versátil que puede ser combinada fácilmente con cualquier conjunto, desde jeans informales hasta faldas elegantes, añadiendo un toque de elegancia simple a tu guardarropa.

Actualiza tu colección de básicos con nuestra remera blanca de mujer, diseñada para ofrecer estilo sin esfuerzo y confort supremo en cada uso.

', 0, 0, '2024-10-26 03:47:57', '2024-10-26 03:47:57', 'FEMALE');
INSERT INTO public."Product" (id, name, price, description, "unitsOnOrder", "totalCollected", "createdAt", "updatedAt", sex) VALUES (9, 'zapato mujer', 70000.000000000000000000000000000000, 'Descubre la perfecta combinación de elegancia y comodidad con el zapato negro para mujer. Confeccionado con materiales de alta calidad, este zapato ofrece un diseño sofisticado y versátil, ideal para cualquier ocasión, desde la oficina hasta una cena elegante. La plantilla acolchada garantiza un confort duradero, mientras que la suela antideslizante proporciona una tracción segura. Perfecto para la mujer moderna que busca un calzado que complemente su estilo con gracia y funcionalidad.', 0, 0, '2024-10-26 03:47:57', '2024-11-02 19:53:30', 'FEMALE');
INSERT INTO public."Product" (id, name, price, description, "unitsOnOrder", "totalCollected", "createdAt", "updatedAt", sex) VALUES (6, 'zapatilla nike', 50000.000000000000000000000000000000, 'Descubre el equilibrio perfecto entre estilo y rendimiento con las zapatillas Nike. Diseñadas para proporcionar una comodidad excepcional, estas zapatillas cuentan con una amortiguación suave y una parte superior transpirable que mantiene tus pies frescos durante todo el día. Su suela de goma ofrece una tracción superior, asegurando estabilidad en cada paso. Ideales tanto para el entrenamiento como para el uso diario, estas zapatillas te acompañarán con estilo y funcionalidad en cada momento.', 0, 0, '2024-10-26 03:47:57', '2025-07-04 22:35:50.073', 'UNISEX');
INSERT INTO public."Product" (id, name, price, description, "unitsOnOrder", "totalCollected", "createdAt", "updatedAt", sex) VALUES (7, 'zapatilla nike airmax', 60000.000000000000000000000000000000, 'Añade un toque de estilo vibrante a tu atuendo con las zapatillas Nike rosas. Diseñadas para ofrecer una comodidad superior, estas zapatillas cuentan con una entresuela amortiguada y una parte superior transpirable que mantiene tus pies frescos durante todo el día. La suela de goma proporciona una tracción excelente, garantizando estabilidad en cada paso. Perfectas tanto para el entrenamiento como para el uso diario, estas zapatillas combinan funcionalidad y moda, haciéndote destacar en cualquier ocasión.', 0, 0, '2024-10-26 03:47:57', '2025-07-29 16:17:17.974', 'UNISEX');
INSERT INTO public."Product" (id, name, price, description, "unitsOnOrder", "totalCollected", "createdAt", "updatedAt", sex) VALUES (3, 'jeans mujer', 10000.000000000000000000000000000000, 'Sumérgete en el lujo y la comodidad con nuestros jeans de mujer diseñados para la mujer moderna y sofisticada. Fabricados con denim de primera calidad, estos jeans combinan elegancia y durabilidad en cada costura.

El corte favorecedor y la silueta ajustada realzan tus curvas naturales con estilo y confianza. Detalles como las costuras finamente detalladas y los acabados artesanales aseguran un ajuste impecable y una sensación de lujo que se adapta a cualquier ocasión.

Disponibles en una paleta de lavados que van desde tonos suaves hasta acabados oscuros y desgastados, nuestros jeans ofrecen versatilidad para complementar tu estilo personal. Desde un look casual de día hasta una salida nocturna elegante, estos jeans son la elección perfecta para quienes aprecian la calidad y el diseño excepcional.

Actualiza tu guardarropa con piezas que perduran y destacan, gracias a nuestros jeans que no solo son una prenda de moda, sino también una declaración de estilo y confort.', 0, 0, '2024-10-26 03:47:57', '2025-07-29 15:44:03.145', 'FEMALE');
INSERT INTO public."Product" (id, name, price, description, "unitsOnOrder", "totalCollected", "createdAt", "updatedAt", sex) VALUES (4, 'remera blanca hombre', 12000.000000000000000000000000000000, 'Eleva tu estilo cotidiano con nuestra remera blanca de hombre, una pieza esencial que combina simplicidad y elegancia con un toque contemporáneo. Fabricada con algodón de primera calidad, esta remera ofrece una sensación suave al tacto y una comodidad excepcional durante todo el día.

El diseño clásico de cuello redondo y ajuste regular garantiza un look atemporal y versátil que se adapta a cualquier ocasión. Perfecta para usar sola en los días cálidos o como base bajo una chaqueta o suéter durante las estaciones más frías, esta remera es una adición imprescindible a tu armario.

Los detalles cuidadosamente elaborados como las costuras reforzadas y el acabado impecable en los bordes aseguran una calidad que perdura lavado tras lavado. La remera blanca, un lienzo en blanco para tu estilo personal, es ideal para aquellos que valoran la simplicidad y la sofisticación sin esfuerzo.

Añade un toque de frescura y elegancia a tu vestuario diario con nuestra remera blanca, diseñada para destacar y complementar tu estilo único.', 2, 24000, '2024-10-26 03:47:57', '2026-01-10 17:31:04.947', 'MALE');
INSERT INTO public."Product" (id, name, price, description, "unitsOnOrder", "totalCollected", "createdAt", "updatedAt", sex) VALUES (2, 'jeans hombre', 15000.000000000000000000000000000000, 'Experimenta el equilibrio perfecto entre estilo y funcionalidad con nuestros jeans de hombre de última generación. Confeccionados con denim premium que combina confort y durabilidad, estos jeans están diseñados para elevar tu estilo cotidiano con un toque de sofisticación.

El corte moderno y ajustado asegura un ajuste favorecedor y cómodo, mientras que los detalles meticulosamente ejecutados como costuras reforzadas y remaches de alta resistencia garantizan una calidad que perdura. Disponibles en una variedad de lavados que van desde el clásico azul hasta tonos más oscuros y desgastados, cada par es una declaración de versatilidad y buen gusto.

Ideal para cualquier ocasión, desde una salida informal hasta un evento más formal, nuestros jeans son el complemento esencial para tu vestuario. Destaca entre la multitud con un estilo auténtico y sin esfuerzo, gracias a nuestros jeans diseñados para resistir las tendencias y el paso del tiempo.', 3, 45000, '2024-10-26 03:47:57', '2026-01-10 17:31:04.947', 'MALE');


ALTER TABLE public."Product" ENABLE TRIGGER ALL;

--
-- Data for Name: ProductSku; Type: TABLE DATA; Schema: public; Owner: mauro
--

ALTER TABLE public."ProductSku" DISABLE TRIGGER ALL;

INSERT INTO public."ProductSku" (id, "productId", size, color, quantity, "createdAt", "updatedAt") VALUES (9, 5, 'S', 'BLANCO', 10, '2024-08-17 03:54:41', '2024-08-17 00:00:00');
INSERT INTO public."ProductSku" (id, "productId", size, color, quantity, "createdAt", "updatedAt") VALUES (10, 5, 'M', 'BLANCO', 10, '2024-08-17 03:54:41', '2024-08-17 00:00:00');
INSERT INTO public."ProductSku" (id, "productId", size, color, quantity, "createdAt", "updatedAt") VALUES (14, 7, '38', 'ROSA', 10, '2024-08-17 03:54:41', '2024-11-07 19:57:38');
INSERT INTO public."ProductSku" (id, "productId", size, color, quantity, "createdAt", "updatedAt") VALUES (15, 8, '38', 'MARRON', 10, '2024-08-17 03:54:41', '2024-10-27 21:42:43');
INSERT INTO public."ProductSku" (id, "productId", size, color, quantity, "createdAt", "updatedAt") VALUES (16, 8, '40', 'MARRON', 10, '2024-08-17 03:54:41', '2024-08-17 00:00:00');
INSERT INTO public."ProductSku" (id, "productId", size, color, quantity, "createdAt", "updatedAt") VALUES (17, 9, '36', 'NEGRO', 10, '2024-08-17 03:54:41', '2024-11-02 19:53:30');
INSERT INTO public."ProductSku" (id, "productId", size, color, quantity, "createdAt", "updatedAt") VALUES (18, 9, '37', 'NEGRO', 10, '2024-08-17 03:54:41', '2024-08-17 00:00:00');
INSERT INTO public."ProductSku" (id, "productId", size, color, quantity, "createdAt", "updatedAt") VALUES (5, 3, '36', 'JEAN', 10, '2024-08-17 03:54:41', '2025-04-08 15:46:47.08');
INSERT INTO public."ProductSku" (id, "productId", size, color, quantity, "createdAt", "updatedAt") VALUES (11, 6, '36', 'ROJO', 10, '2024-08-17 03:54:41', '2025-07-01 05:26:19.742');
INSERT INTO public."ProductSku" (id, "productId", size, color, quantity, "createdAt", "updatedAt") VALUES (12, 6, '40', 'ROJO', 10, '2024-08-17 03:54:41', '2025-07-04 22:35:50.07');
INSERT INTO public."ProductSku" (id, "productId", size, color, quantity, "createdAt", "updatedAt") VALUES (1, 1, 'M', 'NEGRO', 10, '2024-08-18 03:54:41', '2025-07-04 22:35:50.07');
INSERT INTO public."ProductSku" (id, "productId", size, color, quantity, "createdAt", "updatedAt") VALUES (4, 2, '42', 'JEAN', 10, '2024-08-17 03:54:41', '2025-07-04 23:37:35.989');
INSERT INTO public."ProductSku" (id, "productId", size, color, quantity, "createdAt", "updatedAt") VALUES (7, 4, 'L', 'BLANCO', 10, '2024-08-17 03:54:41', '2025-07-04 23:37:35.989');
INSERT INTO public."ProductSku" (id, "productId", size, color, quantity, "createdAt", "updatedAt") VALUES (6, 3, '38', 'JEAN', 10, '2024-08-17 03:54:41', '2025-07-29 15:44:03.138');
INSERT INTO public."ProductSku" (id, "productId", size, color, quantity, "createdAt", "updatedAt") VALUES (13, 7, '36', 'ROSA', 10, '2024-08-17 03:54:41', '2025-07-29 16:17:17.948');
INSERT INTO public."ProductSku" (id, "productId", size, color, quantity, "createdAt", "updatedAt") VALUES (2, 1, 'S', 'NEGRO', 9, '2024-08-17 03:54:41', '2026-01-10 17:31:04.923');
INSERT INTO public."ProductSku" (id, "productId", size, color, quantity, "createdAt", "updatedAt") VALUES (3, 2, '44', 'JEAN', 7, '2024-08-17 03:54:41', '2026-01-10 17:31:04.923');
INSERT INTO public."ProductSku" (id, "productId", size, color, quantity, "createdAt", "updatedAt") VALUES (8, 4, 'XL', 'BLANCO', 8, '2024-08-17 03:54:41', '2026-01-10 17:31:04.923');


ALTER TABLE public."ProductSku" ENABLE TRIGGER ALL;

--
-- Data for Name: CartItem; Type: TABLE DATA; Schema: public; Owner: mauro
--

ALTER TABLE public."CartItem" DISABLE TRIGGER ALL;



ALTER TABLE public."CartItem" ENABLE TRIGGER ALL;

--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: mauro
--

ALTER TABLE public."Category" DISABLE TRIGGER ALL;

INSERT INTO public."Category" (id, name, description, "createdAt", "updatedAt") VALUES (1, 'camperas', '', '2025-01-04 17:20:57', '2025-01-04 00:00:00');
INSERT INTO public."Category" (id, name, description, "createdAt", "updatedAt") VALUES (2, 'zapatillas', '', '2025-01-04 17:23:19', '2025-01-04 00:00:00');
INSERT INTO public."Category" (id, name, description, "createdAt", "updatedAt") VALUES (3, 'zapatos', '', '2025-01-04 17:23:19', '2025-01-04 00:00:00');
INSERT INTO public."Category" (id, name, description, "createdAt", "updatedAt") VALUES (4, 'remeras', '', '2025-01-04 17:23:19', '2025-01-04 00:00:00');
INSERT INTO public."Category" (id, name, description, "createdAt", "updatedAt") VALUES (5, 'pantalones', '', '2025-01-04 17:23:19', '2025-01-04 00:00:00');
INSERT INTO public."Category" (id, name, description, "createdAt", "updatedAt") VALUES (6, 'botines', 'botines', '2025-01-27 23:46:30', '2025-01-27 23:46:30');
INSERT INTO public."Category" (id, name, description, "createdAt", "updatedAt") VALUES (7, 'gorros', 'Gorros', '2025-06-21 22:29:31.106', '2025-06-21 22:29:31.106');


ALTER TABLE public."Category" ENABLE TRIGGER ALL;

--
-- Data for Name: Discount; Type: TABLE DATA; Schema: public; Owner: mauro
--

ALTER TABLE public."Discount" DISABLE TRIGGER ALL;

INSERT INTO public."Discount" (id, name, description, value, "startDate", "endDate", "orderThreshold", "maxUses", "currentUses", "isActive", "createdAt", "updatedAt", "discountType", "applicableTo") VALUES (4, 'descuento remeras', 'descuento en las remeras', 5, '2025-07-01 04:32:32.986', '2025-07-24 03:00:00', 0, NULL, 0, false, '2025-07-01 04:37:24.23', '2026-01-10 17:41:28.224', 'PERCENTAGE', 'CATEGORY');
INSERT INTO public."Discount" (id, name, description, value, "startDate", "endDate", "orderThreshold", "maxUses", "currentUses", "isActive", "createdAt", "updatedAt", "discountType", "applicableTo") VALUES (1, 'black friday', 'descuento por el back friday', 4, '2025-06-25 23:09:21.62', '2025-07-10 03:00:00', 0, NULL, 0, false, '2025-06-25 23:12:46.86', '2026-01-10 17:41:28.224', 'PERCENTAGE', 'GENERAL');
INSERT INTO public."Discount" (id, name, description, value, "startDate", "endDate", "orderThreshold", "maxUses", "currentUses", "isActive", "createdAt", "updatedAt", "discountType", "applicableTo") VALUES (6, 'descuento invierno', 'Descuento en pantalones, caperas y gorros', 10, '2025-07-29 02:22:18.935', '2025-08-03 03:00:00', 0, NULL, 0, false, '2025-07-29 02:23:14.588', '2026-01-10 17:41:28.224', 'PERCENTAGE', 'CATEGORY');


ALTER TABLE public."Discount" ENABLE TRIGGER ALL;

--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: mauro
--

ALTER TABLE public."Order" DISABLE TRIGGER ALL;

INSERT INTO public."Order" (id, "userId", total, "discountAmount", "finalTotal", "createdAt", "updatedAt", status) VALUES (1, 2, 119000.000000000000000000000000000000, 0.000000000000000000000000000000, 119000.000000000000000000000000000000, '2026-01-10 17:31:04.919', '2026-01-10 17:31:04.919', 'IN_PROGRESS');


ALTER TABLE public."Order" ENABLE TRIGGER ALL;

--
-- Data for Name: DicountsOnOrders; Type: TABLE DATA; Schema: public; Owner: mauro
--

ALTER TABLE public."DicountsOnOrders" DISABLE TRIGGER ALL;



ALTER TABLE public."DicountsOnOrders" ENABLE TRIGGER ALL;

--
-- Data for Name: DiscountCode; Type: TABLE DATA; Schema: public; Owner: mauro
--

ALTER TABLE public."DiscountCode" DISABLE TRIGGER ALL;



ALTER TABLE public."DiscountCode" ENABLE TRIGGER ALL;

--
-- Data for Name: Favorites; Type: TABLE DATA; Schema: public; Owner: mauro
--

ALTER TABLE public."Favorites" DISABLE TRIGGER ALL;

INSERT INTO public."Favorites" (id, "productId", "userId", "createdAt", "updatedAt") VALUES (1, 1, 1, '2026-01-10 17:15:59.486', '2026-01-10 17:15:59.486');
INSERT INTO public."Favorites" (id, "productId", "userId", "createdAt", "updatedAt") VALUES (2, 4, 1, '2026-01-10 17:16:05.003', '2026-01-10 17:16:05.003');
INSERT INTO public."Favorites" (id, "productId", "userId", "createdAt", "updatedAt") VALUES (3, 6, 1, '2026-01-10 17:16:09.839', '2026-01-10 17:16:09.839');


ALTER TABLE public."Favorites" ENABLE TRIGGER ALL;

--
-- Data for Name: Image; Type: TABLE DATA; Schema: public; Owner: mauro
--

ALTER TABLE public."Image" DISABLE TRIGGER ALL;

INSERT INTO public."Image" (id, "imgSrc", "productId", "productSkuId") VALUES (1, 'e-commerce/tljlwrlm3ro6zu6zhvah', 1, 1);
INSERT INTO public."Image" (id, "imgSrc", "productId", "productSkuId") VALUES (2, 'e-commerce/lnbv7mcvpinptog901kl', 1, 2);
INSERT INTO public."Image" (id, "imgSrc", "productId", "productSkuId") VALUES (3, 'e-commerce/qdbkp9qh13bd9us9jxfh', 2, 3);
INSERT INTO public."Image" (id, "imgSrc", "productId", "productSkuId") VALUES (4, 'e-commerce/bfgfkwahccbfztchykyg', 2, 4);
INSERT INTO public."Image" (id, "imgSrc", "productId", "productSkuId") VALUES (5, 'e-commerce/i6v9c8uk6lbgrxutznge', 3, 5);
INSERT INTO public."Image" (id, "imgSrc", "productId", "productSkuId") VALUES (6, 'e-commerce/hhyolcfjryxc3qc4srms', 3, 6);
INSERT INTO public."Image" (id, "imgSrc", "productId", "productSkuId") VALUES (7, 'e-commerce/l0n3o5kcqcebkswt0f6p', 4, 7);
INSERT INTO public."Image" (id, "imgSrc", "productId", "productSkuId") VALUES (8, 'e-commerce/jofi0evchuagymigy8sh', 4, 8);
INSERT INTO public."Image" (id, "imgSrc", "productId", "productSkuId") VALUES (9, 'e-commerce/hy7zktci8oqupzrdzvvk', 5, 9);
INSERT INTO public."Image" (id, "imgSrc", "productId", "productSkuId") VALUES (10, 'e-commerce/gwrtpl3l5j0frmfahpuc', 5, 10);
INSERT INTO public."Image" (id, "imgSrc", "productId", "productSkuId") VALUES (11, 'e-commerce/wf2kea26yoae5nls1anx', 6, 11);
INSERT INTO public."Image" (id, "imgSrc", "productId", "productSkuId") VALUES (12, 'e-commerce/svmor2gyvbvf3rn49x8g', 6, 12);
INSERT INTO public."Image" (id, "imgSrc", "productId", "productSkuId") VALUES (13, 'e-commerce/jbdiqbh17obwcsuhvrkb', 7, 13);
INSERT INTO public."Image" (id, "imgSrc", "productId", "productSkuId") VALUES (14, 'e-commerce/otjosvs2oiwiyplmzjmh', 7, 14);
INSERT INTO public."Image" (id, "imgSrc", "productId", "productSkuId") VALUES (15, 'e-commerce/ovvszmj1nnuan692sb9b', 8, 15);
INSERT INTO public."Image" (id, "imgSrc", "productId", "productSkuId") VALUES (16, 'e-commerce/qylrc5l6mj5v9rzz9kzz', 8, 16);
INSERT INTO public."Image" (id, "imgSrc", "productId", "productSkuId") VALUES (17, 'e-commerce/fcdfvropmi6owfqnstel', 9, 17);
INSERT INTO public."Image" (id, "imgSrc", "productId", "productSkuId") VALUES (18, 'e-commerce/usg4pagishulsxanm4xx', 9, 18);


ALTER TABLE public."Image" ENABLE TRIGGER ALL;

--
-- Data for Name: OrderItem; Type: TABLE DATA; Schema: public; Owner: mauro
--

ALTER TABLE public."OrderItem" DISABLE TRIGGER ALL;

INSERT INTO public."OrderItem" (id, "orderId", "productId", "productSkuId", quantity, price, "createdAt", "updatedAt") VALUES (1, 1, 1, 2, 1, 50000.000000000000000000000000000000, '2026-01-10 17:31:04.919', '2026-01-10 17:31:04.919');
INSERT INTO public."OrderItem" (id, "orderId", "productId", "productSkuId", quantity, price, "createdAt", "updatedAt") VALUES (2, 1, 2, 3, 3, 15000.000000000000000000000000000000, '2026-01-10 17:31:04.919', '2026-01-10 17:31:04.919');
INSERT INTO public."OrderItem" (id, "orderId", "productId", "productSkuId", quantity, price, "createdAt", "updatedAt") VALUES (3, 1, 4, 8, 2, 12000.000000000000000000000000000000, '2026-01-10 17:31:04.919', '2026-01-10 17:31:04.919');


ALTER TABLE public."OrderItem" ENABLE TRIGGER ALL;

--
-- Data for Name: Payment; Type: TABLE DATA; Schema: public; Owner: mauro
--

ALTER TABLE public."Payment" DISABLE TRIGGER ALL;

INSERT INTO public."Payment" (id, "orderId", "createdAt", "updatedAt", provider) VALUES (1, 1, '2026-01-10 17:31:04.919', '2026-01-10 17:31:04.919', 'VISA');


ALTER TABLE public."Payment" ENABLE TRIGGER ALL;

--
-- Data for Name: Shipping; Type: TABLE DATA; Schema: public; Owner: mauro
--

ALTER TABLE public."Shipping" DISABLE TRIGGER ALL;

INSERT INTO public."Shipping" (id, "orderId", country, city, "postalCode", address, "createdAt", "updatedAt") VALUES (1, 1, 'Argentina', 'salta', '4400', 'Fulano Castro 1666', '2026-01-10 17:31:04.919', '2026-01-10 17:31:04.919');


ALTER TABLE public."Shipping" ENABLE TRIGGER ALL;

--
-- Data for Name: UserReview; Type: TABLE DATA; Schema: public; Owner: mauro
--

ALTER TABLE public."UserReview" DISABLE TRIGGER ALL;



ALTER TABLE public."UserReview" ENABLE TRIGGER ALL;

--
-- Data for Name: _CategoryToDiscount; Type: TABLE DATA; Schema: public; Owner: mauro
--

ALTER TABLE public."_CategoryToDiscount" DISABLE TRIGGER ALL;

INSERT INTO public."_CategoryToDiscount" ("A", "B") VALUES (4, 4);
INSERT INTO public."_CategoryToDiscount" ("A", "B") VALUES (1, 6);
INSERT INTO public."_CategoryToDiscount" ("A", "B") VALUES (5, 6);
INSERT INTO public."_CategoryToDiscount" ("A", "B") VALUES (7, 6);


ALTER TABLE public."_CategoryToDiscount" ENABLE TRIGGER ALL;

--
-- Data for Name: _CategoryToProduct; Type: TABLE DATA; Schema: public; Owner: mauro
--

ALTER TABLE public."_CategoryToProduct" DISABLE TRIGGER ALL;

INSERT INTO public."_CategoryToProduct" ("A", "B") VALUES (1, 1);
INSERT INTO public."_CategoryToProduct" ("A", "B") VALUES (5, 2);
INSERT INTO public."_CategoryToProduct" ("A", "B") VALUES (5, 3);
INSERT INTO public."_CategoryToProduct" ("A", "B") VALUES (4, 4);
INSERT INTO public."_CategoryToProduct" ("A", "B") VALUES (4, 5);
INSERT INTO public."_CategoryToProduct" ("A", "B") VALUES (2, 6);
INSERT INTO public."_CategoryToProduct" ("A", "B") VALUES (2, 7);
INSERT INTO public."_CategoryToProduct" ("A", "B") VALUES (3, 8);
INSERT INTO public."_CategoryToProduct" ("A", "B") VALUES (3, 9);


ALTER TABLE public."_CategoryToProduct" ENABLE TRIGGER ALL;

--
-- Data for Name: _DiscountToProduct; Type: TABLE DATA; Schema: public; Owner: mauro
--

ALTER TABLE public."_DiscountToProduct" DISABLE TRIGGER ALL;



ALTER TABLE public."_DiscountToProduct" ENABLE TRIGGER ALL;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: mauro
--

ALTER TABLE public._prisma_migrations DISABLE TRIGGER ALL;

INSERT INTO public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) VALUES ('d765cea2-cb4e-4a1f-8339-9c2f062a1324', 'a9ed9c305a4603354baae862cc002bcc6b713218f4d91024928f801ade4f5e29', '2025-04-05 23:48:03.400632+00', '20250405162347_init', NULL, NULL, '2025-04-05 23:48:03.370909+00', 1);
INSERT INTO public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) VALUES ('9610d6f1-4db8-42bd-97b0-8930f04b8980', '278a9f799892b4702f9cf1750861a1b0c13a01ae264cbab3cce9aaefc2edb60b', '2025-04-05 23:48:03.408283+00', '20250405164608_add_enums', NULL, NULL, '2025-04-05 23:48:03.402144+00', 1);
INSERT INTO public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) VALUES ('5a966c46-e450-4cf9-8f37-90ae5b2ec820', 'e3eeb286e8ed1e168a98a450666be9f130503c5d06280ef92e4f1148fd1d15f5', '2025-04-05 23:48:03.416499+00', '20250405185020_change_price_to_decimal', NULL, NULL, '2025-04-05 23:48:03.409414+00', 1);
INSERT INTO public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) VALUES ('57984d92-88b1-4c28-b33c-63b48ce3fa75', 'ee32cf9bbbb43231d302696857940a0d721cc34bf6bdbe47ff28fe04d73fd860', '2025-07-07 02:52:34.352947+00', '20250707025234_unique', NULL, NULL, '2025-07-07 02:52:34.34342+00', 1);
INSERT INTO public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) VALUES ('bfe7ff10-ad77-4304-b7ec-abd34452f9cb', '057b544d60515f5dd6d3c45bb346e794c402f0530361be96eeb8b8d6a002be07', '2026-01-10 16:24:16.811061+00', '20260110162416_add', NULL, NULL, '2026-01-10 16:24:16.805862+00', 1);


ALTER TABLE public._prisma_migrations ENABLE TRIGGER ALL;

--
-- Name: CartItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mauro
--

SELECT pg_catalog.setval('public."CartItem_id_seq"', 3, true);


--
-- Name: Cart_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mauro
--

SELECT pg_catalog.setval('public."Cart_id_seq"', 2, true);


--
-- Name: Category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mauro
--

SELECT pg_catalog.setval('public."Category_id_seq"', 13, true);


--
-- Name: DiscountCode_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mauro
--

SELECT pg_catalog.setval('public."DiscountCode_id_seq"', 1, false);


--
-- Name: Discount_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mauro
--

SELECT pg_catalog.setval('public."Discount_id_seq"', 11, true);


--
-- Name: Favorites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mauro
--

SELECT pg_catalog.setval('public."Favorites_id_seq"', 3, true);


--
-- Name: Image_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mauro
--

SELECT pg_catalog.setval('public."Image_id_seq"', 26, true);


--
-- Name: OrderItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mauro
--

SELECT pg_catalog.setval('public."OrderItem_id_seq"', 3, true);


--
-- Name: Order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mauro
--

SELECT pg_catalog.setval('public."Order_id_seq"', 1, true);


--
-- Name: Payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mauro
--

SELECT pg_catalog.setval('public."Payment_id_seq"', 1, true);


--
-- Name: ProductSku_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mauro
--

SELECT pg_catalog.setval('public."ProductSku_id_seq"', 27, true);


--
-- Name: Product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mauro
--

SELECT pg_catalog.setval('public."Product_id_seq"', 11, true);


--
-- Name: Shipping_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mauro
--

SELECT pg_catalog.setval('public."Shipping_id_seq"', 1, true);


--
-- Name: UserReview_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mauro
--

SELECT pg_catalog.setval('public."UserReview_id_seq"', 1, false);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mauro
--

SELECT pg_catalog.setval('public."User_id_seq"', 2, true);


--
-- PostgreSQL database dump complete
--

\unrestrict vlhpvvWwKUicQa74g3mBHoKe6sgkIlhRPXizJAHAUcbCOtDbBIlDNq9VAUo2P6R

