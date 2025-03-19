'use server';

import { prisma } from '@/lib/prisma';
import type { ApiResponse } from '@/lib/utils/api-response';
import type { Member, Visit } from '@prisma/client';

interface ListMembersParams {
  page: number;
  pageSize: number;
}

interface MemberWithVisits extends Member {
  visitHistory: Visit[];
}

interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export async function listMembers({ page, pageSize }: ListMembersParams): Promise<PaginatedResponse<MemberWithVisits[]>> {
  try {
    const skip = (page - 1) * pageSize;
    
    const members = await prisma.member.findMany({
      skip,
      take: pageSize,
      orderBy: {
        joinDate: 'desc'
      },
      include: {
        visitHistory: {
          orderBy: {
            visitDate: 'desc'
          },
          take: 5
        }
      }
    });

    const total = await prisma.member.count();

    return {
      success: true,
      data: members,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  } catch (error) {
    console.error('Error listing members:', error);
    return {
      success: false,
      error: {
        message: 'Failed to list members',
        code: 'LIST_MEMBERS_ERROR'
      }
    };
  }
}

export async function getMemberById(id: string): Promise<ApiResponse<MemberWithVisits>> {
  try {
    const member = await prisma.member.findUnique({
      where: { id },
      include: {
        visitHistory: {
          orderBy: {
            visitDate: 'desc'
          }
        }
      }
    });

    if (!member) {
      return {
        success: false,
        error: {
          message: 'Member not found',
          code: 'MEMBER_NOT_FOUND'
        }
      };
    }

    return {
      success: true,
      data: member
    };
  } catch (error) {
    console.error('Error getting member:', error);
    return {
      success: false,
      error: {
        message: 'Failed to get member',
        code: 'GET_MEMBER_ERROR'
      }
    };
  }
}

export async function updateMember(id: string, data: Partial<Member>): Promise<ApiResponse<Member>> {
  try {
    const member = await prisma.member.update({
      where: { id },
      data
    });

    return {
      success: true,
      data: member
    };
  } catch (error) {
    console.error('Error updating member:', error);
    return {
      success: false,
      error: {
        message: 'Failed to update member',
        code: 'UPDATE_MEMBER_ERROR'
      }
    };
  }
}

export async function deleteMember(id: string): Promise<ApiResponse<void>> {
  try {
    await prisma.member.delete({
      where: { id }
    });

    return {
      success: true
    };
  } catch (error) {
    console.error('Error deleting member:', error);
    return {
      success: false,
      error: {
        message: 'Failed to delete member',
        code: 'DELETE_MEMBER_ERROR'
      }
    };
  }
} 