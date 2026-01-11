import {
  PrismaClient,
  Role,
  Sex,
  OrderStatus,
  PaymentProvider,
  DiscountType,
  DiscountApplication,
} from 'src/generated/prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Setup Prisma Client with the required adapter
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log(`Start seeding ...`);

  // Truncate all tables to ensure a clean slate
  // Note: This order is important to respect foreign key constraints
  console.log('Deleting existing data...');
  await prisma.discountsOnOrders.deleteMany({});
  await prisma.userReview.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.image.deleteMany({});
  await prisma.favorite.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.productSku.deleteMany({});
  await prisma.shipping.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.discount.deleteMany({});
  console.log('Existing data deleted.');

  // Seed Users
  console.log('Seeding users...');
  await prisma.user.createMany({
    data: [
      {
        id: 1,
        firstName: 'john',
        lastName: 'doe',
        email: 'johndoe@example.com',
        verifiedEmail: false,
        password:
          '$2b$10$vHEktXQts9q2fJBuISUm6OKoUTxssQm9fmDrVQX6aNrBhCdSdp1Aa',
        isBanned: false,
        profileImage: null,
        createdAt: new Date('2026-01-10 17:14:07.444'),
        updatedAt: new Date('2026-01-10 17:14:07.444'),
        role: Role.ADMIN,
      },
      {
        id: 2,
        firstName: 'mauro',
        lastName: 'lopez',
        email: 'mauro@example.com',
        verifiedEmail: false,
        password:
          '$2b$10$OWEkAfy2b8eTrcO8Kk216uPPYbWNkHaCeZ4pde00.6dNRR0O5Nf.O',
        isBanned: false,
        profileImage: null,
        createdAt: new Date('2026-01-10 17:20:22.217'),
        updatedAt: new Date('2026-01-10 17:20:22.217'),
        role: Role.USER,
      },
    ],
  });

  // Seed Carts
  console.log('Seeding carts...');
  await prisma.cart.createMany({
    data: [
      {
        id: 1,
        userId: 1,
        createdAt: new Date('2026-01-10 17:14:07.444'),
        updatedAt: new Date('2026-01-10 17:14:07.444'),
      },
      {
        id: 2,
        userId: 2,
        createdAt: new Date('2026-01-10 17:20:22.217'),
        updatedAt: new Date('2026-01-10 17:20:22.217'),
      },
    ],
  });

  // Seed Categories
  console.log('Seeding categories...');
  await prisma.category.createMany({
    data: [
      {
        id: 1,
        name: 'camperas',
        description: '',
        createdAt: new Date('2025-01-04 17:20:57'),
        updatedAt: new Date('2025-01-04 00:00:00'),
      },
      {
        id: 2,
        name: 'zapatillas',
        description: '',
        createdAt: new Date('2025-01-04 17:23:19'),
        updatedAt: new Date('2025-01-04 00:00:00'),
      },
      {
        id: 3,
        name: 'zapatos',
        description: '',
        createdAt: new Date('2025-01-04 17:23:19'),
        updatedAt: new Date('2025-01-04 00:00:00'),
      },
      {
        id: 4,
        name: 'remeras',
        description: '',
        createdAt: new Date('2025-01-04 17:23:19'),
        updatedAt: new Date('2025-01-04 00:00:00'),
      },
      {
        id: 5,
        name: 'pantalones',
        description: '',
        createdAt: new Date('2025-01-04 17:23:19'),
        updatedAt: new Date('2025-01-04 00:00:00'),
      },
      {
        id: 6,
        name: 'botines',
        description: 'botines',
        createdAt: new Date('2025-01-27 23:46:30'),
        updatedAt: new Date('2025-01-27 23:46:30'),
      },
      {
        id: 7,
        name: 'gorros',
        description: 'Gorros',
        createdAt: new Date('2025-06-21 22:29:31.106'),
        updatedAt: new Date('2025-06-21 22:29:31.106'),
      },
    ],
  });

  // Seed Products
  console.log('Seeding products...');
  await prisma.product.createMany({
    data: [
      {
        id: 1,
        name: 'campera de cuero',
        price: 50000.0,
        description: 'campera de cuero linda ',
        unitsOnOrder: 1,
        totalCollected: 50000,
        createdAt: new Date('2024-10-26 03:47:57'),
        updatedAt: new Date('2026-01-10 17:31:04.947'),
        sex: Sex.UNISEX,
      },
      {
        id: 8,
        name: 'zapato hombre',
        price: 80000.0,
        description:
          'Experimenta la elegancia y el confort con el zapato de cuero para hombre. Fabricado con cuero de alta calidad, este zapato ofrece una durabilidad excepcional y un acabado impecable. Su diseño clásico y sofisticado lo convierte en la elección perfecta para cualquier ocasión, ya sea una reunión de negocios o un evento formal. La plantilla acolchada y la suela de goma proporcionan una comodidad superior y una tracción fiable, asegurando que cada paso sea firme y cómodo. Ideal para el hombre moderno que valora tanto el estilo como la funcionalidad.',
        unitsOnOrder: 0,
        totalCollected: 0,
        createdAt: new Date('2024-10-26 03:47:57'),
        updatedAt: new Date('2024-10-26 03:47:57'),
        sex: Sex.MALE,
      },
      {
        id: 5,
        name: 'remera blanca mujer',
        price: 12000.0,
        description:
          'Descubre la esencia de la elegancia minimalista con nuestra remera blanca de mujer, una prenda imprescindible que combina estilo y confort con sofisticación. Confeccionada con tejido de algodón de alta calidad, esta remera ofrece una suavidad excepcional y una sensación ligera que la hace perfecta para cualquier ocasión. El diseño femenino de cuello redondo y ajuste favorecedor realza tu figura de manera sutil y elegante. Ya sea que la uses sola para un look fresco y casual o como base para capas durante las estaciones más frías, esta remera se adapta perfectamente a tu estilo personal y a tus necesidades diarias. Los detalles cuidadosamente elaborados, como las costuras finamente tejidas y el acabado impecable en los bordes, garantizan una durabilidad excepcional y una calidad que perdura con el tiempo. La remera blanca es una pieza versátil que puede ser combinada fácilmente con cualquier conjunto, desde jeans informales hasta faldas elegantes, añadiendo un toque de elegancia simple a tu guardarropa. Actualiza tu colección de básicos con nuestra remera blanca de mujer, diseñada para ofrecer estilo sin esfuerzo y confort supremo en cada uso.',
        unitsOnOrder: 0,
        totalCollected: 0,
        createdAt: new Date('2024-10-26 03:47:57'),
        updatedAt: new Date('2024-10-26 03:47:57'),
        sex: Sex.FEMALE,
      },
      {
        id: 9,
        name: 'zapato mujer',
        price: 70000.0,
        description:
          'Descubre la perfecta combinación de elegancia y comodidad con el zapato negro para mujer. Confeccionado con materiales de alta calidad, este zapato ofrece un diseño sofisticado y versátil, ideal para cualquier ocasión, desde la oficina hasta una cena elegante. La plantilla acolchada garantiza un confort duradero, mientras que la suela antideslizante proporciona una tracción segura. Perfecto para la mujer moderna que busca un calzado que complemente su estilo con gracia y funcionalidad.',
        unitsOnOrder: 0,
        totalCollected: 0,
        createdAt: new Date('2024-10-26 03:47:57'),
        updatedAt: new Date('2024-11-02 19:53:30'),
        sex: Sex.FEMALE,
      },
      {
        id: 6,
        name: 'zapatilla nike',
        price: 50000.0,
        description:
          'Descubre el equilibrio perfecto entre estilo y rendimiento con las zapatillas Nike. Diseñadas para proporcionar una comodidad excepcional, estas zapatillas cuentan con una amortiguación suave y una parte superior transpirable que mantiene tus pies frescos durante todo el día. Su suela de goma ofrece una tracción superior, asegurando estabilidad en cada paso. Ideales tanto para el entrenamiento como para el uso diario, estas zapatillas te acompañarán con estilo y funcionalidad en cada momento.',
        unitsOnOrder: 0,
        totalCollected: 0,
        createdAt: new Date('2024-10-26 03:47:57'),
        updatedAt: new Date('2025-07-04 22:35:50.073'),
        sex: Sex.UNISEX,
      },
      {
        id: 7,
        name: 'zapatilla nike airmax',
        price: 60000.0,
        description:
          'Añade un toque de estilo vibrante a tu atuendo con las zapatillas Nike rosas. Diseñadas para ofrecer una comodidad superior, estas zapatillas cuentan con una entresuela amortiguada y una parte superior transpirable que mantiene tus pies frescos durante todo el día. La suela de goma proporciona una tracción excelente, garantizando estabilidad en cada paso. Perfectas tanto para el entrenamiento como para el uso diario, estas zapatillas combinan funcionalidad y moda, haciéndote destacar en cualquier ocasión.',
        unitsOnOrder: 0,
        totalCollected: 0,
        createdAt: new Date('2024-10-26 03:47:57'),
        updatedAt: new Date('2025-07-29 16:17:17.974'),
        sex: Sex.UNISEX,
      },
      {
        id: 3,
        name: 'jeans mujer',
        price: 10000.0,
        description:
          'Sumérgete en el lujo y la comodidad con nuestros jeans de mujer diseñados para la mujer moderna y sofisticada. Fabricados con denim de primera calidad, estos jeans combinan elegancia y durabilidad en cada costura. El corte favorecedor y la silueta ajustada realzan tus curvas naturales con estilo y confianza. Detalles como las costuras finamente detalladas y los acabados artesanales aseguran un ajuste impecable y una sensación de lujo que se adapta a cualquier ocasión. Disponibles en una paleta de lavados que van desde tonos suaves hasta acabados oscuros y desgastados, nuestros jeans ofrecen versatilidad para complementar tu estilo personal. Desde un look casual de día hasta una salida nocturna elegante, estos jeans son la elección perfecta para quienes aprecian la calidad y el diseño excepcional. Actualiza tu guardarropa con piezas que perduran y destacan, gracias a nuestros jeans que no solo son una prenda de moda, sino también una declaración de estilo y confort.',
        unitsOnOrder: 0,
        totalCollected: 0,
        createdAt: new Date('2024-10-26 03:47:57'),
        updatedAt: new Date('2025-07-29 15:44:03.145'),
        sex: Sex.FEMALE,
      },
      {
        id: 4,
        name: 'remera blanca hombre',
        price: 12000.0,
        description:
          'Eleva tu estilo cotidiano con nuestra remera blanca de hombre, una pieza esencial que combina simplicidad y elegancia con un toque contemporáneo. Fabricada con algodón de primera calidad, esta remera ofrece una sensación suave al tacto y una comodidad excepcional durante todo el día. El diseño clásico de cuello redondo y ajuste regular garantiza un look atemporal y versátil que se adapta a cualquier ocasión. Perfecta para usar sola en los días cálidos o como base bajo una chaqueta o suéter durante las estaciones más frías, esta remera es una adición imprescindible a tu armario. Los detalles cuidadosamente elaborados como las costuras reforzadas y el acabado impecable en los bordes aseguran una calidad que perdura lavado tras lavado. La remera blanca, un lienzo en blanco para tu estilo personal, es ideal para aquellos que valoran la simplicidad y la sofisticación sin esfuerzo. Añade un toque de frescura y elegancia a tu vestuario diario con nuestra remera blanca, diseñada para destacar y complementar tu estilo único.',
        unitsOnOrder: 2,
        totalCollected: 24000,
        createdAt: new Date('2024-10-26 03:47:57'),
        updatedAt: new Date('2026-01-10 17:31:04.947'),
        sex: Sex.MALE,
      },
      {
        id: 2,
        name: 'jeans hombre',
        price: 15000.0,
        description:
          'Experimenta el equilibrio perfecto entre estilo y funcionalidad con nuestros jeans de hombre de última generación. Confeccionados con denim premium que combina confort y durabilidad, estos jeans están diseñados para elevar tu estilo cotidiano con un toque de sofisticación. El corte moderno y ajustado asegura un ajuste favorecedor y cómodo, mientras que los detalles meticulosamente ejecutados como costuras reforzadas y remaches de alta resistencia garantizan una calidad que perdura. Disponibles en una variedad de lavados que van desde el clásico azul hasta tonos más oscuros y desgastados, cada par es una declaración de versatilidad y buen gusto. Ideal para cualquier ocasión, desde una salida informal hasta un evento más formal, nuestros jeans son el complemento esencial para tu vestuario. Destaca entre la multitud con un estilo auténtico y sin esfuerzo, gracias a nuestros jeans diseñados para resistir las tendencias y el paso del tiempo.',
        unitsOnOrder: 3,
        totalCollected: 45000,
        createdAt: new Date('2024-10-26 03:47:57'),
        updatedAt: new Date('2026-01-10 17:31:04.947'),
        sex: Sex.MALE,
      },
    ],
  });

  // Seed Product SKUs
  console.log('Seeding product SKUs...');
  await prisma.productSku.createMany({
    data: [
      {
        id: 9,
        productId: 5,
        size: 'S',
        color: 'BLANCO',
        quantity: 10,
        createdAt: new Date('2024-08-17 03:54:41'),
        updatedAt: new Date('2024-08-17 00:00:00'),
      },
      {
        id: 10,
        productId: 5,
        size: 'M',
        color: 'BLANCO',
        quantity: 10,
        createdAt: new Date('2024-08-17 03:54:41'),
        updatedAt: new Date('2024-08-17 00:00:00'),
      },
      {
        id: 14,
        productId: 7,
        size: '38',
        color: 'ROSA',
        quantity: 10,
        createdAt: new Date('2024-08-17 03:54:41'),
        updatedAt: new Date('2024-11-07 19:57:38'),
      },
      {
        id: 15,
        productId: 8,
        size: '38',
        color: 'MARRON',
        quantity: 10,
        createdAt: new Date('2024-08-17 03:54:41'),
        updatedAt: new Date('2024-10-27 21:42:43'),
      },
      {
        id: 16,
        productId: 8,
        size: '40',
        color: 'MARRON',
        quantity: 10,
        createdAt: new Date('2024-08-17 03:54:41'),
        updatedAt: new Date('2024-08-17 00:00:00'),
      },
      {
        id: 17,
        productId: 9,
        size: '36',
        color: 'NEGRO',
        quantity: 10,
        createdAt: new Date('2024-08-17 03:54:41'),
        updatedAt: new Date('2024-11-02 19:53:30'),
      },
      {
        id: 18,
        productId: 9,
        size: '37',
        color: 'NEGRO',
        quantity: 10,
        createdAt: new Date('2024-08-17 03:54:41'),
        updatedAt: new Date('2024-08-17 00:00:00'),
      },
      {
        id: 5,
        productId: 3,
        size: '36',
        color: 'JEAN',
        quantity: 10,
        createdAt: new Date('2024-08-17 03:54:41'),
        updatedAt: new Date('2025-04-08 15:46:47.08'),
      },
      {
        id: 11,
        productId: 6,
        size: '36',
        color: 'ROJO',
        quantity: 10,
        createdAt: new Date('2024-08-17 03:54:41'),
        updatedAt: new Date('2025-07-01 05:26:19.742'),
      },
      {
        id: 12,
        productId: 6,
        size: '40',
        color: 'ROJO',
        quantity: 10,
        createdAt: new Date('2024-08-17 03:54:41'),
        updatedAt: new Date('2025-07-04 22:35:50.07'),
      },
      {
        id: 1,
        productId: 1,
        size: 'M',
        color: 'NEGRO',
        quantity: 10,
        createdAt: new Date('2024-08-18 03:54:41'),
        updatedAt: new Date('2025-07-04 22:35:50.07'),
      },
      {
        id: 4,
        productId: 2,
        size: '42',
        color: 'JEAN',
        quantity: 10,
        createdAt: new Date('2024-08-17 03:54:41'),
        updatedAt: new Date('2025-07-04 23:37:35.989'),
      },
      {
        id: 7,
        productId: 4,
        size: 'L',
        color: 'BLANCO',
        quantity: 10,
        createdAt: new Date('2024-08-17 03:54:41'),
        updatedAt: new Date('2025-07-04 23:37:35.989'),
      },
      {
        id: 6,
        productId: 3,
        size: '38',
        color: 'JEAN',
        quantity: 10,
        createdAt: new Date('2024-08-17 03:54:41'),
        updatedAt: new Date('2025-07-29 15:44:03.138'),
      },
      {
        id: 13,
        productId: 7,
        size: '36',
        color: 'ROSA',
        quantity: 10,
        createdAt: new Date('2024-08-17 03:54:41'),
        updatedAt: new Date('2025-07-29 16:17:17.948'),
      },
      {
        id: 2,
        productId: 1,
        size: 'S',
        color: 'NEGRO',
        quantity: 9,
        createdAt: new Date('2024-08-17 03:54:41'),
        updatedAt: new Date('2026-01-10 17:31:04.923'),
      },
      {
        id: 3,
        productId: 2,
        size: '44',
        color: 'JEAN',
        quantity: 7,
        createdAt: new Date('2024-08-17 03:54:41'),
        updatedAt: new Date('2026-01-10 17:31:04.923'),
      },
      {
        id: 8,
        productId: 4,
        size: 'XL',
        color: 'BLANCO',
        quantity: 8,
        createdAt: new Date('2024-08-17 03:54:41'),
        updatedAt: new Date('2026-01-10 17:31:04.923'),
      },
    ],
  });

  // Seed Images
  console.log('Seeding images...');
  await prisma.image.createMany({
    data: [
      {
        id: 1,
        imgSrc: 'e-commerce/tljlwrlm3ro6zu6zhvah',
        productId: 1,
        productSkuId: 1,
      },
      {
        id: 2,
        imgSrc: 'e-commerce/lnbv7mcvpinptog901kl',
        productId: 1,
        productSkuId: 2,
      },
      {
        id: 3,
        imgSrc: 'e-commerce/qdbkp9qh13bd9us9jxfh',
        productId: 2,
        productSkuId: 3,
      },
      {
        id: 4,
        imgSrc: 'e-commerce/bfgfkwahccbfztchykyg',
        productId: 2,
        productSkuId: 4,
      },
      {
        id: 5,
        imgSrc: 'e-commerce/i6v9c8uk6lbgrxutznge',
        productId: 3,
        productSkuId: 5,
      },
      {
        id: 6,
        imgSrc: 'e-commerce/hhyolcfjryxc3qc4srms',
        productId: 3,
        productSkuId: 6,
      },
      {
        id: 7,
        imgSrc: 'e-commerce/l0n3o5kcqcebkswt0f6p',
        productId: 4,
        productSkuId: 7,
      },
      {
        id: 8,
        imgSrc: 'e-commerce/jofi0evchuagymigy8sh',
        productId: 4,
        productSkuId: 8,
      },
      {
        id: 9,
        imgSrc: 'e-commerce/hy7zktci8oqupzrdzvvk',
        productId: 5,
        productSkuId: 9,
      },
      {
        id: 10,
        imgSrc: 'e-commerce/gwrtpl3l5j0frmfahpuc',
        productId: 5,
        productSkuId: 10,
      },
      {
        id: 11,
        imgSrc: 'e-commerce/wf2kea26yoae5nls1anx',
        productId: 6,
        productSkuId: 11,
      },
      {
        id: 12,
        imgSrc: 'e-commerce/svmor2gyvbvf3rn49x8g',
        productId: 6,
        productSkuId: 12,
      },
      {
        id: 13,
        imgSrc: 'e-commerce/jbdiqbh17obwcsuhvrkb',
        productId: 7,
        productSkuId: 13,
      },
      {
        id: 14,
        imgSrc: 'e-commerce/otjosvs2oiwiyplmzjmh',
        productId: 7,
        productSkuId: 14,
      },
      {
        id: 15,
        imgSrc: 'e-commerce/ovvszmj1nnuan692sb9b',
        productId: 8,
        productSkuId: 15,
      },
      {
        id: 16,
        imgSrc: 'e-commerce/qylrc5l6mj5v9rzz9kzz',
        productId: 8,
        productSkuId: 16,
      },
      {
        id: 17,
        imgSrc: 'e-commerce/fcdfvropmi6owfqnstel',
        productId: 9,
        productSkuId: 17,
      },
      {
        id: 18,
        imgSrc: 'e-commerce/usg4pagishulsxanm4xx',
        productId: 9,
        productSkuId: 18,
      },
    ],
  });

  // Seed Discounts
  console.log('Seeding discounts...');
  await prisma.discount.createMany({
    data: [
      {
        id: 4,
        name: 'descuento remeras',
        description: 'descuento en las remeras',
        value: 5,
        startDate: new Date('2025-07-01 04:32:32.986'),
        endDate: new Date('2025-07-24 03:00:00'),
        orderThreshold: 0,
        maxUses: null,
        currentUses: 0,
        isActive: false,
        createdAt: new Date('2025-07-01 04:37:24.23'),
        updatedAt: new Date('2026-01-10 17:41:28.224'),
        discountType: DiscountType.PERCENTAGE,
        applicableTo: DiscountApplication.CATEGORY,
      },
      {
        id: 1,
        name: 'black friday',
        description: 'descuento por el back friday',
        value: 4,
        startDate: new Date('2025-06-25 23:09:21.62'),
        endDate: new Date('2025-07-10 03:00:00'),
        orderThreshold: 0,
        maxUses: null,
        currentUses: 0,
        isActive: false,
        createdAt: new Date('2025-06-25 23:12:46.86'),
        updatedAt: new Date('2026-01-10 17:41:28.224'),
        discountType: DiscountType.PERCENTAGE,
        applicableTo: DiscountApplication.GENERAL,
      },
      {
        id: 6,
        name: 'descuento invierno',
        description: 'Descuento en pantalones, caperas y gorros',
        value: 10,
        startDate: new Date('2025-07-29 02:22:18.935'),
        endDate: new Date('2025-08-03 03:00:00'),
        orderThreshold: 0,
        maxUses: null,
        currentUses: 0,
        isActive: false,
        createdAt: new Date('2025-07-29 02:23:14.588'),
        updatedAt: new Date('2026-01-10 17:41:28.224'),
        discountType: DiscountType.PERCENTAGE,
        applicableTo: DiscountApplication.CATEGORY,
      },
    ],
  });

  // Seed Orders and related entities
  console.log('Seeding orders...');
  await prisma.order.create({
    data: {
      id: 1,
      userId: 2,
      total: 119000.0,
      discountAmount: 0.0,
      finalTotal: 119000.0,
      createdAt: new Date('2026-01-10 17:31:04.919'),
      updatedAt: new Date('2026-01-10 17:31:04.919'),
      status: OrderStatus.IN_PROGRESS,
      payment: {
        create: {
          id: 1,
          provider: PaymentProvider.VISA,
          createdAt: new Date('2026-01-10 17:31:04.919'),
          updatedAt: new Date('2026-01-10 17:31:04.919'),
        },
      },
      shipping: {
        create: {
          id: 1,
          country: 'Argentina',
          city: 'salta',
          postalCode: '4400',
          address: 'Fulano Castro 1666',
          createdAt: new Date('2026-01-10 17:31:04.919'),
          updatedAt: new Date('2026-01-10 17:31:04.919'),
        },
      },
      orderItems: {
        createMany: {
          data: [
            {
              id: 1,
              productId: 1,
              productSkuId: 2,
              quantity: 1,
              price: 50000.0,
              createdAt: new Date('2026-01-10 17:31:04.919'),
              updatedAt: new Date('2026-01-10 17:31:04.919'),
            },
            {
              id: 2,
              productId: 2,
              productSkuId: 3,
              quantity: 3,
              price: 15000.0,
              createdAt: new Date('2026-01-10 17:31:04.919'),
              updatedAt: new Date('2026-01-10 17:31:04.919'),
            },
            {
              id: 3,
              productId: 4,
              productSkuId: 8,
              quantity: 2,
              price: 12000.0,
              createdAt: new Date('2026-01-10 17:31:04.919'),
              updatedAt: new Date('2026-01-10 17:31:04.919'),
            },
          ],
        },
      },
    },
  });

  // Seed Favorites
  console.log('Seeding favorites...');
  await prisma.favorite.createMany({
    data: [
      {
        id: 1,
        productId: 1,
        userId: 1,
        createdAt: new Date('2026-01-10 17:15:59.486'),
        updatedAt: new Date('2026-01-10 17:15:59.486'),
      },
      {
        id: 2,
        productId: 4,
        userId: 1,
        createdAt: new Date('2026-01-10 17:16:05.003'),
        updatedAt: new Date('2026-01-10 17:16:05.003'),
      },
      {
        id: 3,
        productId: 6,
        userId: 1,
        createdAt: new Date('2026-01-10 17:16:09.839'),
        updatedAt: new Date('2026-01-10 17:16:09.839'),
      },
    ],
  });

  // Seed Many-to-Many relations
  console.log('Seeding M2M relations...');
  // For _CategoryToDiscount
  await prisma.discount.update({
    where: { id: 4 },
    data: { categories: { connect: { id: 4 } } },
  });
  await prisma.discount.update({
    where: { id: 6 },
    data: { categories: { connect: [{ id: 1 }, { id: 5 }, { id: 7 }] } },
  });

  // For _CategoryToProduct
  await prisma.product.update({
    where: { id: 1 },
    data: { categories: { connect: { id: 1 } } },
  });
  await prisma.product.update({
    where: { id: 2 },
    data: { categories: { connect: { id: 5 } } },
  });
  await prisma.product.update({
    where: { id: 3 },
    data: { categories: { connect: { id: 5 } } },
  });
  await prisma.product.update({
    where: { id: 4 },
    data: { categories: { connect: { id: 4 } } },
  });
  await prisma.product.update({
    where: { id: 5 },
    data: { categories: { connect: { id: 4 } } },
  });
  await prisma.product.update({
    where: { id: 6 },
    data: { categories: { connect: { id: 2 } } },
  });
  await prisma.product.update({
    where: { id: 7 },
    data: { categories: { connect: { id: 2 } } },
  });
  await prisma.product.update({
    where: { id: 8 },
    data: { categories: { connect: { id: 3 } } },
  });
  await prisma.product.update({
    where: { id: 9 },
    data: { categories: { connect: { id: 3 } } },
  });

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
