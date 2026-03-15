import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { RegisterService } from './register/register.service';
import { LoginDto } from './login/dto/login.dto';
import { LoginService } from './login/login.service';
import { PublicRoute } from './decorators/public-routes.decorator';
import { RolesGuard } from './guards/roles.guard';
import { Response } from 'express';
import { Throttle } from '@nestjs/throttler';
import { mapToUserResponse } from 'src/users/mapper';
import { UserResponseDto } from 'src/users/dto/users-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Throttle({ default: { ttl: 60000, limit: 5 } })
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerService: RegisterService,
    private readonly loginService: LoginService,
  ) {}

  @PublicRoute()
  @Post('/register')
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    return mapToUserResponse(
      await this.registerService.register(createUserDto),
    );
  }

  @PublicRoute()
  @Post('/login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponseDto> {
    const token = await this.loginService.login(loginDto);

    if (token) {
      response.cookie('access-token', token.access_token, {
        httpOnly: true,
      });
    }

    return {
      access_token: token.access_token,
    };
  }

  @Post('/logout')
  async logout(
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponseDto> {
    response.clearCookie('access-token');
    response.status(200);
    return {
      access_token: '',
    };
  }

  @Get('/profile')
  @UseGuards(RolesGuard)
  getProfile(@Request() req) {
    return req.user;
  }
}
