import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

describe('AuthGuard', () => {
  let jwtService: JwtService;
  let reflector: Reflector;
  let configService: ConfigService;

  beforeEach(() => {
    jwtService = {} as any;
    reflector = {
      getAllAndOverride: jest.fn(),
    } as any;
    configService = {
      get: jest.fn(),
    } as any;
  });

  it('should be defined', () => {
    expect(new AuthGuard(jwtService, reflector, configService)).toBeDefined();
  });
});
