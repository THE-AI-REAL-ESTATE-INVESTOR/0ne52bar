import { type Member, type Visit, type Prisma, type MembershipLevel } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export interface CreateMemberParams {
  data: {
    name: string;
    email: string;
    phoneNumber: string;
    birthday?: Date;
    agreeToTerms: boolean;
    membershipLevel?: MembershipLevel;
    points?: number;
    visitCount?: number;
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
    // First check for existing member by email or phone
    const existingMember = await prisma.member.findFirst({
      where: {
        OR: [
          { email: data.email },
          { phoneNumber: data.phoneNumber }
        ]
      }
    });

    if (existingMember) {
      return existingMember;
    }

    // Check for existing customer by phone number or email
    const existingCustomer = await prisma.customer.findFirst({
      where: {
        OR: [
          { phoneNumber: data.phoneNumber },
          { email: { not: null, equals: data.email } }
        ]
      }
    });

    // Create member record in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Get or create customer
      let customer;
      if (existingCustomer) {
        customer = await tx.customer.update({
          where: { id: existingCustomer.id },
          data: {
            name: data.name,
            email: data.email,
            marketingConsent: data.agreeToTerms
          }
        });
      } else {
        customer = await tx.customer.create({
          data: {
            name: data.name,
            phoneNumber: data.phoneNumber,
            email: data.email,
            marketingConsent: data.agreeToTerms,
            orderCount: 0
          }
        });
      }

      // Create member record
      const member = await tx.member.create({
        data: {
          memberId,
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          birthday: data.birthday || new Date(),
          agreeToTerms: data.agreeToTerms,
          customerId: customer.id,
          membershipLevel: data.membershipLevel || 'BRONZE',
          points: data.points || 0,
          visitCount: data.visitCount || 0,
          joinDate: new Date(),
          lastVisit: data.lastVisit || new Date()
        }
      });

      // Create initial visit record if specified
      if (data.visitHistory?.create) {
        await tx.visit.create({
          data: {
            memberId: member.id,
            ...data.visitHistory.create
          }
        });
      }

      return member;
    });

    return result;
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
        visitCount: {
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
  async update(memberId: string, data: Partial<Omit<CreateMemberParams['data'], 'visitCount'>>) {
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
    return prisma.member.findMany({
      orderBy: {
        joinDate: 'desc'
      }
    });
  },

  /**
   * Upgrade a member's membership level
   */
  async upgradeMembership(id: string, level: MembershipLevel) {
    return prisma.member.update({
      where: { id },
      data: {
        membershipLevel: level
      }
    });
  },

  /**
   * Create a new reward for a member
   */
  async createReward(id: string, rewardType: string, description: string, value: number, expiryDays?: number) {
    const expiresAt = expiryDays ? new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000) : null;

    return prisma.reward.create({
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

  /**
   * Get a member by email
   */
  async getMemberByEmail(email: string) {
    return prisma.member.findUnique({
      where: { email },
      include: {
        visitHistory: true
      }
    });
  }
}; 