import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dtos/create-user-dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/generated/prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { AlreadyIncludedError } from 'src/common/errors/already-included-error';
import { uniqueConstraint } from 'src/common/prisma-erros';

@Injectable()
export class RegisterService {
  constructor(private readonly usersService: UsersService) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    try {
      createUserDto.password = hashedPassword;
      const createdUser = await this.usersService.create(createUserDto);
      delete createdUser.role;
      delete createdUser.password;
      return createdUser;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === uniqueConstraint
      )
        throw new AlreadyIncludedError('User already exists');
      throw error;
    }
  }
}
