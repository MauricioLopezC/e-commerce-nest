import { Injectable } from '@nestjs/common';
import { CloudinaryResponse } from './cloudinary-response';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {

  uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "e-commerce",
          resource_type: 'auto'
        },
        (error, result) => {
          if (error) return reject(error)
          resolve(result)
        }
      ).end(file.buffer)
    })
  }

  async uploadMultipleFiles(files: Express.Multer.File[]): Promise<string[]> {
    const urls = await Promise.all(files.map(
      async (file): Promise<string> => {
        const { secure_url } = await this.uploadFile(file)
        return secure_url
      }
    ))
    return urls
  }

  async destroyImage(publicId: string): Promise<CloudinaryResponse> {
    return await cloudinary.uploader.destroy(publicId)
  }

  async deleteResources(images: string[]) {
    return await cloudinary.api.delete_resources(images,
      (result) => console.log(result)
    )
  }

}
