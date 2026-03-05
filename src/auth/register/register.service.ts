import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UniqueConstraintError } from 'src/common/errors/business-error';
import { RegisterResponse } from '../dto/register-response.dto';
import { Prisma } from 'src/generated/prisma/client';
import { prismaUniqueConstraintError } from 'src/common/prisma-erros';

@Injectable()
export class RegisterService {
  constructor(private readonly usersService: UsersService) {}

  async register(createUserDto: CreateUserDto): Promise<RegisterResponse> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    createUserDto.password = hashedPassword;
    try {
      const createdUser = await this.usersService.create(createUserDto);
      const { role, ...userResponse } = createdUser;
      return userResponse;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === prismaUniqueConstraintError
      ) {
        throw new UniqueConstraintError(
          'A user with this email already exists',
        );
      }
      throw error;
    }
  }
}
