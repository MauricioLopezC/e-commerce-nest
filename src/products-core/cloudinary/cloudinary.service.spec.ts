import { Test, TestingModule } from '@nestjs/testing';
import { CloudinaryService } from './cloudinary.service';
import { v2 as cloudinary } from 'cloudinary';

jest.mock('cloudinary');

describe('CloudinaryService', () => {
  let service: CloudinaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CloudinaryService],
    }).compile();

    service = module.get<CloudinaryService>(CloudinaryService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('listAllResources', () => {
    const mockApi = cloudinary.api as jest.Mocked<typeof cloudinary.api>;

    it('should return all resources from a single page', async () => {
      const mockResponse = {
        resources: [{ public_id: 'id1' }, { public_id: 'id2' }],
      };
      (mockApi.resources as jest.Mock).mockResolvedValue(mockResponse);

      const resources = await service.listAllResources('test-folder');

      expect(mockApi.resources).toHaveBeenCalledTimes(1);
      expect(mockApi.resources).toHaveBeenCalledWith({
        type: 'upload',
        prefix: 'test-folder',
        max_results: 500,
        next_cursor: null,
      });
      expect(resources).toEqual(mockResponse.resources);
    });

    it('should handle pagination and return all resources from multiple pages', async () => {
      const page1Response = {
        resources: [{ public_id: 'id1' }],
        next_cursor: 'next_cursor_string',
      };
      const page2Response = {
        resources: [{ public_id: 'id2' }],
      };

      (mockApi.resources as jest.Mock)
        .mockResolvedValueOnce(page1Response)
        .mockResolvedValueOnce(page2Response);

      const resources = await service.listAllResources('test-folder');

      expect(mockApi.resources).toHaveBeenCalledTimes(2);
      expect(mockApi.resources).toHaveBeenCalledWith({
        type: 'upload',
        prefix: 'test-folder',
        max_results: 500,
        next_cursor: null,
      });
      expect(mockApi.resources).toHaveBeenCalledWith({
        type: 'upload',
        prefix: 'test-folder',
        max_results: 500,
        next_cursor: 'next_cursor_string',
      });
      expect(resources).toEqual([{ public_id: 'id1' }, { public_id: 'id2' }]);
    });

    it('should return an empty array if no resources are found', async () => {
      const mockResponse = {
        resources: [],
      };
      (mockApi.resources as jest.Mock).mockResolvedValue(mockResponse);

      const resources = await service.listAllResources('test-folder');

      expect(mockApi.resources).toHaveBeenCalledTimes(1);
      expect(resources).toEqual([]);
    });

    it('should throw an error if the cloudinary API fails', async () => {
      const testError = new Error('API Failed');
      (mockApi.resources as jest.Mock).mockRejectedValue(testError);

      await expect(service.listAllResources('test-folder')).rejects.toThrow(
        testError,
      );
    });
  });
});
