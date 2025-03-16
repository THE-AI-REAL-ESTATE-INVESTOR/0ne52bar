/**
 * TapPass Actions
 * Server actions for TapPass membership functionality
 */

"use server";

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get a member by email
 */
export async function getMemberByEmail(email: string) {
  try {
    console.log(`[Server] Looking for member with email: ${email}`);
    
    const member = await prisma.member.findUnique({
      where: { email }
    });
    
    if (member) {
      console.log(`[Server] Member found: ${member.name}, ID: ${member.memberId}`);
      return {
        success: true,
        member
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
export async function registerTapPassMember(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const birthday = formData.get('birthday') as string;
    const phoneNumber = formData.get('phoneNumber') as string;
    const agreeToTerms = formData.get('agreeToTerms') === 'true';
    
    // Check for required fields
    if (!name || !email || !birthday || !phoneNumber) {
      return {
        success: false,
        error: 'Missing required fields'
      };
    }
    
    // Check if member already exists
    const existingMember = await prisma.member.findUnique({
      where: { email }
    });
    
    if (existingMember) {
      return {
        success: true,
        memberId: existingMember.memberId
      };
    }
    
    // Generate member ID parts
    const randomPart = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Get count for sequential ID
    const memberCount = await prisma.member.count();
    const sequentialId = (memberCount + 1).toString().padStart(4, '0');
    
    const memberId = `ONE52-${randomPart}-${sequentialId}`;
    
    // Create the new member
    const newMember = await prisma.member.create({
      data: {
        memberId,
        name,
        email,
        phoneNumber,
        birthday: new Date(birthday),
        agreeToTerms,
        membershipLevel: 'BRONZE',
        joinDate: new Date(),
        points: 0,
        visits: 0
      }
    });
    
    // Record this as a visit
    await prisma.visit.create({
      data: {
        memberId: newMember.id,
        visitDate: new Date(),
        points: 100, // Signup bonus
        amount: 0
      }
    });
    
    return {
      success: true,
      memberId: newMember.memberId
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error registering member:', error);
    return {
      success: false,
      error: errorMessage
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
 * Get all members
 */
export async function getAllMembers() {
  try {
    const members = await prisma.member.findMany({
      orderBy: { joinDate: 'desc' },
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
    // Find the member
    const member = await prisma.member.findUnique({
      where: { memberId }
    });
    
    if (!member) {
      return {
        success: false,
        error: 'Member not found'
      };
    }
    
    // Calculate points (1 point per dollar spent)
    const points = Math.floor(amount);
    
    // Create visit record
    const visit = await prisma.visit.create({
      data: {
        memberId: member.id,
        visitDate: new Date(),
        amount,
        points
      }
    });
    
    // Update member stats
    await prisma.member.update({
      where: { id: member.id },
      data: {
        visits: { increment: 1 },
        points: { increment: points },
        lastVisit: new Date()
      }
    });
    
    // Check if member should be upgraded based on points
    const newLevel = await checkAndUpdateMembershipLevel(member.id);
    
    return {
      success: true,
      visit,
      newPoints: member.points + points,
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