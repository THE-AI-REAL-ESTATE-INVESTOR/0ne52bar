/**
 * Tests for TapPassMember server actions
 */

// Import the actions to test
import {
  create,
  getById,
  list,
  update,
  remove
} from './tapPassMember';

// Import types and utilities
import { ErrorCode } from '@/lib/utils/error-handler';

// Mock the Prisma client
jest.mock('@/lib/prisma');

// Import the mocked Prisma client and error classes
import { prisma, PrismaClientKnownRequestError } from '@/lib/prisma';

describe('TapPassMember Actions', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a TapPassMember when valid data is provided', async () => {
      // Arrange
      const mockMember = {
        id: 'mock-id',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '555-123-4567',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Mock the Prisma create method
      (prisma.tapPassMember.create as jest.Mock).mockResolvedValue(mockMember);

      // Act
      const result = await create({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '555-123-4567',
        status: 'ACTIVE'
      });

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockMember);
      expect(prisma.tapPassMember.create).toHaveBeenCalledWith({
        data: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '555-123-4567',
          status: 'ACTIVE'
        }
      });
    });

    it('should return an error when validation fails', async () => {
      // Act
      const result = await create({
        name: '', // Invalid: empty name
        email: 'not-an-email', // Invalid: not a valid email
        phone: '123', // Invalid: too short
        status: 'UNKNOWN' as any // Invalid: not a valid status
      });

      // Assert
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCode.VALIDATION_ERROR);
      expect(prisma.tapPassMember.create).not.toHaveBeenCalled();
    });

    it('should handle database errors', async () => {
      // Arrange
      const dbError = new PrismaClientKnownRequestError('Database error', { code: 'P2002' });
      (prisma.tapPassMember.create as jest.Mock).mockRejectedValue(dbError);

      // Act
      const result = await create({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '555-123-4567',
        status: 'ACTIVE'
      });

      // Assert
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCode.CONFLICT);
    });
  });

  describe('getById', () => {
    it('should return a TapPassMember when it exists', async () => {
      // Arrange
      const mockMember = {
        id: 'mock-id',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '555-123-4567',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      (prisma.tapPassMember.findUnique as jest.Mock).mockResolvedValue(mockMember);

      // Act
      const result = await getById('mock-id');

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockMember);
      expect(prisma.tapPassMember.findUnique).toHaveBeenCalledWith({
        where: { id: 'mock-id' }
      });
    });

    it('should return a not found error when member does not exist', async () => {
      // Arrange
      (prisma.tapPassMember.findUnique as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await getById('non-existent-id');

      // Assert
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCode.NOT_FOUND);
    });
  });

  describe('list', () => {
    it('should return a list of members', async () => {
      // Arrange
      const mockMembers = [
        {
          id: 'mock-id-1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '555-123-4567',
          status: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'mock-id-2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '555-765-4321',
          status: 'INACTIVE',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      (prisma.tapPassMember.findMany as jest.Mock).mockResolvedValue(mockMembers);
      (prisma.tapPassMember.count as jest.Mock).mockResolvedValue(2);

      // Act
      const result = await list({ page: 1, pageSize: 10 });

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockMembers);
      expect(result.meta?.pagination).toEqual({
        currentPage: 1,
        pageSize: 10,
        totalItems: 2,
        totalPages: 1
      });
    });

    it('should handle empty results', async () => {
      // Arrange
      (prisma.tapPassMember.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.tapPassMember.count as jest.Mock).mockResolvedValue(0);

      // Act
      const result = await list({ page: 1, pageSize: 10 });

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
      expect(result.meta?.pagination.totalItems).toBe(0);
    });
  });

  describe('update', () => {
    it('should update a member when valid data is provided', async () => {
      // Arrange
      const mockUpdatedMember = {
        id: 'mock-id',
        name: 'John Updated',
        email: 'john.updated@example.com',
        phone: '555-999-8888',
        status: 'INACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      (prisma.tapPassMember.update as jest.Mock).mockResolvedValue(mockUpdatedMember);

      // Act
      const result = await update('mock-id', {
        name: 'John Updated',
        email: 'john.updated@example.com',
        phone: '555-999-8888',
        status: 'INACTIVE'
      });

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockUpdatedMember);
      expect(prisma.tapPassMember.update).toHaveBeenCalledWith({
        where: { id: 'mock-id' },
        data: {
          name: 'John Updated',
          email: 'john.updated@example.com',
          phone: '555-999-8888',
          status: 'INACTIVE'
        }
      });
    });

    it('should return an error when validation fails', async () => {
      // Act
      const result = await update('mock-id', {
        name: '', // Invalid: empty name
        email: 'invalid-email', // Invalid: not a valid email
        phone: '123', // Invalid: too short
        status: 'UNKNOWN' as any // Invalid: not a valid status
      });

      // Assert
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCode.VALIDATION_ERROR);
      expect(prisma.tapPassMember.update).not.toHaveBeenCalled();
    });

    it('should handle not found errors', async () => {
      // Arrange
      const prismaError = new PrismaClientKnownRequestError('Record not found', { code: 'P2025' });
      (prisma.tapPassMember.update as jest.Mock).mockRejectedValue(prismaError);

      // Act
      const result = await update('non-existent-id', {
        name: 'John Updated',
        email: 'john.updated@example.com',
        phone: '555-999-8888',
        status: 'INACTIVE'
      });

      // Assert
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCode.NOT_FOUND);
    });
  });

  describe('remove', () => {
    it('should delete a member when it exists', async () => {
      // Arrange
      const mockDeletedMember = {
        id: 'mock-id',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '555-123-4567',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      (prisma.tapPassMember.delete as jest.Mock).mockResolvedValue(mockDeletedMember);

      // Act
      const result = await remove('mock-id');

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockDeletedMember);
      expect(prisma.tapPassMember.delete).toHaveBeenCalledWith({
        where: { id: 'mock-id' }
      });
    });

    it('should handle not found errors', async () => {
      // Arrange
      const prismaError = new PrismaClientKnownRequestError('Record not found', { code: 'P2025' });
      (prisma.tapPassMember.delete as jest.Mock).mockRejectedValue(prismaError);

      // Act
      const result = await remove('non-existent-id');

      // Assert
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCode.NOT_FOUND);
    });
  });
}); 