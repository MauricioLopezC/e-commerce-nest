import { BadRequestException, Body, Controller, Delete, HttpStatus, Param, ParseFilePipeBuilder, ParseIntPipe, Post, UploadedFile, UseFilters, UseInterceptors } from '@nestjs/common';
import { ImagesService } from './images.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { CreateImageDto } from './dto/create-image.dto';
import { PrismaClientExceptionFilter } from 'src/common/filters/prisma-client-exception/prisma-client-exception.filter';

@UseFilters(PrismaClientExceptionFilter)
@Controller('images')
export class ImagesController {
  constructor(private imagesService: ImagesService) { }

  //NOTE: in this approach product id and productSkuId will be
  //passed in body of the request, for this system with only one
  //seller its ok, but if we want to support many sellers, like amazon or ML
  //we need to check productId and productSkuId fileds


  @Post()
  @Roles(Role.Admin)
  @UseInterceptors(FileInterceptor('file'))
  async createAndUpload(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'image/jpeg'
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
        })
    ) file: Express.Multer.File,
    @Body() body: CreateImageDto
  ) {
    console.log(body.productId, body.productSkuId)
    if (!file) throw new BadRequestException("Failed to upload image")

    const result = await this.imagesService.createAndUpload(
      file,
      body.productId,
      body.productSkuId
    )
    return result.secure_url
  }

  //TODO: Multiple file upload

  @Delete(':id')
  @Roles(Role.Admin)
  @UseInterceptors(FileInterceptor('file'))
  async deleteAndDestroy(@Param('id', ParseIntPipe) id: number) {
    return await this.imagesService.deleteAndDestroy(id)
  }


}
