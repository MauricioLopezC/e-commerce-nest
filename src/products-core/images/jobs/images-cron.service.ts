import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';

@Injectable()
export class ImagesCronService {
  private readonly logger = new Logger(ImagesCronService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  /**
   * This cron job runs daily at 3 AM to clean up orphaned images.
   * Adjust the frequency as needed for your production environment.
   */
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async handleCron() {
    this.logger.log('Starting orphaned images cleanup job...');
    try {
      // 1. Get all image public_ids from the database
      const dbImages = await this.prisma.image.findMany({
        select: {
          imgSrc: true,
        },
      });
      const dbImageIds = new Set(dbImages.map((image) => image.imgSrc));
      this.logger.log(`Found ${dbImageIds.size} images in the database.`);

      // 2. Get all image public_ids from the 'e-commerce' Cloudinary folder
      const cloudinaryImages =
        await this.cloudinaryService.listAllResources('e-commerce');
      const cloudinaryImageIds = cloudinaryImages.map((img) => img.public_id);
      this.logger.log(
        `Found ${cloudinaryImageIds.length} images in the 'e-commerce' Cloudinary folder.`,
      );

      // 3. Identify orphaned images
      const orphanedIds = cloudinaryImageIds.filter(
        (id) => !dbImageIds.has(id),
      );

      if (orphanedIds.length === 0) {
        this.logger.log('No orphaned images found. Job finished.');
        return;
      }

      this.logger.warn(
        `Found ${orphanedIds.length} orphaned images. Deleting...`,
      );
      this.logger.debug('Orphaned IDs to be deleted:', orphanedIds);

      // 4. Delete orphaned images from Cloudinary
      await this.cloudinaryService.deleteResources(orphanedIds);

      this.logger.log(
        `Successfully deleted ${orphanedIds.length} orphaned images. Job finished.`,
      );
    } catch (error) {
      this.logger.error(
        'An error occurred during orphaned images cleanup:',
        error.stack,
      );
    }
  }
}
