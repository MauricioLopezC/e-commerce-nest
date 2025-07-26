import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dtos/CreateUserDto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';


@Injectable()
export class RegisterService {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  async register(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10)
    createUserDto.password = hashedPassword
    const createdUser = await this.usersService.create(createUserDto)
    delete createdUser.role
    delete createdUser.password
    return createdUser
  }
}
