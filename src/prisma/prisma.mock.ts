export const prismaMock = {
  cart: {
    findUnique: jest.fn(),
  },
  cartItem: {
    findMany: jest.fn(),
    deleteMany: jest.fn(),
  },
  productSku: {
    findMany: jest.fn(),
    update: jest.fn(),
  },
  order: {
    create: jest.fn(),
    findMany: jest.fn(),
    aggregate: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  $transaction: jest.fn().mockImplementation((callback) => callback(prismaMock)),
};
