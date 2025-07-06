import { Controller, Post } from '@nestjs/common';
import { MailsService } from './mails.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('mails')
export class MailsController {

  constructor(private readonly mailsService: MailsService) { }

  @Roles(Role.Admin)
  @Post()
  async sendEmail() {
    const result = await this.mailsService.sendOrderConfirmation('mauricio.agustin.lopez.456@gmail.com', 'O1')
  }
}
