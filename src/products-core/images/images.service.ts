import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundError } from 'src/common/errors/not-found-error';
import { CloudinaryResponse } from '../cloudinary/cloudinary-response';
import { UploadImageError } from 'src/common/errors/upload-image-error';

@Injectable()
export class ImagesService {
  constructor(
    private clodinaryService: CloudinaryService,
    private prisma: PrismaService,
  ) {}

  async createAndUpload(
    file: Express.Multer.File,
    productId: number,
    productSkuId: number,
  ) {
    //Check foreign key constraint before upload to cloudinary
    //this check is normally not necessary because image.create will fail if productSku and productSkuId
    //do not exists for foreign key constraint. we need no check before upload image to cloudinary
    //in order to optimize cloudinary api calls
    const productSku = await this.prisma.productSku.findUnique({
      where: {
        id: productSkuId,
      },
    });
    if (!productSku)
      throw new NotFoundError(`not found productSku with id: ${productSkuId}`);
    if (productSku.productId !== productId)
      throw new NotFoundError(
        `not found product for product sku ${productSkuId}`,
      );

    const response = await this.clodinaryService.uploadFile(file);
    //check error
    if (!response.public_id) {
      throw new UploadImageError('Error uploading image, try again later');
    }

    //if ok insert image record in database
    const imgSrc = response.public_id;
    await this.prisma.image.create({
      data: {
        productId,
        productSkuId,
        imgSrc,
      },
    });

    return response;
  }

  async deleteAndDestroy(id: number): Promise<CloudinaryResponse> {
    const image = await this.prisma.image.findUnique({
      where: {
        id,
      },
    });
    const public_id = image.imgSrc;
    if (!image) throw new NotFoundError('Not found image');

    await this.prisma.image.delete({
      where: {
        id: id,
      },
    });

    return await this.clodinaryService.destroyImage(public_id);
  }

  async createAndUploadV2(
    file: Express.Multer.File,
    productId: number,
    productSkuId: number,
  ) {
    const image = await this.prisma.image.create({
      data: {
        imgSrc: 'temp',
        productId,
        productSkuId,
      },
    });

    const response: CloudinaryResponse =
      await this.clodinaryService.uploadFile(file);
    if (!response.secure_url) {
      //error! then delete temp database register

      await this.prisma.image.delete({
        where: {
          id: image.id,
        },
      });
      throw new Error('upload image error');
    }

    const id = image.id;

    const imgSrc = response.public_id;
    await this.prisma.image.update({
      where: {
        id,
      },
      data: {
        imgSrc,
      },
    });
    return response;
  }
}
