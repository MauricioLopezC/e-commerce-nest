import { OwnCartGuard } from './own-cart.guard';
import { PrismaService } from 'src/prisma/prisma.service';

describe('OwnCartGuard', () => {
  let prismaService: PrismaService;

  beforeEach(() => {
    prismaService = {} as any;
  });

  it('should be defined', () => {
    expect(new OwnCartGuard(prismaService)).toBeDefined();
  });
});
