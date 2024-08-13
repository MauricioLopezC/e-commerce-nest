import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/CreateUserDto';
import { UpdateUserDto } from './dtos/UpdateUserDto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: createUserDto
    })
    //should return User without the password and many other sensitive data
    //podriamos incluir un carrito apenas se crea el usuario
    return createdUser
  }

  async findAll(): Promise<User[]> {
    const users = this.prisma.user.findMany()
    return users
  }

  async findOne(id: number): Promise<User> {
    return await this.prisma.user.findUnique({
      where: {
        id: id
      }
    })
  }

  async findByEmail(email: string): Promise<User> {
    return await this.prisma.user.findUnique({
      where: {
        email: email
      }
    })
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    return await this.prisma.user.update({
      where: {
        id: id
      },
      data: updateUserDto
    })
  }

  async remove(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: {
        id: id
      }
    })
  }
}
