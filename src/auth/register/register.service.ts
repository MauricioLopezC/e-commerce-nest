import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UniqueConstraintError } from 'src/common/errors/business-error';
import { Prisma } from 'src/generated/prisma/client';
import { prismaUniqueConstraintError } from 'src/common/prisma-erros';
import { UserWithStats } from 'src/users/mapper';

@Injectable()
export class RegisterService {
  constructor(private readonly usersService: UsersService) {}

  async register(createUserDto: CreateUserDto): Promise<UserWithStats> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    createUserDto.password = hashedPassword;
    try {
      const createdUser = await this.usersService.create(createUserDto);
      return createdUser;
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
