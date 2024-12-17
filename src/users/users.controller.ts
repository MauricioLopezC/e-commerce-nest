import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/CreateUserDto';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dtos/UpdateUserDto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { ListAllUsersDto } from './dtos/list-all-users.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) { }
  //all these endopoints are available only to the admin user
  @Roles(Role.Admin)
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersService.create(createUserDto)
    return user
  }

  @Roles(Role.Admin)
  @Get()
  findAllUsers(@Query() query: ListAllUsersDto) {
    return this.usersService.findAll(query)
  }

  @Get(':id')
  async findOneUser(@Param('id', ParseIntPipe) id: number) {
    //TODO: add guard to check that a user can read only his data
    const userFound = this.usersService.findOne(id)
    if (!userFound) throw new NotFoundException("User does not exist")
    return userFound
  }

  @Roles(Role.Admin)
  @Patch(':id')
  async updateUser(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    try {
      return await this.usersService.update(id, updateUserDto)
    } catch (error) {
      throw new NotFoundException("User does not exist")
    }
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.usersService.remove(id)
    } catch (error) {
      console.log(error)
      throw new NotFoundException("User does not exist")
    }
  }




}
