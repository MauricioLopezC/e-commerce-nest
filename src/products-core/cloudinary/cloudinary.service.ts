import { Injectable } from '@nestjs/common';
import { CloudinaryResponse } from './cloudinary-response';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier'; //no types

@Injectable()
export class CloudinaryService {

  uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStram = cloudinary.uploader.upload_stream({ folder: "e-commerce" },
        (error, result) => {
          if (error) return reject(error)
          resolve(result)
        }
      )
      streamifier.createReadStream(file.buffer).pipe(uploadStram);
    })
  }

  async destroyImage(publicId: string) {
    return await cloudinary.uploader.destroy(publicId)
  }

  async deleteResources(images: string[]) {
    return await cloudinary.api.delete_resources(images,
      (result) => console.log(result)
    )
  }

}
