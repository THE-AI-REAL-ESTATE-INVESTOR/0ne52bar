'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const memberUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().optional(),
  membershipLevel: z.enum(['BRONZE', 'SILVER', 'GOLD']),
  points: z.number().min(0, 'Points cannot be negative'),
});

export type MemberUpdateData = z.infer<typeof memberUpdateSchema>;

export async function updateMember(id: string, data: MemberUpdateData) {
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