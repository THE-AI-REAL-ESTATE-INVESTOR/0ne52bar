/**
 * Tests for TapPassFormData server actions
 */

// Import the actions to test
import {
  createTapPassFormData,
  getTapPassFormData,
  listTapPassFormData,
  updateTapPassFormData,
  deleteTapPassFormData,
  updateTapPassFormDataStatus
} from './tapPassFormData';

// Import types and utilities
import { ErrorCode } from '@/lib/utils/error-handler';

// Mock the Prisma client
jest.mock('@/lib/prisma');

// Import the mocked Prisma client and error classes
import { prisma, PrismaClientKnownRequestError } from '@/lib/prisma';

describe('TapPassFormData Actions', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTapPassFormData', () => {
    it('should create a TapPassFormData when valid data is provided', async () => {
      // Arrange
      const mockSubmission = {
        id: 'mock-id',
        name: 'John Doe',
        email: 'john@example.com',
        businessName: 'John\'s Bar',
        businessWebsite: 'https://johnsbar.com',
        position: 'Owner',
        message: 'I would like to join TapPass',
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Mock the Prisma create method
      (prisma.tapPassFormData.create as jest.Mock).mockResolvedValue(mockSubmission);

      // Act
      const result = await createTapPassFormData({
        name: 'John Doe',
        email: 'john@example.com',
        businessName: 'John\'s Bar',
        businessWebsite: 'https://johnsbar.com',
        position: 'Owner',
        message: 'I would like to join TapPass'
      });

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockSubmission);
      expect(prisma.tapPassFormData.create).toHaveBeenCalledWith({
        data: {
          name: 'John Doe',
          email: 'john@example.com',
          businessName: 'John\'s Bar',
          businessWebsite: 'https://johnsbar.com',
          position: 'Owner',
          message: 'I would like to join TapPass',
          status: 'PENDING'
        }
      });
    });

    it('should return an error when validation fails', async () => {
      // Act
      const result = await createTapPassFormData({
        name: '', // Invalid: empty name
        email: 'not-an-email', // Invalid: not a valid email
        businessName: '', // Invalid: empty business name
        businessWebsite: 'not-a-url', // Invalid: not a valid URL
        position: '',
        message: ''
      });

      // Assert
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCode.VALIDATION_ERROR);
      expect(prisma.tapPassFormData.create).not.toHaveBeenCalled();
    });

    it('should handle database errors', async () => {
      // Arrange
      const dbError = new PrismaClientKnownRequestError('Database error', { code: 'P2002' });
      (prisma.tapPassFormData.create as jest.Mock).mockRejectedValue(dbError);

      // Act
      const result = await createTapPassFormData({
        name: 'John Doe',
        email: 'john@example.com',
        businessName: 'John\'s Bar',
        businessWebsite: 'https://johnsbar.com',
        position: 'Owner',
        message: 'I would like to join TapPass'
      });

      // Assert
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCode.CONFLICT);
    });
  });

  describe('getTapPassFormData', () => {
    it('should return a TapPassFormData when it exists', async () => {
      // Arrange
      const mockSubmission = {
        id: 'mock-id',
        name: 'John Doe',
        email: 'john@example.com',
        businessName: 'John\'s Bar',
        businessWebsite: 'https://johnsbar.com',
        position: 'Owner',
        message: 'I would like to join TapPass',
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      (prisma.tapPassFormData.findUnique as jest.Mock).mockResolvedValue(mockSubmission);

      // Act
      const result = await getTapPassFormData('mock-id');

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockSubmission);
      expect(prisma.tapPassFormData.findUnique).toHaveBeenCalledWith({
        where: { id: 'mock-id' }
      });
    });

    it('should return a not found error when submission does not exist', async () => {
      // Arrange
      (prisma.tapPassFormData.findUnique as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await getTapPassFormData('non-existent-id');

      // Assert
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCode.NOT_FOUND);
    });
  });

  describe('listTapPassFormData', () => {
    it('should return a list of submissions', async () => {
      // Arrange
      const mockSubmissions = [
        {
          id: 'mock-id-1',
          name: 'John Doe',
          email: 'john@example.com',
          businessName: 'John\'s Bar',
          businessWebsite: 'https://johnsbar.com',
          position: 'Owner',
          message: 'I would like to join TapPass',
          status: 'PENDING',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'mock-id-2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          businessName: 'Jane\'s Restaurant',
          businessWebsite: 'https://janesrestaurant.com',
          position: 'Manager',
          message: 'Interested in TapPass',
          status: 'APPROVED',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      (prisma.tapPassFormData.findMany as jest.Mock).mockResolvedValue(mockSubmissions);
      (prisma.tapPassFormData.count as jest.Mock).mockResolvedValue(2);

      // Act
      const result = await listTapPassFormData({ page: 1, pageSize: 10 });

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockSubmissions);
      expect(result.meta?.pagination).toEqual({
        currentPage: 1,
        pageSize: 10,
        totalItems: 2,
        totalPages: 1
      });
    });

    it('should handle filtering by status', async () => {
      // Arrange
      const mockSubmissions = [
        {
          id: 'mock-id-1',
          name: 'John Doe',
          email: 'john@example.com',
          businessName: 'John\'s Bar',
          businessWebsite: 'https://johnsbar.com',
          position: 'Owner',
          message: 'I would like to join TapPass',
          status: 'PENDING',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      (prisma.tapPassFormData.findMany as jest.Mock).mockResolvedValue(mockSubmissions);
      (prisma.tapPassFormData.count as jest.Mock).mockResolvedValue(1);

      // Act
      const result = await listTapPassFormData({ 
        page: 1, 
        pageSize: 10,
        status: 'PENDING'
      });

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockSubmissions);
      expect(prisma.tapPassFormData.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: 'PENDING' }
        })
      );
    });
  });

  describe('updateTapPassFormData', () => {
    it('should update a submission when valid data is provided', async () => {
      // Arrange
      const mockUpdatedSubmission = {
        id: 'mock-id',
        name: 'John Updated',
        email: 'john.updated@example.com',
        businessName: 'John\'s Updated Bar',
        businessWebsite: 'https://johnsupdatedbar.com',
        position: 'CEO',
        message: 'Updated message about TapPass',
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      (prisma.tapPassFormData.update as jest.Mock).mockResolvedValue(mockUpdatedSubmission);

      // Act
      const result = await updateTapPassFormData('mock-id', {
        name: 'John Updated',
        email: 'john.updated@example.com',
        businessName: 'John\'s Updated Bar',
        businessWebsite: 'https://johnsupdatedbar.com',
        position: 'CEO',
        message: 'Updated message about TapPass'
      });

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockUpdatedSubmission);
      expect(prisma.tapPassFormData.update).toHaveBeenCalledWith({
        where: { id: 'mock-id' },
        data: {
          name: 'John Updated',
          email: 'john.updated@example.com',
          businessName: 'John\'s Updated Bar',
          businessWebsite: 'https://johnsupdatedbar.com',
          position: 'CEO',
          message: 'Updated message about TapPass'
        }
      });
    });

    it('should handle not found errors', async () => {
      // Arrange
      const prismaError = new PrismaClientKnownRequestError('Record not found', { code: 'P2025' });
      (prisma.tapPassFormData.update as jest.Mock).mockRejectedValue(prismaError);

      // Act
      const result = await updateTapPassFormData('non-existent-id', {
        name: 'John Updated',
        email: 'john.updated@example.com',
        businessName: 'John\'s Updated Bar',
        businessWebsite: 'https://johnsupdatedbar.com',
        position: 'CEO',
        message: 'Updated message about TapPass'
      });

      // Assert
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCode.NOT_FOUND);
    });
  });

  describe('updateTapPassFormDataStatus', () => {
    it('should update the status of a submission', async () => {
      // Arrange
      const mockUpdatedSubmission = {
        id: 'mock-id',
        name: 'John Doe',
        email: 'john@example.com',
        businessName: 'John\'s Bar',
        businessWebsite: 'https://johnsbar.com',
        position: 'Owner',
        message: 'I would like to join TapPass',
        status: 'APPROVED',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      (prisma.tapPassFormData.update as jest.Mock).mockResolvedValue(mockUpdatedSubmission);

      // Act
      const result = await updateTapPassFormDataStatus('mock-id', 'APPROVED');

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockUpdatedSubmission);
      expect(prisma.tapPassFormData.update).toHaveBeenCalledWith({
        where: { id: 'mock-id' },
        data: { status: 'APPROVED' }
      });
    });

    it('should return an error when an invalid status is provided', async () => {
      // Act
      const result = await updateTapPassFormDataStatus('mock-id', 'INVALID_STATUS' as any);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCode.VALIDATION_ERROR);
      expect(prisma.tapPassFormData.update).not.toHaveBeenCalled();
    });

    it('should handle not found errors', async () => {
      // Arrange
      const prismaError = new PrismaClientKnownRequestError('Record not found', { code: 'P2025' });
      (prisma.tapPassFormData.update as jest.Mock).mockRejectedValue(prismaError);

      // Act
      const result = await updateTapPassFormDataStatus('non-existent-id', 'APPROVED');

      // Assert
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCode.NOT_FOUND);
    });
  });

  describe('deleteTapPassFormData', () => {
    it('should delete a submission when it exists', async () => {
      // Arrange
      const mockDeletedSubmission = {
        id: 'mock-id',
        name: 'John Doe',
        email: 'john@example.com',
        businessName: 'John\'s Bar',
        businessWebsite: 'https://johnsbar.com',
        position: 'Owner',
        message: 'I would like to join TapPass',
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      (prisma.tapPassFormData.delete as jest.Mock).mockResolvedValue(mockDeletedSubmission);

      // Act
      const result = await deleteTapPassFormData('mock-id');

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockDeletedSubmission);
      expect(prisma.tapPassFormData.delete).toHaveBeenCalledWith({
        where: { id: 'mock-id' }
      });
    });

    it('should handle not found errors', async () => {
      // Arrange
      const prismaError = new PrismaClientKnownRequestError('Record not found', { code: 'P2025' });
      (prisma.tapPassFormData.delete as jest.Mock).mockRejectedValue(prismaError);

      // Act
      const result = await deleteTapPassFormData('non-existent-id');

      // Assert
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCode.NOT_FOUND);
    });
  });
}); 