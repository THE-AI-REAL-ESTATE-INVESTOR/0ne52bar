'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import type { Member } from '@prisma/client';

// Validation schema for member updates
const memberUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().optional(),
  membershipLevel: z.enum(['BRONZE', 'SILVER', 'GOLD']),
  points: z.number().min(0, 'Points cannot be negative'),
});

export type AdminMemberUpdateData = z.infer<typeof memberUpdateSchema>;

/**
 * Get all members with optional filtering and sorting
 */
export async function getAdminMembers(options?: {
  orderBy?: 'lastVisit' | 'points' | 'membershipLevel';
  order?: 'asc' | 'desc';
  filter?: {
    membershipLevel?: 'BRONZE' | 'SILVER' | 'GOLD';
    search?: string;
  };
}) {
  try {
    const members = await prisma.member.findMany({
      orderBy: options?.orderBy ? {
        [options.orderBy]: options.order || 'desc'
      } : {
        lastVisit: 'desc'
      },
      where: {
        ...(options?.filter?.membershipLevel && {
          membershipLevel: options.filter.membershipLevel
        }),
        ...(options?.filter?.search && {
          OR: [
            { name: { contains: options.filter.search, mode: 'insensitive' } },
            { email: { contains: options.filter.search, mode: 'insensitive' } },
            { memberId: { contains: options.filter.search, mode: 'insensitive' } }
          ]
        })
      }
    });

    return { success: true, members };
  } catch (error) {
    console.error('Error fetching members:', error);
    return {
      success: false,
      error: {
        message: 'Failed to fetch members'
      }
    };
  }
}

/**
 * Update a member's information
 */
export async function updateMember(id: string, data: AdminMemberUpdateData) {
  try {
    const validatedFields = memberUpdateSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        error: {
          message: 'Invalid form data',
          errors: validatedFields.error.flatten().fieldErrors,
        },
      };
    }

    await prisma.member.update({
      where: { id },
      data: validatedFields.data,
    });

    revalidatePath('/admin/tappass');
    return { success: true };
  } catch (error) {
    console.error('Error updating member:', error);
    return {
      success: false,
      error: {
        message: 'Failed to update member',
      },
    };
  }
}

/**
 * Delete a member and their associated data
 */
export async function deleteMember(id: string) {
  try {
    // First delete all visits associated with this member
    await prisma.visit.deleteMany({
      where: { memberId: id },
    });

    // Then delete the member
    await prisma.member.delete({
      where: { id },
    });

    revalidatePath('/admin/tappass');
    return { success: true };
  } catch (error) {
    console.error('Error deleting member:', error);
    return {
      success: false,
      error: {
        message: 'Failed to delete member',
      },
    };
  }
} 