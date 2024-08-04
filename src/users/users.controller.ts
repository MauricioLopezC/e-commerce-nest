import { Controller, Get, Post } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  getAll(): string {
    return "hola"
  }

  @Post()
  createUser(): string {
    return 'creando un usuario'
  }

  @Get(':id')
  getUser(): string {
    return 'un usuario'
  }

}
