import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundError } from 'src/common/errors/not-found-error';
import { CloudinaryResponse } from '../cloudinary/cloudinary-response';
import { UploadImageError } from 'src/common/errors/upload-image-error';
import { ValidationError } from 'src/common/errors/validation-error';

@Injectable()
export class ImagesService {
  constructor(
    private cloudinaryService: CloudinaryService,
    private prisma: PrismaService,
  ) {}

  async createAndUpload(
    file: Express.Multer.File,
    productId: number,
    productSkuId: number,
  ): Promise<CloudinaryResponse> {
    //Check foreign key constraint before upload to cloudinary
    //this check is normally not necessary because image.create will fail if productSku and productSkuId
    //do not exist for foreign key constraint. we need no check before upload image to cloudinary
    // to optimize cloudinary api calls
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

    let response: CloudinaryResponse;
    try {
      response = await this.cloudinaryService.uploadFile(file);
    } catch (e) {
      throw new UploadImageError('Error uploading image, try again later');
    }

    //if ok insert image record in a database
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

  async batchCreateAndUpload(
    files: Express.Multer.File[],
    metadata: { productId: number; productSkuId: number }[],
  ): Promise<CloudinaryResponse[]> {
    if (files.length !== metadata.length) {
      throw new ValidationError('Files and metadata length mismatch');
    }
    const productSkuIds = metadata.map((m) => m.productSkuId);
    const productSkus = await this.prisma.productSku.findMany({
      where: {
        id: { in: productSkuIds },
      },
      select: { id: true, productId: true },
    });

    const productSkuMap = new Map(productSkus.map((sku) => [sku.id, sku]));

    for (const meta of metadata) {
      const productSku = productSkuMap.get(meta.productSkuId);
      if (!productSku) {
        throw new NotFoundError(
          `Product SKU with id ${meta.productSkuId} not found.`,
        );
      }
      if (productSku.productId !== meta.productId) {
        throw new NotFoundError(
          `Product SKU with id ${meta.productSkuId} does not belong to product with id ${meta.productId}.`,
        );
      }
    }

    try {
      const uploadResults =
        await this.cloudinaryService.uploadMultipleFiles(files);

      const imagesToCreate = uploadResults.map((result, index) => {
        return {
          imgSrc: result.public_id,
          productId: metadata[index].productId,
          productSkuId: metadata[index].productSkuId,
        };
      });

      await this.prisma.image.createMany({
        data: imagesToCreate,
      });

      return uploadResults;
    } catch (e) {
      if (e instanceof UploadImageError) {
        throw e;
      }
      throw new UploadImageError('Failed to upload one or more images.');
    }
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

    return await this.cloudinaryService.destroyImage(public_id);
  }
}
