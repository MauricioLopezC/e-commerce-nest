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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { ListAllUsersDto } from './dto/list-all-users.dto';
import { mapToUserResponse, mapToUsersListResponse } from './mapper';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Roles(Role.Admin)
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return mapToUserResponse(await this.usersService.create(createUserDto));
  }

  @Roles(Role.Admin)
  @Get()
  async findAllUsers(@Query() query: ListAllUsersDto) {
    return mapToUsersListResponse(await this.usersService.findAll(query));
  }

  @Roles(Role.Admin)
  @Get(':id')
  async findOneUser(@Param('id', ParseIntPipe) id: number) {
    const userFound = await this.usersService.findOne(id);
    if (!userFound) throw new NotFoundException('User does not exist');
    return mapToUserResponse(userFound);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return mapToUserResponse(await this.usersService.update(id, updateUserDto));
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return mapToUserResponse(await this.usersService.remove(id));
  }

  @Roles(Role.Admin)
  @Patch(':id/ban')
  async banUser(@Param('id', ParseIntPipe) id: number) {
    return mapToUserResponse(await this.usersService.banUser(id));
  }

  @Roles(Role.Admin)
  @Patch(':id/unban')
  async unBanUser(@Param('id', ParseIntPipe) id: number) {
    return mapToUserResponse(await this.usersService.unBanUser(id));
  }
}
