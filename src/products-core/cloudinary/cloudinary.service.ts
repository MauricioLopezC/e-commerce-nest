import { Injectable } from '@nestjs/common';
import { CloudinaryResponse } from './cloudinary-response';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  uploadFile(
    file: Express.Multer.File,
    folder = 'e-commerce',
  ): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: folder,
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        )
        .end(file.buffer);
    });
  }

  async uploadMultipleFiles(
    files: Express.Multer.File[],
    folder = 'e-commerce',
  ): Promise<CloudinaryResponse[]> {
    const responses = await Promise.all(
      files.map((file) => {
        return this.uploadFile(file, folder);
      }),
    );
    return responses;
  }

  async listAllResources(folder: string): Promise<{ public_id: string }[]> {
    let allResources = [];
    let next_cursor = null;

    try {
      do {
        const result: {
          resources: { public_id: string }[];
          next_cursor?: string;
        } = await cloudinary.api.resources({
          type: 'upload',
          prefix: folder,
          max_results: 500, // El máximo permitido por la API
          next_cursor: next_cursor,
        });

        allResources = allResources.concat(result.resources);
        next_cursor = result.next_cursor;
      } while (next_cursor);

      return allResources;
    } catch (error) {
      // Manejar o registrar el error según sea necesario
      console.error('Error listing resources from Cloudinary:', error);
      throw error;
    }
  }

  async destroyImage(publicId: string): Promise<CloudinaryResponse> {
    return await cloudinary.uploader.destroy(publicId);
  }

  async deleteResources(images: string[]) {
    return await cloudinary.api.delete_resources(images, (result) =>
      console.log(result),
    );
  }
}
