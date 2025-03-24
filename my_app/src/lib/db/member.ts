import { type Member, type Visit, type Prisma, type MembershipLevel } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { type RegistrationFormData } from '@/lib/validations';
import { db } from './index';
import { DateTime } from 'luxon';

export interface CreateMemberParams {
  data: {
    name: string;
    email: string;
    phoneNumber: string;
    birthday?: Date;
    agreeToTerms: boolean;
    membershipLevel?: MembershipLevel;
    points?: number;
    visits?: number;
    lastVisit?: Date;
    visitHistory?: {
      create: {
        visitDate?: Date;
        points?: number;
        amount?: number;
      }
    }
  };
  memberId: string;
}

export interface FindMemberParams {
  email?: string;
  phoneNumber?: string;
  memberId?: string;
}

export interface RecordVisitResult {
  success: boolean;
  error?: string;
  member?: Member;
  visit?: Visit;
  newPoints?: number;
}

/**
 * Member database service
 * Handles all database operations related to TapPass members
 */
export const memberService = {
  /**
   * Create a new member
   */
  async create({ data, memberId }: CreateMemberParams) {
    return prisma.member.create({
      data: {
        ...data,
        memberId,
        membershipLevel: data.membershipLevel || 'BRONZE',
        visits: data.visits || 0
      }
    });
  },

  /**
   * Find a member by email, phone, or memberId
   */
  async find({ email, phoneNumber, memberId }: FindMemberParams) {
    if (!email && !phoneNumber && !memberId) {
      throw new Error('At least one search parameter is required');
    }

    return prisma.member.findFirst({
      where: {
        OR: [
          email ? { email } : {},
          phoneNumber ? { phoneNumber } : {},
          memberId ? { memberId } : {}
        ]
      },
      include: {
        visitHistory: true
      }
    });
  },

  /**
   * Get all members with optional include
   */
  async findAll(options?: { 
    include?: Prisma.MemberInclude; 
    orderBy?: Prisma.MemberOrderByWithRelationInput 
  }) {
    return prisma.member.findMany({
      orderBy: options?.orderBy || { joinDate: 'desc' },
      ...options
    });
  },

  /**
   * Record a visit for a member
   */
  async recordVisit(memberId: string, amount: number): Promise<RecordVisitResult> {
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
    const updatedMember = await prisma.member.update({
      where: { id: member.id },
      data: {
        visits: {
          increment: 1
        },
        points: {
          increment: points
        },
        lastVisit: new Date()
      }
    });

    return {
      success: true,
      member: updatedMember,
      visit,
      newPoints: updatedMember.points
    };
  },

  /**
   * Update a member's details
   */
  async update(memberId: string, data: Partial<Omit<CreateMemberParams['data'], 'visits'>>) {
    return prisma.member.update({
      where: { memberId },
      data: {
        ...data,
        membershipLevel: data.membershipLevel as MembershipLevel || undefined
      }
    });
  },

  /**
   * Delete a member
   */
  async delete(memberId: string) {
    return prisma.member.delete({
      where: { memberId }
    });
  },

  /**
   * Get member's visit history
   */
  async getVisitHistory(memberId: string, limit?: number) {
    return prisma.visit.findMany({
      where: {
        member: {
          memberId
        }
      },
      orderBy: {
        visitDate: 'desc'
      },
      take: limit
    });
  },

  /**
   * Add reward points to a member
   */
  async addPoints(memberId: string, points: number) {
    return prisma.member.update({
      where: { memberId },
      data: {
        points: {
          increment: points
        }
      }
    });
  },

  /**
   * Redeem points for a reward
   */
  async redeemReward(memberId: string) {
    // TODO: Implement reward redemption logic
    throw new Error('Not implemented');
  },

  /**
   * Get all members
   */
  async getAll() {
    return db.member.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  /**
   * Upgrade a member's membership level
   */
  async upgradeMembership(id: string, level: MembershipLevel) {
    return db.member.update({
      where: { id },
      data: {
        membershipLevel: level,
      },
    });
  },

  /**
   * Create a new reward for a member
   */
  async createReward(id: string, rewardType: string, description: string, value: number, expiryDays?: number) {
    const expiresAt = expiryDays ? new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000) : null;

    return db.reward.create({
      data: {
        member: {
          connect: { id },
        },
        rewardType,
        description,
        value,
        expiresAt,
      },
    });
  },
}; 