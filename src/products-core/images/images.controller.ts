import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpStatus,
  InternalServerErrorException,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { CreateImageDto } from './dto/create-image.dto';
import { CloudinaryResponse } from '../cloudinary/cloudinary-response';
import { Throttle } from '@nestjs/throttler';
import { NotFoundError } from 'src/common/errors/business-error';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import {
  DeleteImageResponseDto,
  ImageResponseDto,
} from './dto/images-response.dto';

@Throttle({ default: { ttl: 60000, limit: 5 } })
@Controller('images')
@Roles(Role.Admin)
export class ImagesController {
  constructor(private imagesService: ImagesService) {}

  @ApiCreatedResponse({ type: ImageResponseDto })
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createAndUpload(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'image/jpeg',
        })
        .addMaxSizeValidator({
          maxSize: 1024 * 1024 * 5,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @Body() body: CreateImageDto,
  ) {
    if (!file) throw new BadRequestException('Failed to upload image');

    try {
      const result = await this.imagesService.createAndUpload(
        file,
        body.productId,
        body.productSkuId,
      );
      return {
        url: result.secure_url,
      };
    } catch (e) {
      if (e instanceof NotFoundError) {
        throw new BadRequestException(e.message);
      }
      throw new InternalServerErrorException('Failed to upload image');
    }
  }

  @ApiCreatedResponse({ type: [ImageResponseDto] })
  @Post('/batch')
  @UseInterceptors(FilesInterceptor('files', 10))
  async batchCreateAndUpload(
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'image/jpeg',
        })
        .addMaxSizeValidator({
          maxSize: 1024 * 1024 * 5,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    files: Array<Express.Multer.File>,
    @Body() body: { metadata: string },
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files');
    }

    let parsedMetadata: { productId: number; productSkuId: number }[];
    try {
      parsedMetadata = JSON.parse(body.metadata);
    } catch (e) {
      throw new BadRequestException(
        'Invalid metadata format. Must be a JSON array string',
      );
    }

    if (!Array.isArray(parsedMetadata)) {
      throw new BadRequestException('metadata must be an array');
    }

    if (files.length !== parsedMetadata.length) {
      throw new BadRequestException(
        `Files count (${files.length}) does not match metadata count (${parsedMetadata.length})`,
      );
    }
    parsedMetadata.forEach((metadata, index) => {
      console.log(metadata, index);
    });
    let result: CloudinaryResponse[];
    try {
      result = await this.imagesService.batchCreateAndUpload(
        files,
        parsedMetadata,
      );
      return result.map((r) => ({ url: r.secure_url }));
    } catch (e) {
      if (e instanceof NotFoundError) {
        throw new BadRequestException(e.message);
      }
      throw new InternalServerErrorException(
        'Failed to upload one or more images.',
      );
    }
  }

  @ApiOkResponse({ type: DeleteImageResponseDto })
  @Delete(':id')
  @Roles(Role.Admin)
  @UseInterceptors(FileInterceptor('file'))
  async deleteAndDestroy(@Param('id', ParseIntPipe) id: number) {
    return await this.imagesService.deleteAndDestroy(id);
  }
}
