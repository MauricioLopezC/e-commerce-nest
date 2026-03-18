import { Controller, Get } from '@nestjs/common';
import { UsersService } from '../users.service';
import { JwtPayload } from 'src/common/types/JwtPayload';
import { CurrentUser } from 'src/common/current-user/current-user.decorator';
import { mapToUserResponse } from '../mapper';

@Controller('me')
export class MeController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getMyProfile(@CurrentUser() user: JwtPayload) {
    const fullUser = await this.usersService.findOne(user.id);
    return mapToUserResponse(fullUser);
  }
}
