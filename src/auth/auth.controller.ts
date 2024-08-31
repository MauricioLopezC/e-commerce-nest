import { Body, Controller, Get, HttpException, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/CreateUserDto';
import { RegisterService } from './register/register.service';
import { LoginDto } from './login/dto/LoginDto';
import { LoginService } from './login/login.service';
import { PublicRoute } from './decorators/public-routes.decorator';
import { RolesGuard } from './guards/roles.guard';

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
  login(@Body() loginDto: LoginDto) {
    //TODO: add a cokie with the access token
    return this.loginService.login(loginDto)
  }

  @Get('/profile')
  @UseGuards(RolesGuard)
  getProfile(@Request() req) {
    return req.user
  }
}
