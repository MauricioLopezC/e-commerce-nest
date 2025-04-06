import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dtos/CreateUserDto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CartService } from 'src/core/cart/cart.service';


@Injectable()
export class RegisterService {
  constructor(
    private readonly usersService: UsersService,
    private readonly cartService: CartService
  ) { }

  async register(createUserDto: CreateUserDto): Promise<User> {
    console.log("REGISTER SERVICE", createUserDto)

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10)
    createUserDto.password = hashedPassword
    const createdUser = await this.usersService.create(createUserDto)
    //await this.cartService.create(createdUser.id)
    delete createdUser.role
    delete createdUser.password
    return createdUser
  }
}
