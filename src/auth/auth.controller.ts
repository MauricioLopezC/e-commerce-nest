import { Body, Controller, Get, HttpException, HttpStatus, Post, Request, Res, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/CreateUserDto';
import { RegisterService } from './register/register.service';
import { LoginDto } from './login/dto/LoginDto';
import { LoginService } from './login/login.service';
import { PublicRoute } from './decorators/public-routes.decorator';
import { RolesGuard } from './guards/roles.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerService: RegisterService,
    private readonly loginService: LoginService,
  ) { }

  @PublicRoute()
  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.registerService.register(createUserDto)
      return user
    } catch (error) {
      console.log(error)
      throw new HttpException("User already exists", HttpStatus.CONFLICT)
    }
  }

  @PublicRoute()
  @Post('/login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response
  ) {
    const token = await this.loginService.login(loginDto)

    if (token) {
      response.cookie("access-token", token.access_token, {
        httpOnly: true,
      })
    }

    return token
  }


  @Post('/logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie("access-token")
    response.status(200)
    return { message: "logout successfully" }
  }

  @Get('/profile')
  @UseGuards(RolesGuard)
  getProfile(@Request() req) {
    return req.user
  }
}
