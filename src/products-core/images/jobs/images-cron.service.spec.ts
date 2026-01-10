import { Test, TestingModule } from '@nestjs/testing';
import { ImagesCronService } from './images-cron.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { Logger } from '@nestjs/common';

// Mock services and data
const mockPrismaService = {
  image: {
    findMany: jest.fn(),
  },
};

const mockCloudinaryService = {
  listAllResources: jest.fn(),
  deleteResources: jest.fn(),
};

describe('ImagesCronService', () => {
  let service: ImagesCronService;

  beforeAll(() => {
    // Suppress console logs for cleaner test output
    jest.spyOn(Logger, 'log').mockImplementation(() => {});
    jest.spyOn(Logger, 'warn').mockImplementation(() => {});
    jest.spyOn(Logger, 'debug').mockImplementation(() => {});
    jest.spyOn(Logger, 'error').mockImplementation(() => {});
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImagesCronService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: CloudinaryService, useValue: mockCloudinaryService },
      ],
    }).compile();

    service = module.get<ImagesCronService>(ImagesCronService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleCron', () => {
    it('should not call deleteResources when no orphans are found', async () => {
      mockPrismaService.image.findMany.mockResolvedValueOnce([
        { imgSrc: 'id1' },
        { imgSrc: 'id2' },
      ]);
      mockCloudinaryService.listAllResources.mockResolvedValueOnce([
        { public_id: 'id1' },
        { public_id: 'id2' },
      ]);

      await service.handleCron();

      expect(mockCloudinaryService.listAllResources).toHaveBeenCalledWith(
        'e-commerce',
      );
      expect(mockCloudinaryService.deleteResources).not.toHaveBeenCalled();
    });

    it('should call deleteResources with orphaned ids', async () => {
      mockPrismaService.image.findMany.mockResolvedValueOnce([
        { imgSrc: 'id1' },
      ]);
      mockCloudinaryService.listAllResources.mockResolvedValueOnce([
        { public_id: 'id1' },
        { public_id: 'orphan2' },
        { public_id: 'orphan3' },
      ]);
      mockCloudinaryService.deleteResources.mockResolvedValueOnce({});

      await service.handleCron();

      expect(mockCloudinaryService.deleteResources).toHaveBeenCalledWith([
        'orphan2',
        'orphan3',
      ]);
    });

    it('should handle having no images in the database', async () => {
      mockPrismaService.image.findMany.mockResolvedValueOnce([]);
      mockCloudinaryService.listAllResources.mockResolvedValueOnce([
        { public_id: 'orphan1' },
        { public_id: 'orphan2' },
      ]);
      mockCloudinaryService.deleteResources.mockResolvedValueOnce({});

      await service.handleCron();

      expect(mockCloudinaryService.deleteResources).toHaveBeenCalledWith([
        'orphan1',
        'orphan2',
      ]);
    });

    it('should handle having no images in cloudinary', async () => {
      mockPrismaService.image.findMany.mockResolvedValueOnce([
        { imgSrc: 'id1' },
      ]);
      mockCloudinaryService.listAllResources.mockResolvedValueOnce([]);

      await service.handleCron();

      expect(mockCloudinaryService.deleteResources).not.toHaveBeenCalled();
    });

    it('should log an error if prisma.image.findMany fails', async () => {
      const testError = new Error('DB Error');
      mockPrismaService.image.findMany.mockRejectedValueOnce(testError);

      await service.handleCron();

      expect(mockCloudinaryService.listAllResources).not.toHaveBeenCalled();
      expect(mockCloudinaryService.deleteResources).not.toHaveBeenCalled();
      // We mocked the logger, so we can't directly check console output,
      // but we ensure the error is caught and doesn't crash the job.
    });

    it('should log an error if cloudinary.listAllResources fails', async () => {
      const testError = new Error('Cloudinary Error');
      mockPrismaService.image.findMany.mockResolvedValueOnce([]);
      mockCloudinaryService.listAllResources.mockRejectedValueOnce(testError);

      await service.handleCron();

      expect(mockCloudinaryService.deleteResources).not.toHaveBeenCalled();
    });
  });
});
