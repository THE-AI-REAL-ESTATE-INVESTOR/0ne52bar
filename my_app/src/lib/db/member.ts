import { MembershipLevel, type Prisma } from '@prisma/client';
import { db } from './index';
import { type RegistrationFormData } from '@/lib/validations';

interface CreateMemberParams {
  data: RegistrationFormData;
  memberId: string;
}

interface FindMemberParams {
  email?: string;
  phoneNumber?: string;
  memberId?: string;
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
    return db.member.create({
      data: {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        birthday: new Date(data.birthday),
        agreeToTerms: data.agreeToTerms,
        memberId,
        membershipLevel: MembershipLevel.BRONZE, // All new members start at BRONZE
        joinDate: new Date(),
      },
    });
  },

  /**
   * Find a member by email, phone number, or member ID
   */
  async find({ email, phoneNumber, memberId }: FindMemberParams) {
    if (!email && !phoneNumber && !memberId) {
      throw new Error('At least one search parameter is required');
    }

    const whereClause: Prisma.MemberWhereInput = {};

    if (email) {
      whereClause.email = email;
    }

    if (phoneNumber) {
      whereClause.phoneNumber = phoneNumber;
    }

    if (memberId) {
      whereClause.memberId = memberId;
    }

    return db.member.findFirst({
      where: whereClause,
      include: {
        rewards: {
          where: {
            isRedeemed: false,
            OR: [
              { expiresAt: null },
              { expiresAt: { gt: new Date() } },
            ],
          },
        },
        visits: {
          orderBy: {
            visitDate: 'desc',
          },
          take: 5,
        },
      },
    });
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
   * Update a member
   */
  async update(id: string, data: Partial<RegistrationFormData>) {
    return db.member.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.email && { email: data.email }),
        ...(data.phoneNumber && { phoneNumber: data.phoneNumber }),
        ...(data.birthday && { birthday: new Date(data.birthday) }),
        ...(data.agreeToTerms !== undefined && { agreeToTerms: data.agreeToTerms }),
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
   * Record a new visit for a member
   */
  async recordVisit(id: string, amount: number) {
    const points = Math.floor(amount); // 1 point per dollar spent

    return db.visit.create({
      data: {
        member: {
          connect: { id },
        },
        amount,
        points,
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

  /**
   * Redeem a reward
   */
  async redeemReward(id: string) {
    return db.reward.update({
      where: { id },
      data: {
        isRedeemed: true,
        redeemedAt: new Date(),
      },
    });
  },
}; 