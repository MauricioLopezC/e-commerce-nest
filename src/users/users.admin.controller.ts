import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user-dto';
import { User } from 'src/generated/prisma/client';
import { UpdateUserDto } from './dtos/update-user-dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { ListAllUsersDto } from './dtos/list-all-users.dto';
import { NotFoundError } from 'src/common/errors/not-found-error';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  //All these endopoints are available only to the admin user
  @Roles(Role.Admin)
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersService.create(createUserDto);
    return user;
  }

  @Roles(Role.Admin)
  @Get()
  findAllUsers(@Query() query: ListAllUsersDto) {
    return this.usersService.findAll(query);
  }

  @Roles(Role.Admin)
  @Get(':id')
  async findOneUser(@Param('id', ParseIntPipe) id: number) {
    const userFound = this.usersService.findOne(id);
    if (!userFound) throw new NotFoundException('User does not exist');
    return userFound;
  }

  @Roles(Role.Admin)
  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      return await this.usersService.update(id, updateUserDto);
    } catch (error) {
      throw new NotFoundException('User does not exist');
    }
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.usersService.remove(id);
    } catch (error) {
      console.log(error);
      throw new NotFoundException('User does not exist');
    }
  }

  @Roles(Role.Admin)
  @Patch(':id/ban')
  async banUser(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.usersService.banUser(id);
    } catch (error) {
      if (error instanceof NotFoundError)
        throw new NotFoundException(error.message);
    }
  }

  @Roles(Role.Admin)
  @Patch(':id/unban')
  async unBanUser(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.usersService.unBanUser(id);
    } catch (error) {
      if (error instanceof NotFoundError)
        throw new NotFoundException(error.message);
    }
  }
}
