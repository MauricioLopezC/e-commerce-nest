import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/CreateUserDto';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dtos/UpdateUserDto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Roles(Role.Admin)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) { }
  //all these endopoints are available only to the admin user
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersService.create(createUserDto)
    return user
  }

  @Get()
  findAllUsers(): Promise<User[]> {
    return this.usersService.findAll()
  }

  @Get(':id')
  async findOneUser(@Param('id', ParseIntPipe) id: number) {
    const userFound = this.usersService.findOne(id)
    if (!userFound) throw new NotFoundException("User does not exist")
    return userFound
  }

  @Patch(':id')
  async updateUser(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    try {
      return await this.usersService.update(id, updateUserDto)
    } catch (error) {
      throw new NotFoundException("User does not exist")
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.usersService.remove(id)
    } catch (error) {
      throw new NotFoundException("User does not exist")
    }
  }




}
