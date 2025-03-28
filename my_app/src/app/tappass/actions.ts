/**
 * TapPass Actions
 * Server actions for TapPass membership functionality
 */

"use server";

import { prisma } from '@/lib/prisma';
import { memberService } from '@/lib/db/member';
import { ZodError } from 'zod';
import { registrationSchema } from '@/lib/validations/tappass';
import { revalidatePath } from 'next/cache';
import type { MembershipLevel } from '@prisma/client';

type MemberResponse = {
  id: string;
  memberId: string;
  name: string;
  email: string;
  phoneNumber: string;
  birthday: string;
  agreeToTerms: boolean;
  membershipLevel: MembershipLevel;
  points: number;
  visitCount: number;
  joinDate: string;
  lastVisit: string | null;
  visitHistory: Array<{
    id: string;
    memberId: string;
    visitDate: string;
    points: number;
    amount: number;
  }>;
};

type RegisterResponse = {
  success: boolean;
  member?: MemberResponse;
  error?: string;
};

/**
 * Get a member by email
 */
export async function getMemberByEmail(email: string) {
  try {
    console.log(`[Server] Looking for member with email: ${email}`);
    
    const member = await memberService.find({ email });
    
    if (member) {
      console.log(`[Server] Member found: ${member.name}, ID: ${member.memberId}`);
      return {
        success: true,
        member: {
          ...member,
          birthday: member.birthday.toISOString().split('T')[0], // Format as YYYY-MM-DD
          joinDate: member.joinDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
          lastVisit: member.lastVisit ? member.lastVisit.toISOString().split('T')[0] : null
        }
      };
    } else {
      console.log(`[Server] No member found with email: ${email}`);
      return {
        success: false,
        error: "Member not found"
      };
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('[Server] Error getting member by email:', error);
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Register a new TapPass member
 */
export async function registerTapPassMember(formData: FormData): Promise<RegisterResponse> {
  try {
    // Extract form data
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const birthday = formData.get('birthday') as string;
    const phoneNumber = formData.get('phoneNumber') as string;
    const agreeToTerms = formData.get('agreeToTerms') === 'true';
    
    // Validate with Zod schema
    try {
      registrationSchema.parse({
        name,
        email,
        birthday,
        phoneNumber,
        agreeToTerms
      });
    } catch (validationError) {
      if (validationError instanceof ZodError) {
        return { 
          success: false, 
          error: validationError.errors.map(err => err.message).join(', ')
        };
      }
      return { success: false, error: 'Invalid form data' };
    }

    // First check for existing member by email
    const existingMember = await memberService.find({ email });
    
    if (existingMember) {
      console.log(`[Server] Found existing member: ${existingMember.name}, ID: ${existingMember.memberId}`);
      return {
        success: true,
        member: {
          id: existingMember.id,
          memberId: existingMember.memberId,
          name: existingMember.name,
          email: existingMember.email,
          phoneNumber: existingMember.phoneNumber,
          birthday: existingMember.birthday.toISOString().split('T')[0],
          agreeToTerms: existingMember.agreeToTerms,
          membershipLevel: existingMember.membershipLevel,
          points: existingMember.points,
          visitCount: existingMember.visitCount,
          joinDate: existingMember.joinDate.toISOString().split('T')[0],
          lastVisit: existingMember.lastVisit ? existingMember.lastVisit.toISOString().split('T')[0] : null,
          visitHistory: []
        }
      };
    }

    // Generate member ID
    const randomPart = Math.floor(1000 + Math.random() * 9000).toString();
    const memberCount = await prisma.member.count();
    const sequentialId = (memberCount + 2000).toString().padStart(4, '0');
    const memberId = `ONE52-${randomPart}-${sequentialId}`;

    // Create new member using memberService
    const result = await memberService.create({
      memberId,
      data: {
        name,
        email,
        phoneNumber,
        birthday: new Date(birthday),
        agreeToTerms,
        visitHistory: {
          create: {
            visitDate: new Date(),
            points: 100, // Signup bonus
            amount: 0
          }
        }
      }
    });

    // Format dates for response
    const formattedMember: MemberResponse = {
      id: result.id,
      memberId: result.memberId,
      name: result.name,
      email: result.email,
      phoneNumber: result.phoneNumber,
      birthday: result.birthday.toISOString().split('T')[0],
      agreeToTerms: result.agreeToTerms,
      membershipLevel: result.membershipLevel,
      points: result.points,
      visitCount: result.visitCount,
      joinDate: result.joinDate.toISOString().split('T')[0],
      lastVisit: result.lastVisit ? result.lastVisit.toISOString().split('T')[0] : null,
      visitHistory: []
    };
    
    // Revalidate the path to ensure fresh data
    revalidatePath('/tappass');
    
    // Return success response
    return {
      success: true,
      member: formattedMember
    };
    
  } catch (error) {
    console.error('Error registering member:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to register member'
    };
  }
}

/**
 * Email a membership card to a member
 */
export async function emailMembershipCard(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const memberId = formData.get('memberId') as string;
    
    // In a real implementation, you would send an email here
    // For now, we'll just log it
    console.log(`Sending membership card to ${email} for member ${memberId}`);
    
    // TODO: Implement actual email sending logic
    
    return {
      success: true
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error emailing membership card:', error);
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Get all members with their visit history
 */
export async function getAllMembers() {
  try {
    const members = await memberService.findAll({
      include: {
        visitHistory: {
          orderBy: { visitDate: 'desc' },
          take: 5
        }
      }
    });
    
    return {
      success: true,
      members
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error getting all members:', error);
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Record a new visit for a member
 */
export async function recordVisit(memberId: string, amount: number) {
  try {
    const result = await memberService.recordVisit(memberId, amount);
    
    if (!result.success || !result.member) {
      return result;
    }
    
    // Check if member should be upgraded based on points
    const newLevel = await checkAndUpdateMembershipLevel(result.member.id);
    
    return {
      success: true,
      visit: result.visit,
      newPoints: result.newPoints,
      membershipLevel: newLevel
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error recording visit:', error);
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Check and update membership level based on points
 */
async function checkAndUpdateMembershipLevel(memberId: string) {
  const member = await prisma.member.findUnique({
    where: { id: memberId }
  });
  
  if (!member) return 'BRONZE';
  
  let newLevel = member.membershipLevel;
  
  // Simple level rules based on points
  if (member.points >= 10000) {
    newLevel = 'PLATINUM';
  } else if (member.points >= 5000) {
    newLevel = 'GOLD';
  } else if (member.points >= 1000) {
    newLevel = 'SILVER';
  }
  
  // Update if level changed
  if (newLevel !== member.membershipLevel) {
    await prisma.member.update({
      where: { id: member.id },
      data: { membershipLevel: newLevel }
    });
  }
  
  return newLevel;
}

/**
 * Get member statistics
 */
export async function getMemberStats() {
  try {
    const totalMembers = await prisma.member.count();
    const newMembersToday = await prisma.member.count({
      where: {
        joinDate: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    });
    const visitsToday = await prisma.visit.count({
      where: {
        visitDate: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    });
    const pointsAwarded = await prisma.visit.aggregate({
      _sum: {
        points: true
      },
      where: {
        visitDate: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30))
        }
      }
    });
    
    return {
      success: true,
      stats: {
        totalMembers,
        newMembersToday,
        visitsToday,
        pointsLast30Days: pointsAwarded._sum.points || 0
      }
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error getting member stats:', error);
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Check if a customer has a TapPass membership by phone number
 */
export async function checkMembershipByPhone(phoneNumber: string) {
  try {
    const member = await memberService.find({ phoneNumber });
    
    if (member) {
      return {
        success: true,
        member: {
          ...member,
          birthday: member.birthday.toISOString().split('T')[0],
          joinDate: member.joinDate.toISOString().split('T')[0],
          lastVisit: member.lastVisit ? member.lastVisit.toISOString().split('T')[0] : null
        }
      };
    } else {
      return {
        success: false,
        error: "Member not found"
      };
    }
  } catch (error) {
    console.error('Error checking membership:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to check membership'
    };
  }
} 