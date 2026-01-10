import { Test, TestingModule } from '@nestjs/testing';
import { ImagesService } from './images.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { NotFoundError } from 'src/common/errors/not-found-error';
import { UploadImageError } from 'src/common/errors/upload-image-error';
import { ValidationError } from 'src/common/errors/validation-error';

// Mock data and services
const mockPrismaService = {
  productSku: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
  image: {
    create: jest.fn(),
    createMany: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
  },
};

const mockCloudinaryService = {
  uploadFile: jest.fn(),
  uploadMultipleFiles: jest.fn(),
  destroyImage: jest.fn(),
  listAllResources: jest.fn(),
  deleteResources: jest.fn(),
};

const file: Express.Multer.File = {
  fieldname: 'file',
  originalname: 'test.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  size: 1024,
  buffer: Buffer.from('test'),
  stream: null,
  destination: '',
  filename: '',
  path: '',
};

describe('ImagesService', () => {
  let service: ImagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImagesService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: CloudinaryService, useValue: mockCloudinaryService },
      ],
    }).compile();

    service = module.get<ImagesService>(ImagesService);
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAndUpload', () => {
    it('should upload a file and create an image record', async () => {
      mockPrismaService.productSku.findUnique.mockResolvedValueOnce({
        id: 1,
        productId: 1,
      });
      mockCloudinaryService.uploadFile.mockResolvedValueOnce({
        public_id: 'public_id_1',
        secure_url: 'secure_url_1',
      });
      mockPrismaService.image.create.mockResolvedValueOnce({});

      const result = await service.createAndUpload(file, 1, 1);

      expect(mockPrismaService.productSku.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockCloudinaryService.uploadFile).toHaveBeenCalledWith(
        file,
        'e-commerce',
      );
      expect(mockPrismaService.image.create).toHaveBeenCalledWith({
        data: {
          productId: 1,
          productSkuId: 1,
          imgSrc: 'public_id_1',
        },
      });
      expect(result).toEqual({
        public_id: 'public_id_1',
        secure_url: 'secure_url_1',
      });
    });

    it('should throw NotFoundError if productSku is not found', async () => {
      mockPrismaService.productSku.findUnique.mockResolvedValueOnce(null);

      await expect(service.createAndUpload(file, 1, 1)).rejects.toThrow(
        NotFoundError,
      );
      expect(mockCloudinaryService.uploadFile).not.toHaveBeenCalled();
    });

    it('should throw NotFoundError if productSku does not belong to product', async () => {
      mockPrismaService.productSku.findUnique.mockResolvedValueOnce({
        id: 1,
        productId: 99,
      }); // Mismatched productId

      await expect(service.createAndUpload(file, 1, 1)).rejects.toThrow(
        NotFoundError,
      );
      expect(mockCloudinaryService.uploadFile).not.toHaveBeenCalled();
    });

    it('should throw UploadImageError if cloudinary upload fails', async () => {
      mockPrismaService.productSku.findUnique.mockResolvedValueOnce({
        id: 1,
        productId: 1,
      });
      mockCloudinaryService.uploadFile.mockRejectedValueOnce(new Error());

      await expect(service.createAndUpload(file, 1, 1)).rejects.toThrow(
        UploadImageError,
      );
      expect(mockPrismaService.image.create).not.toHaveBeenCalled();
    });
  });

  describe('batchCreateAndUpload', () => {
    const files = [file, file];
    const metadata = [
      { productId: 1, productSkuId: 1 },
      { productId: 2, productSkuId: 2 },
    ];
    const skus = [
      { id: 1, productId: 1 },
      { id: 2, productId: 2 },
    ];
    const cloudinaryResponses = [
      { public_id: 'public_id_1', secure_url: 'secure_url_1' },
      { public_id: 'public_id_2', secure_url: 'secure_url_2' },
    ];

    it('should upload multiple files and create image records', async () => {
      mockPrismaService.productSku.findMany.mockResolvedValueOnce(skus);
      mockCloudinaryService.uploadMultipleFiles.mockResolvedValueOnce(
        cloudinaryResponses,
      );
      mockPrismaService.image.createMany.mockResolvedValueOnce({ count: 2 });

      const result = await service.batchCreateAndUpload(files, metadata);

      expect(mockPrismaService.productSku.findMany).toHaveBeenCalledWith({
        where: { id: { in: [1, 2] } },
        select: { id: true, productId: true },
      });
      expect(mockCloudinaryService.uploadMultipleFiles).toHaveBeenCalledWith(
        files,
        'e-commerce',
      );
      expect(mockPrismaService.image.createMany).toHaveBeenCalledWith({
        data: [
          {
            imgSrc: 'public_id_1',
            productId: 1,
            productSkuId: 1,
          },
          {
            imgSrc: 'public_id_2',
            productId: 2,
            productSkuId: 2,
          },
        ],
      });
      expect(result).toEqual(cloudinaryResponses);
    });

    it('should throw ValidationError if files and metadata length mismatch', async () => {
      await expect(
        service.batchCreateAndUpload([file], metadata),
      ).rejects.toThrow(ValidationError);
      expect(mockPrismaService.productSku.findMany).not.toHaveBeenCalled();
    });

    it('should throw NotFoundError if a productSku is not found', async () => {
      mockPrismaService.productSku.findMany.mockResolvedValueOnce([skus[0]]); // Return only one SKU

      await expect(
        service.batchCreateAndUpload(files, metadata),
      ).rejects.toThrow(NotFoundError);
      expect(
        mockCloudinaryService.uploadMultipleFiles,
      ).not.toHaveBeenCalled();
    });

    it('should throw UploadImageError if cloudinary upload fails', async () => {
      mockPrismaService.productSku.findMany.mockResolvedValueOnce(skus);
      mockCloudinaryService.uploadMultipleFiles.mockRejectedValueOnce(
        new UploadImageError('Failed'),
      );

      await expect(
        service.batchCreateAndUpload(files, metadata),
      ).rejects.toThrow(UploadImageError);
      expect(mockPrismaService.image.createMany).not.toHaveBeenCalled();
    });
  });
});