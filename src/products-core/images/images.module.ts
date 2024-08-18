import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ImagesController],
  providers: [ImagesService],
  imports: [CloudinaryModule, PrismaModule]

})
export class ImagesModule { }
