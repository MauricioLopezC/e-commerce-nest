import { Test, TestingModule } from '@nestjs/testing';
import { MailsService } from './mails.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

describe('MailsService', () => {
  let service: MailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailsService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            order: {
              findUnique: jest.fn(),
            },
            orderItem: {
              findMany: jest.fn(),
            },
            user: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<MailsService>(MailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
