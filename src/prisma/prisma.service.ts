import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { PrismaClient } from 'src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  constructor(configService: ConfigService) {
    const pool = new Pool({
      connectionString: configService.get<string>('DATABASE_URL'),
    });
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
