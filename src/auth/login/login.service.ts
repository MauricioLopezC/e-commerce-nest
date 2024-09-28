import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/LoginDto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) { }

  async login(loginDto: LoginDto) {
    //TODO: throw custom error here and instead HttpErrors,
    //HttpErrors will be throw by AuthController

    const user = await this.usersService.findByEmail(loginDto.email)

    if (!user) throw new UnauthorizedException('Wrong email')

    const matchPassword = await bcrypt.compare(loginDto.password, user.password)
    console.log(matchPassword)
    if (!matchPassword) {
      throw new UnauthorizedException('Wrong password')
    }

    const payload = { id: user.id, email: user.email, role: user.role }
    const token = await this.jwtService.signAsync(payload)

    return {
      access_token: token
    }
  }
}
