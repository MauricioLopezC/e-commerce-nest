import { Module } from '@nestjs/common';
import { LoginService } from './login/login.service';
import { RegisterService } from './register/register.service';
import { LogoutService } from './logout/logout.service';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './login/constants';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { CartModule } from 'src/core/cart/cart.module';

@Module({
  providers: [
    LoginService,
    RegisterService,
    LogoutService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },//now the AuthGuard is used for all endpoints of the application
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    } //same with roles guard with verify if user has required role for use endpoint
  ],
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' }
    }),
    CartModule
  ],
  controllers: [AuthController]
})
export class AuthModule { }
