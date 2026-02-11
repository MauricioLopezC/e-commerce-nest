import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';

describe('RolesGuard', () => {
  let reflector: Reflector;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as any;
  });

  it('should be defined', () => {
    expect(new RolesGuard(reflector)).toBeDefined();
  });
});
