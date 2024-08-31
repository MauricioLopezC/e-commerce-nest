import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NotFoundError } from 'src/common/errors/not-found-error';
import { NotExistError } from 'src/common/errors/not-exist-error';

@Injectable()
export class ImagesService {
  constructor(
    private clodinaryService: CloudinaryService,
    private prisma: PrismaService
  ) { }

  async createAndUpload(file: Express.Multer.File, productId: number, productSkuId: number) {
    //upload to cloudinary
    //TODO: check foreign key constraint before upload to cloudinary
    const productSku = await this.prisma.productSku.findUnique({
      where: {
        id: productSkuId
      }
    })

    if (!productSku) throw new NotExistError(`not found productSku with id: ${productSkuId}`)
    if (productSku.productId !== productId) throw new NotExistError(`not found product for product sku ${productSkuId}`)
    //OPTIMIZE: productId is not neccessary

    const response = await this.clodinaryService.uploadFile(file)
    console.log(response)

    //insert in table
    if (!response) throw new Error('SERVER ERROR')

    const imgSrc = response.public_id

    //NOTE: what happens if either productId or productSkuId does not exists?
    // read about foreign key constraint in sql
    // then prisma will be throw error, foreign key contraint erorr,
    // for some reason the error does not appear on sql console of DATAGRIP
    // using sqlite
    await this.prisma.image.create({
      data: {
        productId,
        productSkuId,
        imgSrc
      }
    }).catch((error) => {
      if (error instanceof PrismaClientKnownRequestError) {
        console.log(error.code, error.meta)
      }
      throw error
    })
    //this error will be handled by my prisma-client-exception filter

    return response
  }

  async deleteAndDestroy(id: number) {
    const image = await this.prisma.image.findUnique({
      where: {
        id
      }
    })
    const public_id = image.imgSrc
    if (!image) throw new NotFoundError("Not found image")

    await this.prisma.image.delete({
      where: {
        id: id
      }
    })

    return await this.clodinaryService.destroyImage(public_id)
  }

  async createAndUploadV2(file: Express.Multer.File, productId: number, productSkuId: number) {
    const image = await this.prisma.image.create({
      data: {
        imgSrc: 'temp',
        productId,
        productSkuId
      }
    })

    const response = await this.clodinaryService.uploadFile(file)
      .catch(async (error) => {
        console.log(error)
        //delete if upload failed
        await this.prisma.image.delete({
          where: {
            id: image.id
          }
        })
        throw new Error("Failed to upload image")
      })

    console.log(response)

    //update imgSrc in table
    if (!response) throw new Error('Upload Image error')
    const id = image.id

    const imgSrc = response.public_id
    await this.prisma.image.update({
      where: {
        id
      },
      data: {
        imgSrc
      }
    })
    return response
  }

}
